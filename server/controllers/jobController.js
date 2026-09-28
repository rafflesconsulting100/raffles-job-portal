const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const { notifyJobUpdated, notifyJobDeleted } = require('../utils/googleIndexing');

const SITE_ORIGIN = process.env.SITE_URL || 'https://www.rafflesjobs.com';

// Public SEO URL of a job (used for Google Indexing API notifications).
const publicJobUrl = (job) => (job && job.slug ? `${SITE_ORIGIN}/jobs/${job.slug}` : null);

// Validate Job Title (anti-spam, reasonable length 3-100, no repeated characters or gibberish)
const validateJobTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { valid: false, message: 'Job title is required.' };
  }
  const clean = title.trim();
  if (clean.length < 3) {
    return { valid: false, message: 'Job title must be at least 3 characters long.' };
  }
  if (clean.length > 100) {
    return { valid: false, message: 'Job title cannot exceed 100 characters.' };
  }
  if (/(.)\1{4,}/.test(clean)) {
    return { valid: false, message: 'Job title contains invalid repeated characters.' };
  }
  if (!/[a-zA-Z]/.test(clean)) {
    return { valid: false, message: 'Job title must contain valid text characters.' };
  }
  return { valid: true, value: clean };
};

const escapeRegex = (str) => String(str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Validate Number of Openings (whole number >= 1)
const validateNumberOfOpenings = (value) => {
  if (value === undefined || value === null || value === '') {
    return { valid: false, message: 'Number of openings is required.' };
  }
  const num = Number(value);
  if (Number.isNaN(num) || !Number.isInteger(num)) {
    return { valid: false, message: 'Number of openings must be a whole number.' };
  }
  if (num < 1) {
    return { valid: false, message: 'Number of openings must be at least 1.' };
  }
  return { valid: true, value: num };
};

// Validate Preferred Languages (non-empty array of strings; any language allowed)
const validatePreferredLanguages = (value) => {
  if (!Array.isArray(value) || value.length === 0) {
    return { valid: false, message: 'Please select at least one preferred language.' };
  }
  const invalid = value.filter((lang) => typeof lang !== 'string' || lang.trim() === '');
  if (invalid.length > 0) {
    return { valid: false, message: 'Preferred languages must be valid text values.' };
  }
  return { valid: true, value: value.map((lang) => lang.trim()) };
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Employer only)
exports.createJob = async (req, res, next) => {
  try {
    // Validate Title
    const titleCheck = validateJobTitle(req.body.title);
    if (!titleCheck.valid) {
      return res.status(400).json({ success: false, message: titleCheck.message });
    }

    const {
      title,
      company,
      description,
      requirements,
      benefits,
      skills,
      salary,
      locations,
      incentives,
      allowances,
      shift,
      weekOff,
      employmentRole,
      expiresAt,
      validThrough,
      location,
      jobType,
      experienceLevel,
      experienceYears,
      category,
      minEducation,
      aboutCompany,
      companyLogo,
      screeningQuestions,
      numberOfOpenings,
      preferredLanguages,
    } = req.body;

    // Validate Number of Openings
    const openingsCheck = validateNumberOfOpenings(numberOfOpenings);
    if (!openingsCheck.valid) {
      return res.status(400).json({ success: false, message: openingsCheck.message });
    }

    // Validate Preferred Languages
    const languagesCheck = validatePreferredLanguages(preferredLanguages);
    if (!languagesCheck.valid) {
      return res.status(400).json({ success: false, message: languagesCheck.message });
    }

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

    const parsedLocations = Array.isArray(locations) && locations.length > 0
      ? locations.map(l => String(l).trim()).filter(Boolean)
      : (location ? String(location).split(/[|]/).map(l => l.trim()).filter(Boolean) : []);

    const expiryDate = expiresAt || validThrough || null;

    const job = await Job.create({
      locations: parsedLocations,
      incentives: incentives ? String(incentives).trim() : '',
      allowances: allowances ? String(allowances).trim() : '',
      shift: shift ? String(shift).trim() : '',
      weekOff: weekOff ? String(weekOff).trim() : '',
      employmentRole: employmentRole ? String(employmentRole).trim() : 'On-Roll',
      expiresAt: expiryDate ? new Date(expiryDate) : null,
      validThrough: expiryDate ? new Date(expiryDate) : null,
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
      numberOfOpenings: openingsCheck.value,
      preferredLanguages: languagesCheck.value,
      creator: req.user.id,
    });

    const jobUrl = publicJobUrl(job);
    if (jobUrl) notifyJobUpdated(jobUrl);

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
    const { keyword, location, jobType, experienceLevel, category } = req.query;

    const query = { status: 'active' };

    // Category filter (exact value stored on the job document, e.g. "Sales")
    if (category) {
      query.category = category;
    }

    // Keyword search (title, company, description, category, skills) with escaped regex
    if (keyword && String(keyword).trim()) {
      const safeKeyword = escapeRegex(String(keyword).trim());
      query.$or = [
        { title: { $regex: safeKeyword, $options: 'i' } },
        { company: { $regex: safeKeyword, $options: 'i' } },
        { description: { $regex: safeKeyword, $options: 'i' } },
        { category: { $regex: safeKeyword, $options: 'i' } },
        { skills: { $regex: safeKeyword, $options: 'i' } },
      ];
    }

    // Location search (matches location or locations array) with escaped regex
    if (location && String(location).trim()) {
      const safeLocation = escapeRegex(String(location).trim());
      const locCondition = {
        $or: [
          { location: { $regex: safeLocation, $options: 'i' } },
          { locations: { $regex: safeLocation, $options: 'i' } },
        ],
      };
      if (query.$and) {
        query.$and.push(locCondition);
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, locCondition];
        delete query.$or;
      } else {
        query.$or = locCondition.$or;
      }
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


    // If user is authenticated Job Seeker, exclude jobs they have already applied to
    if (req.user && req.user.role === 'Job Seeker') {
      const userApplications = await Application.find({ applicant: req.user._id || req.user.id }).select('job');
      const appliedJobIds = userApplications.map(app => app.job).filter(Boolean);
      if (appliedJobIds.length > 0) {
        query._id = { $nin: appliedJobIds };
      }
    }

    const jobs = await Job.find(query)
      .populate('creator', 'username avatar')
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
    const rawJobs = await Job.find({ creator: req.user.id }).sort({ createdAt: -1 }).lean();
    const jobIds = rawJobs.map((j) => j._id);

    // Aggregate real applicant counts per job
    const appCounts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$job', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    appCounts.forEach((ac) => {
      countMap[ac._id.toString()] = ac.count;
    });

    const jobs = rawJobs.map((job) => ({
      ...job,
      applicantCount: countMap[job._id.toString()] || 0,
    }));

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
    const job = await Job.findById(req.params.id).populate('creator', 'username avatar company bio');
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

// @desc    Get a single job by its public SEO slug (closed jobs included so the
//          page can render a "no longer accepting applications" notice)
// @route   GET /api/jobs/slug/:slug
// @access  Public
exports.getJobBySlug = async (req, res, next) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug }).populate(
      'creator',
      'username avatar company bio'
    );
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
      numberOfOpenings,
      preferredLanguages,
    } = req.body;

    if (title !== undefined) {
      const titleCheck = validateJobTitle(title);
      if (!titleCheck.valid) {
        return res.status(400).json({ success: false, message: titleCheck.message });
      }
      job.title = titleCheck.value;
    }
    if (req.body.locations !== undefined && Array.isArray(req.body.locations)) {
      job.locations = req.body.locations.map(l => String(l).trim()).filter(Boolean);
    }
    if (req.body.incentives !== undefined) job.incentives = String(req.body.incentives).trim();
    if (req.body.allowances !== undefined) job.allowances = String(req.body.allowances).trim();
    if (req.body.shift !== undefined) job.shift = String(req.body.shift).trim();
    if (req.body.weekOff !== undefined) job.weekOff = String(req.body.weekOff).trim();
    if (req.body.employmentRole !== undefined) job.employmentRole = String(req.body.employmentRole).trim();
    if (req.body.expiresAt !== undefined) job.expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : null;
    if (req.body.validThrough !== undefined) job.validThrough = req.body.validThrough ? new Date(req.body.validThrough) : null;
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

    if (numberOfOpenings !== undefined) {
      const openingsCheck = validateNumberOfOpenings(numberOfOpenings);
      if (!openingsCheck.valid) {
        return res.status(400).json({ success: false, message: openingsCheck.message });
      }
      job.numberOfOpenings = openingsCheck.value;
    }

    if (preferredLanguages !== undefined) {
      const languagesCheck = validatePreferredLanguages(preferredLanguages);
      if (!languagesCheck.valid) {
        return res.status(400).json({ success: false, message: languagesCheck.message });
      }
      job.preferredLanguages = languagesCheck.value;
    }

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

    const updatedUrl = publicJobUrl(job);
    if (updatedUrl) notifyJobUpdated(updatedUrl);

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

    const deletedUrl = publicJobUrl(job);
    await job.deleteOne();

    if (deletedUrl) notifyJobDeleted(deletedUrl);

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
      populate: { path: 'creator', select: 'username avatar' },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, please login first' });
    }

    // Deleted jobs resolve to null placeholders — drop them so clients never
    // receive array entries they would crash on.
    const savedJobs = (user.savedJobs || []).filter(Boolean);

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      savedJobs,
    });
  } catch (error) {
    next(error);
  }
};
