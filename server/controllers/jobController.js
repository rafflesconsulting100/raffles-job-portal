const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Employer only)
exports.createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      benefits,
      skills,
      salary,
      location,
      jobType,
      experienceLevel,
      experienceYears,
      category,
      minEducation,
      aboutCompany,
      companyLogo,
      screeningQuestions,
    } = req.body;

    // Build requirements, benefits, and skills arrays
    const parsedRequirements = Array.isArray(requirements)
      ? requirements
      : requirements
      ? requirements.split('\n').map(r => r.trim()).filter(Boolean)
      : [];

    const parsedBenefits = Array.isArray(benefits)
      ? benefits
      : benefits
      ? benefits.split('\n').map(b => b.trim()).filter(Boolean)
      : [];

    const parsedSkills = Array.isArray(skills)
      ? skills.map(s => s.trim()).filter(Boolean)
      : typeof skills === 'string'
      ? skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const parsedScreening = Array.isArray(screeningQuestions)
      ? screeningQuestions
      : screeningQuestions
      ? screeningQuestions.split('\n').map(q => q.trim()).filter(Boolean)
      : [];

    const job = await Job.create({
      title,
      company,
      description,
      requirements: parsedRequirements,
      benefits: parsedBenefits,
      skills: parsedSkills,
      salary,
      location,
      jobType,
      experienceLevel,
      experienceYears: experienceYears || '1 - 3 Years',
      category,
      minEducation,
      aboutCompany,
      companyLogo,
      screeningQuestions: parsedScreening,
      creator: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (with query filters)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const { keyword, location, jobType, experienceLevel } = req.query;

    const query = { status: 'active' };

    // Keyword search (title, company, description)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Location search
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job Type search
    if (jobType) {
      const types = jobType.split(',');
      query.jobType = { $in: types };
    }

    // Experience Level search
    if (experienceLevel) {
      const levels = experienceLevel.split(',');
      query.experienceLevel = { $in: levels };
    }

    const jobs = await Job.find(query)
      .populate('creator', 'username email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs posted by logged-in employer
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer only)
exports.getEmployerJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ creator: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single job details
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('creator', 'username email avatar company bio');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job details
// @route   PUT /api/jobs/:id
// @access  Private (Employer only - owner)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this job' });
    }

    const {
      title,
      company,
      description,
      requirements,
      benefits,
      skills,
      salary,
      location,
      jobType,
      experienceLevel,
      experienceYears,
      category,
      minEducation,
      aboutCompany,
      companyLogo,
      screeningQuestions,
      status,
    } = req.body;

    if (title) job.title = title;
    if (company) job.company = company;
    if (description) job.description = description;
    if (salary !== undefined) job.salary = salary;
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (experienceLevel) job.experienceLevel = experienceLevel;
    if (experienceYears) job.experienceYears = experienceYears;
    if (category) job.category = category;
    if (minEducation) job.minEducation = minEducation;
    if (aboutCompany !== undefined) job.aboutCompany = aboutCompany;
    if (companyLogo !== undefined) job.companyLogo = companyLogo;
    if (status) job.status = status;

    if (skills !== undefined) {
      job.skills = Array.isArray(skills)
        ? skills.map(s => s.trim()).filter(Boolean)
        : typeof skills === 'string'
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];
    }

    if (requirements) {
      job.requirements = Array.isArray(requirements)
        ? requirements
        : requirements.split('\n').map(r => r.trim()).filter(Boolean);
    }
    if (benefits) {
      job.benefits = Array.isArray(benefits)
        ? benefits
        : benefits.split('\n').map(b => b.trim()).filter(Boolean);
    }
    if (screeningQuestions) {
      job.screeningQuestions = Array.isArray(screeningQuestions)
        ? screeningQuestions
        : screeningQuestions.split('\n').map(q => q.trim()).filter(Boolean);
    }

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only - owner)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle save/unsave a job
// @route   POST /api/jobs/:id/save
// @access  Private (Job Seeker only)
exports.saveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const user = await User.findById(req.user.id);
    const index = user.savedJobs.indexOf(job.id);

    let isSaved = false;
    if (index === -1) {
      user.savedJobs.push(job.id);
      isSaved = true;
    } else {
      user.savedJobs.splice(index, 1);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isSaved ? 'Job saved to your list' : 'Job removed from your list',
      isSaved,
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved jobs for seeker
// @route   GET /api/jobs/saved
// @access  Private (Job Seeker only)
exports.getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedJobs',
      populate: { path: 'creator', select: 'username email avatar' },
    });

    res.status(200).json({
      success: true,
      count: user.savedJobs.length,
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};
