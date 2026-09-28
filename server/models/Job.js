const mongoose = require('mongoose');
const { buildJobSlug, isReservedSlug } = require('../utils/slug');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    salary: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'],
      default: 'Full-time',
    },
    experienceLevel: {
      type: String,
      default: 'Mid Level (2-5 Yrs)',
    },
    experienceYears: {
      type: String,
      default: '1 - 3 Years',
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      // Default matches the first option in the job posting form. Categories
      // drive the /jobs/<category> SEO landing pages, so keep this in sync
      // with client/src/Utils/seoConfig.js JOB_CATEGORIES.
      default: 'BPO',
      trim: true,
    },
    minEducation: {
      type: String,
      default: 'Any Graduate',
      trim: true,
    },
    aboutCompany: {
      type: String,
      default: '',
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
      trim: true,
    },
    screeningQuestions: [
      {
        type: String,
        trim: true,
      },
    ],
    numberOfOpenings: {
      type: Number,
      min: [1, 'Number of openings must be at least 1'],
      validate: [Number.isInteger, 'Number of openings must be a whole number'],
    },
    preferredLanguages: {
      type: [String],
    },
    locations: [
      {
        type: String,
        trim: true,
      },
    ],
    incentives: {
      type: String,
      trim: true,
      default: '',
    },
    allowances: {
      type: String,
      trim: true,
      default: '',
    },
    shift: {
      type: String,
      trim: true,
      default: '',
    },
    weekOff: {
      type: String,
      trim: true,
      default: '',
    },
    employmentRole: {
      type: String,
      trim: true,
      default: 'On-Roll',
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    validThrough: {
      type: Date,
      default: null,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    // Public SEO URL segment: /jobs/<slug>. Generated once and then kept stable
    // so shared/indexed job links never break when a title is edited.
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Assign a unique slug the first time a job is persisted.
jobSchema.pre('save', async function assignSlugIfMissing(next) {
  try {
    if (this.slug && !isReservedSlug(this.slug)) return next();

    const base = buildJobSlug(this);
    const suffix = this._id ? this._id.toString().slice(-6) : '';
    let candidate = base;

    // Never let a job slug shadow a reserved /jobs/:slug route segment.
    if (isReservedSlug(candidate)) {
      candidate = suffix ? `${base}-${suffix}` : `${base}-job`;
    }

    const exists = await this.constructor
      .findOne({ slug: candidate, _id: { $ne: this._id } })
      .select('_id')
      .lean();

    if (exists) {
      candidate = suffix ? `${candidate}-${suffix}` : `${candidate}-${this._id}`;
    }

    this.slug = candidate;
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Job', jobSchema);
