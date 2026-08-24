const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { uploadToCloudinaryOrLocal, uploadResume } = require('../config/cloudinary');
const sendEmail = require('../config/email');

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

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      resume: resumeUrl,
      resumeOriginalName: resumeName,
      screeningAnswers,
    });

    // Create notification for the job poster (Employer)
    await Notification.create({
      recipient: job.creator,
      sender: req.user.id,
      message: `${req.user.username} applied for "${job.title}" at ${job.company}`,
      type: 'new_application',
      relatedJob: job._id,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's job applications
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker only)
exports.getCandidateApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        populate: { path: 'creator', select: 'username email avatar' },
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

// @desc    Get all applicants for a specific job post
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
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
      .populate('applicant', 'username email avatar bio location skills contactNumber')
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

// @desc    Update application status (Accept / Reject)
// @route   PATCH /api/applications/:id/status
// @access  Private (Employer only)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide valid status (accepted or rejected)' });
    }

    const application = await Application.findById(req.params.id)
      .populate('applicant', 'username email')
      .populate('job', 'title company creator');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Confirm job belongs to this employer
    if (application.job.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You cannot update this application status' });
    }

    application.status = status;
    await application.save();

    // Send in-app notification to the candidate
    const actionMsg = status === 'accepted' ? 'ACCEPTED' : 'REJECTED';
    await Notification.create({
      recipient: application.applicant._id,
      sender: req.user.id,
      message: `Your application status for "${application.job.title}" at ${application.job.company} was updated to: ${actionMsg}`,
      type: 'status_change',
      relatedJob: application.job._id,
    });

    // Send email notification to applicant via Raffles Consultancy Brevo SMTP
    const { getRafflesEmailTemplate } = require('../utils/emailTemplate');
    const isAccepted = status === 'accepted';
    const emailHtml = getRafflesEmailTemplate({
      title: `Application Update: ${application.job.title}`,
      subtitle: `Raffles Consultancy Recruitment Update`,
      greeting: `Dear ${application.applicant.username},`,
      bodyText: `Your application status for the position of <strong>${application.job.title}</strong> at <strong>${application.job.company}</strong> has been updated to <span style="font-weight:700; text-transform:uppercase; color:${isAccepted ? '#059669' : '#DC2626'}">${status}</span>.`,
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

    await sendEmail({
      to: application.applicant.email,
      subject: `[Raffles Consultancy] Application Update for ${application.job.title}`,
      text: textMsg,
      html: emailHtml,
    });

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
    
    const applications = await Application.find({ job: { $in: jobIds } });
    
    const totalApplicants = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const accepted = applications.filter(app => app.status === 'accepted').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
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
