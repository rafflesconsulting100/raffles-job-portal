const mongoose = require('mongoose');

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
      default: 'Software Engineering',
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
