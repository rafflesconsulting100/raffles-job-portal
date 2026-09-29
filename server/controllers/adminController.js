const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { sendNotificationToUser } = require('../utils/socket');
const { getJwtSecret, getAdminPasskey, getAdminEmail } = require('../config/auth');

// Constant-time secret comparison: hashing first makes both sides fixed
// length, so timingSafeEqual is safe to call with unequal-length inputs.
const safeCompare = (provided, expected) => {
  const a = crypto.createHash('sha256').update(String(provided || ''), 'utf8').digest();
  const b = crypto.createHash('sha256').update(String(expected || ''), 'utf8').digest();
  return crypto.timingSafeEqual(a, b);
};

// Helper to generate Admin token response
const generateAdminToken = (adminUser) => {
  return jwt.sign(
    { id: adminUser._id },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Admin Login using Environment Passkey / Admin Credentials
// @route   POST /api/admin/login
// @access  Public
exports.adminLoginPasskey = async (req, res, next) => {
  try {
    const { email, password, passkey } = req.body;
    const providedPasskey = passkey || password;

    const envPasskey = getAdminPasskey();
    const envEmail = getAdminEmail();

    if (!envPasskey || !envEmail) {
      return res.status(503).json({
        success: false,
        message: 'Admin login is not configured on this server. Set ADMIN_PASSKEY and ADMIN_EMAIL.',
      });
    }

    if (!providedPasskey || typeof providedPasskey !== 'string') {
      return res.status(400).json({ success: false, message: 'Please provide administrator passkey/password' });
    }

    // Non-string `email` (object/array from the JSON body) used to throw on
    // .trim() and answer 500 on a public login endpoint.
    const requestedEmail = (typeof email === 'string' && email.trim().length > 0)
      ? email.trim().toLowerCase()
      : envEmail;

    // Check if provided passkey matches the ENV passkey.
    // Hash both sides first so the comparison is constant-time and cannot
    // leak the passkey length/prefix through timing.
    const isMasterPasskeyMatch = safeCompare(providedPasskey, envPasskey);

    // Check if user already exists in DB
    const adminUser = await User.findOne({ email: requestedEmail }).select('+password');

    let isPasswordMatch = false;
    if (adminUser && adminUser.password) {
      try {
        isPasswordMatch = await adminUser.comparePassword(providedPasskey);
      } catch (e) {
        isPasswordMatch = false;
      }
    }

    if (!isMasterPasskeyMatch && !isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials or passkey' });
    }

    // SECURITY: the passkey only authenticates the configured admin mailbox.
    // It must never be able to promote an arbitrary account to Admin.
    if (adminUser && adminUser.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'This account is not an administrator. Use the configured ADMIN_EMAIL account.',
      });
    }

    if (!adminUser) {
      if (!isMasterPasskeyMatch) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials or passkey' });
      }
      if (requestedEmail !== envEmail) {
        return res.status(403).json({
          success: false,
          message: 'Administrator accounts can only be created for the configured ADMIN_EMAIL.',
        });
      }

      const created = await User.create({
        username: 'Raffles Super Admin',
        email: envEmail,
        password: providedPasskey,
        role: 'Admin',
        status: 'Active',
        isApproved: true,
        employerAccess: true,
      });
      return sendAdminTokenResponse(created, res);
    }

    // Already an Admin: keep the legacy status flags consistent, never role.
    let needsSave = false;
    if (adminUser.status !== 'Active') { adminUser.status = 'Active'; needsSave = true; }
    if (adminUser.isApproved !== true) { adminUser.isApproved = true; needsSave = true; }
    if (adminUser.employerAccess !== true) { adminUser.employerAccess = true; needsSave = true; }
    if (needsSave) await adminUser.save();

    return sendAdminTokenResponse(adminUser, res);
  } catch (error) {
    next(error);
  }
};

const sendAdminTokenResponse = (adminUser, res) => {
  const token = generateAdminToken(adminUser);

  res.cookie('token', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }).status(200).json({
    success: true,
    message: 'Admin authorization successful',
    token,
    user: {
      _id: adminUser._id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      status: adminUser.status,
      isApproved: adminUser.isApproved,
      employerAccess: adminUser.employerAccess,
    },
  });
};

// @desc    Get Overall Platform Statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobSeekers = await User.countDocuments({ role: 'Job Seeker' });
    const totalEmployers = await User.countDocuments({ role: 'Employer' });
    
    const pendingEmployers = await User.countDocuments({
      role: 'Employer',
      $or: [{ status: 'Pending' }, { isApproved: false, status: { $nin: ['Suspended', 'Rejected'] } }]
    });

    const grantedEmployers = await User.countDocuments({
      role: 'Employer',
      status: 'Active',
      isApproved: { $ne: false },
      employerAccess: { $ne: false }
    });

    const suspendedEmployers = await User.countDocuments({
      role: 'Employer',
      $or: [{ status: 'Suspended' }, { status: 'Rejected' }, { employerAccess: false }]
    });

    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const closedJobs = await Job.countDocuments({ status: 'closed' });
    const totalApplications = await Application.countDocuments();

    const recentRegistrations = await User.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select('-password');

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalJobSeekers,
        totalEmployers,
        pendingEmployers,
        grantedEmployers,
        suspendedEmployers,
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
      },
      recentRegistrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Employers & Portal Access Status
// @route   GET /api/admin/employers
// @access  Private (Admin)
exports.getAllEmployers = async (req, res, next) => {
  try {
    const employers = await User.find({ role: 'Employer' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Enhance each employer with posted job counts & explicit approval status
    const employersWithStats = await Promise.all(
      employers.map(async (emp) => {
        const empObj = emp.toObject();
        const jobCount = await Job.countDocuments({ creator: emp._id });
        const activeJobCount = await Job.countDocuments({ creator: emp._id, status: 'active' });
        
        // Find all applications for employer's jobs
        const jobs = await Job.find({ creator: emp._id }).select('_id');
        const jobIds = jobs.map((j) => j._id);
        const applicantCount = await Application.countDocuments({ job: { $in: jobIds } });

        const dbApproval = (empObj.approvalStatus || '').toLowerCase();
        let finalApprovalStatus;
        if (dbApproval === 'rejected' || emp.status === 'Rejected') {
          finalApprovalStatus = 'rejected';
        } else if (dbApproval === 'pending' || emp.status === 'Pending') {
          finalApprovalStatus = 'pending';
        } else if (dbApproval === 'revoked' || emp.status === 'Suspended') {
          finalApprovalStatus = 'revoked';
        } else if (dbApproval === 'approved' || (emp.status === 'Active' && emp.isApproved !== false && emp.employerAccess !== false)) {
          finalApprovalStatus = 'approved';
        } else {
          finalApprovalStatus = 'pending';
        }

        const isGranted = finalApprovalStatus === 'approved';

        return {
          ...empObj,
          companyName: empObj.companyName || empObj.username || '',
          username: empObj.username || empObj.companyName || '',
          mobileNumber: empObj.mobileNumber || empObj.contactNumber || '',
          contactNumber: empObj.contactNumber || empObj.mobileNumber || '',
          jobCount,
          activeJobCount,
          applicantCount,
          isApproved: isGranted,
          employerAccess: isGranted,
          status: emp.status,
          approvalStatus: finalApprovalStatus,
          // Ensure mobile number is always available for frontend
          hasMobile: !!(empObj.mobileNumber || empObj.contactNumber),
        };
      })
    );

    res.status(200).json({
      success: true,
      count: employersWithStats.length,
      employers: employersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grant, Approve, Reject or Revoke Employer Portal Access
// @route   PUT /api/admin/employers/:id/access
// @access  Private (Admin)
exports.toggleEmployerAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { employerAccess, isApproved, status, approvalStatus } = req.body;

    if (status !== undefined && !['Active', 'Pending', 'Suspended', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid approval status' });
    }

    const employer = await User.findById(id);
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer not found' });
    }

    if (employer.role !== 'Employer') {
      return res.status(400).json({ success: false, message: 'Target user is not an Employer' });
    }

    const previousStatus = employer.status;
    const rawApproval = (approvalStatus || '').toLowerCase();

    if (rawApproval === 'rejected' || status === 'Rejected') {
      // Admin rejected the employer registration — account is kept, access denied
      employer.approvalStatus = 'rejected';
      employer.status = 'Rejected';
      employer.employerAccess = false;
      employer.isApproved = false;
    } else if (rawApproval === 'approved' || status === 'Active' || employerAccess === true) {
      employer.approvalStatus = 'approved';
      employer.status = 'Active';
      employer.employerAccess = true;
      employer.isApproved = true;
    } else if (rawApproval === 'revoked' || status === 'Suspended' || employerAccess === false) {
      employer.approvalStatus = 'revoked';
      employer.status = 'Suspended';
      employer.employerAccess = false;
      employer.isApproved = false;
    } else if (rawApproval === 'pending' || status === 'Pending') {
      employer.approvalStatus = 'pending';
      employer.status = 'Pending';
      employer.employerAccess = false;
      employer.isApproved = false;
    } else {
      if (employerAccess !== undefined) employer.employerAccess = employerAccess;
      if (isApproved !== undefined) employer.isApproved = isApproved;
      if (status !== undefined) employer.status = status;
    }

    await employer.save();

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG][AdminGrantAccess] Employer: ${employer._id}, status: ${employer.status}, employerAccess: ${employer.employerAccess}, isApproved: ${employer.isApproved}`);
    }

    const isGranted = !!(employer.employerAccess && employer.isApproved && employer.status === 'Active');

    // Notify the employer whenever the approval state changes
    if (employer.status !== previousStatus) {
      try {
        const notification = await Notification.create({
          recipient: employer._id,
          message: isGranted
            ? 'Your RafflesJobs employer account has been approved.'
            : employer.status === 'Rejected'
            ? 'Your employer account registration was not approved.'
            : 'Your employer access has been revoked. Please contact RafflesJobs support.',
          type: 'status_change',
        });
        sendNotificationToUser(employer._id, notification);
      } catch (err) {
        console.error('Failed to notify employer of approval change:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: isGranted
        ? 'Employer access updated to APPROVED & GRANTED'
        : employer.status === 'Rejected'
        ? 'Employer registration REJECTED'
        : 'Employer access updated to SUSPENDED/REVOKED',
      employer: {
        _id: employer._id,
        username: employer.username,
        companyName: employer.companyName || employer.username,
        email: employer.email,
        role: employer.role,
        contactNumber: employer.contactNumber,
        mobileNumber: employer.mobileNumber || employer.contactNumber || '',
        isApproved: employer.isApproved,
        employerAccess: employer.employerAccess,
        status: employer.status,
        approvalStatus: employer.approvalStatus || (isGranted
          ? 'approved'
          : employer.status === 'Rejected'
          ? 'rejected'
          : employer.status === 'Pending'
          ? 'pending'
          : 'revoked'),
      },
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get All Job Listings Portal-wide
// @route   GET /api/admin/jobs
// @access  Private (Admin)
exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate('creator', 'username email role contactNumber')
      .sort({ createdAt: -1 });

    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const jobObj = job.toObject();
        const applicantCount = await Application.countDocuments({ job: job._id });
        return {
          ...jobObj,
          applicantCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithStats.length,
      jobs: jobsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Job Status (Active/Closed) by Admin
// @route   PUT /api/admin/jobs/:id/status
// @access  Private (Admin)
exports.updateJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const newStatus = status || (job.status === 'active' ? 'closed' : 'active');
    if (!['active', 'closed'].includes(newStatus)) {
      return res.status(400).json({ success: false, message: 'Status must be "active" or "closed"' });
    }
    job.status = newStatus;
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job status updated to ${job.status}`,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Job Listing by Admin
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
exports.deleteJobByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    await Application.deleteMany({ job: id });
    await User.updateMany({ savedJobs: id }, { $pull: { savedJobs: id } });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job listing deleted successfully by Admin',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Users across system
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update User Role or Status
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) {
      if (!['Job Seeker', 'Employer', 'Admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Role must be "Job Seeker", "Employer", or "Admin"' });
      }
      user.role = role;
      if (role === 'Employer') {
        user.employerAccess = true;
        user.isApproved = true;
        user.status = 'Active';
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${user.role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete User by Admin
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'Employer') {
      const jobs = await Job.find({ creator: id });
      const jobIds = jobs.map((j) => j._id);
      await Application.deleteMany({ job: { $in: jobIds } });
      await Job.deleteMany({ creator: id });
      // Remove deleted jobs from every seeker's savedJobs list
      await User.updateMany({ savedJobs: { $in: jobIds } }, { $pull: { savedJobs: { $in: jobIds } } });
    } else {
      await Application.deleteMany({ applicant: id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};




// @desc    Approve Employer Registration
// @route   PUT /api/admin/employers/:id/approve, PUT /api/admin/approve/:id
// @access  Private (Admin)
exports.approveEmployer = async (req, res, next) => {
  req.body = { ...req.body, approvalStatus: 'approved', status: 'Active', employerAccess: true, isApproved: true };
  return exports.toggleEmployerAccess(req, res, next);
};

// @desc    Reject Employer Registration
// @route   PUT /api/admin/employers/:id/reject, PUT /api/admin/reject/:id
// @access  Private (Admin)
exports.rejectEmployer = async (req, res, next) => {
  req.body = { ...req.body, approvalStatus: 'rejected', status: 'Rejected', employerAccess: false, isApproved: false };
  return exports.toggleEmployerAccess(req, res, next);
};

// @desc    Revoke Employer Access
// @route   PUT /api/admin/employers/:id/revoke, PUT /api/admin/revoke/:id
// @access  Private (Admin)
exports.revokeEmployer = async (req, res, next) => {
  req.body = { ...req.body, approvalStatus: 'revoked', status: 'Suspended', employerAccess: false, isApproved: false };
  return exports.toggleEmployerAccess(req, res, next);
};

// @desc    Get All Job Applications Platform-wide (Admin)
// @route   GET /api/admin/applications
// @access  Private (Admin)
exports.getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'username email avatar bio location skills contactNumber education experience projects certifications resume resumeOriginalName')
      .populate({
        path: 'job',
        populate: { path: 'creator', select: 'username email avatar' },
      })
      .sort({ createdAt: -1 });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG][AdminApplications] Admin ${req.user?._id} fetched ${applications.length} applications`);
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};
