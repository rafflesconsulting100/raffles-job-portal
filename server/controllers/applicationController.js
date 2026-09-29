const { sendNotificationToUser } = require('../utils/socket');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { uploadResume } = require('../config/cloudinary');
const sendEmail = require('../config/email');
const { isExpired } = require('../utils/jobExpiry');

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Job Seeker only)
exports.applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status === 'closed') {
      return res.status(400).json({ success: false, message: 'This job posting has been closed' });
    }

    // Enforce the deadline the employer set on the listing.
    if (isExpired(job)) {
      return res.status(400).json({ success: false, message: 'This job posting has expired' });
    }

    // Check if already applied
    const hasApplied = await Application.findOne({ job: jobId, applicant: req.user.id });
    if (hasApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }

    // Set resume (use uploaded resume or fall back to profile resume)
    let resumeUrl = '';
    let resumeName = '';

    if (req.files && req.files.resume) {
      resumeUrl = await uploadResume(req.files.resume[0]);
      resumeName = req.files.resume[0].originalname;
    } else if (req.user.resume) {
      resumeUrl = req.user.resume;
      resumeName = req.user.resumeOriginalName || 'profile_resume';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file or add a resume to your profile before applying.',
      });
    }

    // Parse screening answers
    let screeningAnswers = [];
    if (req.body.screeningAnswers) {
      try {
        screeningAnswers = typeof req.body.screeningAnswers === 'string'
          ? JSON.parse(req.body.screeningAnswers)
          : req.body.screeningAnswers;
      } catch (err) {
        console.error('Failed parsing screening answers, saving raw string structure:', err);
      }
    }

    const coverLetter = typeof req.body.coverLetter === 'string' ? req.body.coverLetter.trim() : '';

    // Create application
    let application;
    try {
      application = await Application.create({
        job: jobId,
        applicant: req.user.id,
        resume: resumeUrl,
        resumeOriginalName: resumeName,
        screeningAnswers,
        coverLetter,
      });
    } catch (err) {
      // Duplicate key = concurrent double-submit; the unique index is the
      // source of truth, so surface it as a friendly 400 instead of a 500.
      if (err && err.code === 11000) {
        return res.status(400).json({ success: false, message: 'You have already applied to this job' });
      }
      throw err;
    }

    // Everything below is best-effort: the application is already persisted, so
    // a notification/socket failure must not turn a successful apply into a 500
    // (the user would retry and hit "You have already applied to this job").
    try {
      const newNotif = await Notification.create({
        recipient: job.creator,
        sender: req.user.id,
        message: `${req.user.username} applied for "${job.title}" at ${job.company}`,
        type: 'new_application',
        relatedJob: job._id,
      });

      const populatedNotif = await Notification.findById(newNotif._id).populate('sender', 'username avatar');
      sendNotificationToUser(job.creator, populatedNotif || newNotif);
    } catch (err) {
      console.error('Failed to notify employer about new application:', err.message);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};


exports.getCandidateApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        populate: { path: 'creator', select: 'username avatar' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};
exports.getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Confirm ownership
    if (job.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to applicant profiles' });
    }

    const applicants = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'username email avatar bio location skills contactNumber education experience projects certifications resume resumeOriginalName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applicants.length,
      applicants,
    });
  } catch (error) {
    next(error);
  }
};


exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide valid status (accepted or rejected)' });
    }

    const application = await Application.findById(req.params.id)
      .populate('applicant', 'username email')
      .populate('job', 'title company creator');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // The job may have been deleted (legacy records) — populate then yields
    // null, and dereferencing it crashed with a 500 instead of a clean 404.
    if (!application.job) {
      return res.status(404).json({ success: false, message: 'The job for this application no longer exists' });
    }

    // Confirm job belongs to this employer
    if (application.job.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You cannot update this application status' });
    }

    application.status = status;
    await application.save();

    // The status change is already committed — notifications and email are
    // best-effort so an SMTP/socket outage cannot report a failure for a save
    // that actually succeeded.
    try {
      // Send in-app notification to the candidate
      const actionMsg = status === 'accepted' ? 'ACCEPTED' : 'REJECTED';
      const newNotif = await Notification.create({
        recipient: application.applicant._id,
        sender: req.user.id,
        message: `Your application status for "${application.job.title}" at ${application.job.company} was updated to: ${actionMsg}`,
        type: 'status_change',
        relatedJob: application.job._id,
      });

      try {
        const populatedNotif = await Notification.findById(newNotif._id).populate('sender', 'username avatar');
        sendNotificationToUser(application.applicant._id, populatedNotif || newNotif);
      } catch (err) {
        console.error('Failed to emit real-time notification to candidate:', err.message);
      }

      // Send email notification to applicant via Raffles Jobs Brevo SMTP
      const { getRafflesEmailTemplate, escapeHtml } = require('../utils/emailTemplate');
      const isAccepted = status === 'accepted';
      const safeTitle = escapeHtml(application.job.title);
      const safeCompany = escapeHtml(application.job.company);
      const emailHtml = getRafflesEmailTemplate({
        title: `Application Update: ${application.job.title}`,
        subtitle: `Raffles Jobs Recruitment Update`,
        greeting: `Dear ${application.applicant.username},`,
        bodyText: `Your application status for the position of <strong>${safeTitle}</strong> at <strong>${safeCompany}</strong> has been updated to <span style="font-weight:700; text-transform:uppercase; color:${isAccepted ? '#059669' : '#DC2626'}">${status}</span>.`,
        details: [
          { label: 'Job Title', value: application.job.title },
          { label: 'Company', value: application.job.company },
          { label: 'Application Status', value: status.toUpperCase() },
          { label: 'Update Date', value: new Date().toLocaleDateString() },
        ],
        footerNote: isAccepted
          ? 'Congratulations! The recruiter or hiring team will contact you with further next steps.'
          : 'Thank you for your interest in this opportunity. We encourage you to explore other open positions on our portal.',
      });

      const textSummary = `Your application status for the position of ${application.job.title} at ${application.job.company} has been updated to ${status}.`;

      await sendEmail({
        to: application.applicant.email,
        subject: `[RAFFLES JOBS] Application Update for ${application.job.title.replace(/[\r\n]+/g, ' ')}`,
        text: textSummary,
        html: emailHtml,
      });
    } catch (err) {
      console.error('Failed to notify candidate about status change:', err.message);
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw job application
// @route   DELETE /api/applications/:id
// @access  Private (Job Seeker only)
exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify ownership
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to withdraw this application' });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics stats
// @route   GET /api/applications/stats
// @access  Private (Employer only)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get all jobs posted by the employer
    const jobs = await Job.find({ creator: req.user.id });
    const jobIds = jobs.map(job => job._id);

    // Calculate metrics
    const totalJobs = jobs.length;
    // Match the listing rule: past its deadline a posting is no longer active
    // even while its status field still reads 'active'.
    const activeJobs = jobs.filter((j) => j.status === 'active' && !isExpired(j)).length;

    const applications = await Application.find({ job: { $in: jobIds } });

    const totalApplicants = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const accepted = applications.filter(app => app.status === 'accepted').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        totalApplicants,
        pending,
        accepted,
        rejected,
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
    // 1. Find jobs posted by this employer
    const employerJobs = await Job.find({ creator: req.user.id }).select('_id');
    const employerJobIds = employerJobs.map(job => job._id);

    // 2. Find all applications made to this employer's jobs
    const applicationsToEmployer = await Application.find({
      job: { $in: employerJobIds }
    }).select('applicant status').lean();

    // 3. Only return job seekers who have applied to this employer's jobs
    const applicantIds = new Set(applicationsToEmployer.map(app => app.applicant.toString()));

    // 4. Get only the applicants who applied — never expose the full seeker DB
    const students = await User.find({ _id: { $in: [...applicantIds].map(id => new mongoose.Types.ObjectId(id)) } })
      .select(
        'username email avatar bio location contactNumber skills education experience projects certifications resume resumeOriginalName'
      )
      .lean();

    // 5. Attach application status for each student
    const statusByApplicant = new Map(
      applicationsToEmployer.map(app => [app.applicant.toString(), app.status])
    );

    const enriched = students.map(student => ({
      ...student,
      applicationStatus: statusByApplicant.get(student._id.toString()) || 'pending'
    }));

    // Calculate quick stats
    let totalApplied = enriched.length;
    const locationCounts = {};

    enriched.forEach(student => {
      const loc = student.location || 'Not Specified';
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      stats: {
        total: enriched.length,
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



// @desc    Get candidate resume for an application (with strict Employer ownership check)
// @route   GET /api/applications/:id/resume
// @access  Private (Employer only)
exports.getApplicationResume = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'creator title company')
      .populate('applicant', 'username email resume resumeOriginalName');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Strict Employer authorization check:
    const isOwner = application.job && application.job.creator.toString() === req.user.id;
    const isAdmin = req.user.role === 'Admin';
    if (!application.job && !isAdmin) {
      // Orphaned record: the owner would have been rejected with a 403 for a
      // job they legitimately owned before it was deleted.
      return res.status(404).json({
        success: false,
        message: 'The job for this application no longer exists',
      });
    }
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to view this candidate resume',
      });
    }

    const resumeUrl = application.resume || application.applicant?.resume;
    const fileName = application.resumeOriginalName || application.applicant?.resumeOriginalName || 'candidate_resume.pdf';

    if (!resumeUrl) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found for this candidate',
      });
    }

    if (req.query.download === 'true') {
      return res.redirect(resumeUrl);
    }

    res.status(200).json({
      success: true,
      applicationId: application._id,
      jobId: application.job?._id,
      candidate: {
        id: application.applicant?._id,
        name: application.applicant?.username,
        email: application.applicant?.email,
      },
      resume: {
        available: true,
        fileName: fileName,
        url: resumeUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get all applications submitted to jobs posted by this employer
// @route   GET /api/applications/employer-applications
// @access  Private (Employer only)
exports.getEmployerApplications = async (req, res, next) => {
  try {
    const jobs = await Job.find({ creator: req.user.id }).select('_id title company location salary jobType status');
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title company location salary jobType status')
      .populate('applicant', 'username email avatar bio location skills contactNumber education experience projects certifications resume resumeOriginalName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};
