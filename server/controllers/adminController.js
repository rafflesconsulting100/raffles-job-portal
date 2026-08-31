const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Helper to generate Admin token response
const generateAdminToken = (adminUser) => {
  return jwt.sign(
    { id: adminUser._id },
    process.env.JWT_SECRET || 'supersecretkey1234567890abcdefjobportal',
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

    const envPasskey = process.env.ADMIN_PASSKEY || 'RafflesAdmin@2026';
    const envEmail = process.env.ADMIN_EMAIL || 'admin@rafflesconsulting.in';

    if (!providedPasskey) {
      return res.status(400).json({ success: false, message: 'Please provide administrator passkey/password' });
    }

    const targetEmail = (email && email.trim().length > 0) ? email.trim().toLowerCase() : envEmail.toLowerCase();

    // Check if provided passkey matches the ENV passkey
    const isMasterPasskeyMatch = providedPasskey === envPasskey;

    // Check if user already exists in DB
    let adminUser = await User.findOne({ email: targetEmail }).select('+password');

    if (adminUser) {
      let isPasswordMatch = false;
      if (adminUser.password) {
        try {
          isPasswordMatch = await adminUser.comparePassword(providedPasskey);
        } catch (e) {
          isPasswordMatch = false;
        }
      }

      if (!isMasterPasskeyMatch && !isPasswordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials or passkey' });
      }

      // Upgrade/Ensure role is Admin
      if (adminUser.role !== 'Admin' || adminUser.status !== 'Active') {
        adminUser.role = 'Admin';
        adminUser.status = 'Active';
        adminUser.isApproved = true;
        adminUser.employerAccess = true;
        await adminUser.save();
      }
    } else {
      // If passkey matches master passkey, auto-create Admin user
      if (!isMasterPasskeyMatch) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials or passkey' });
      }

      adminUser = await User.create({
        username: 'Raffles Super Admin',
        email: targetEmail,
        password: providedPasskey,
        role: 'Admin',
        status: 'Active',
        isApproved: true,
        employerAccess: true,
      });
    }

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
  } catch (error) {
    next(error);
  }
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
      $or: [{ status: 'Pending' }, { isApproved: false, status: { $ne: 'Suspended' } }]
    });

    const grantedEmployers = await User.countDocuments({
      role: 'Employer',
      status: 'Active',
      isApproved: { $ne: false },
      employerAccess: { $ne: false }
    });

    const suspendedEmployers = await User.countDocuments({
      role: 'Employer',
      $or: [{ status: 'Suspended' }, { employerAccess: false }]
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

        const isGranted = emp.employerAccess !== false && emp.isApproved !== false && emp.status === 'Active';
        const isPending = emp.status === 'Pending' || (emp.isApproved === false && emp.status !== 'Suspended');

        return {
          ...empObj,
          jobCount,
          activeJobCount,
          applicantCount,
          isApproved: emp.isApproved !== undefined ? emp.isApproved : isGranted,
          employerAccess: isGranted,
          approvalStatus: isPending ? 'Pending' : isGranted ? 'Approved' : 'Suspended',
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

// @desc    Grant, Approve or Revoke Employer Portal Access
// @route   PUT /api/admin/employers/:id/access
// @access  Private (Admin)
exports.toggleEmployerAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { employerAccess, isApproved, status } = req.body;

    const employer = await User.findById(id);
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer not found' });
    }

    if (employer.role !== 'Employer') {
      return res.status(400).json({ success: false, message: 'Target user is not an Employer' });
    }

    if (employerAccess !== undefined) employer.employerAccess = employerAccess;
    if (isApproved !== undefined) employer.isApproved = isApproved;
    if (status !== undefined) employer.status = status;

    // Handle access granting/approving vs revoking
    if (employerAccess === false || isApproved === false || status === 'Suspended') {
      employer.status = 'Suspended';
      employer.employerAccess = false;
      employer.isApproved = false;
    } else if (employerAccess === true || isApproved === true || status === 'Active') {
      employer.status = 'Active';
      employer.employerAccess = true;
      employer.isApproved = true;
    }

    await employer.save();

    res.status(200).json({
      success: true,
      message: `Employer access updated to ${employer.isApproved && employer.employerAccess ? 'APPROVED & GRANTED' : 'SUSPENDED/REVOKED'}`,
      employer: {
        _id: employer._id,
        username: employer.username,
        email: employer.email,
        role: employer.role,
        isApproved: employer.isApproved,
        employerAccess: employer.employerAccess,
        status: employer.status,
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

    job.status = status || (job.status === 'active' ? 'closed' : 'active');
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

// @desc    Promote Current User to Admin (For quick access / testing)
// @route   POST /api/admin/seed
// @access  Private (Authenticated user)
exports.seedAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = 'Admin';
    user.status = 'Active';
    user.isApproved = true;
    user.employerAccess = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Your account has been granted Admin role successfully!',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student database for employers
// @route   GET /api/applications/student-database
// @access  Private (Employer only)
exports.getStudentDatabase = async (req, res, next) => {
  try {
    // 1. Get all Job Seekers
    const jobSeekers = await User.find({ role: 'Job Seeker' })
      .select('-password -__v')
      .lean();

    // 2. Find jobs posted by this employer
    const employerJobs = await Job.find({ creator: req.user.id }).select('_id');
    const employerJobIds = employerJobs.map(job => job._id);

    // 3. Find all applications made to this employer's jobs
    const applicationsToEmployer = await Application.find({
      job: { $in: employerJobIds }
    }).select('applicant status').lean();

    // Create a Set of applicant IDs that have applied to this employer
    const applicantIds = new Set(applicationsToEmployer.map(app => app.applicant.toString()));

    // 4. Map students and add hasAppliedToMe flag
    const students = jobSeekers.map(student => ({
      ...student,
      hasAppliedToMe: applicantIds.has(student._id.toString())
    }));

    // Calculate quick stats
    let totalApplied = 0;
    const locationCounts = {};

    students.forEach(student => {
      if (student.hasAppliedToMe) totalApplied++;
      
      const loc = student.location || 'Not Specified';
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      count: students.length,
      stats: {
        total: students.length,
        appliedToYou: totalApplied,
        notApplied: students.length - totalApplied,
        locationCounts
      },
      students
    });
  } catch (error) {
    next(error);
  }
};

