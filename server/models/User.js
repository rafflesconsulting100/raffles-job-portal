const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['Job Seeker', 'Employer', 'Admin'],
      default: 'Job Seeker',
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    mobileNumber: {
      type: String,
      trim: true,
      default: '',
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'revoked'],
      default: function () {
        return this.role === 'Employer' ? 'pending' : 'approved';
      },
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    employerAccess: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Suspended', 'Rejected'],
      default: 'Active',
    },
    avatar: {
      type: String,
      default: '',
    },
    // NOTE: no `default: null` here on purpose. A sparse unique index still
    // indexes an explicit null, so writing null on every insert would make the
    // second user registration fail with E11000. The field stays absent unless
    // a Google sign-in actually provides a UID.
    firebaseUid: {
      type: String,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    acceptedTerms: {
      type: Boolean,
      default: false,
    },
    termsAcceptedAt: {
      type: Date,
      default: null,
    },
    termsVersion: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      default: '',
    },
    contactNumber: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say', ''],
      default: '',
    },
    dob: {
      type: String,
      default: '',
    },
    education: [
      {
        level: { type: String, default: '' }, // e.g. 10th, 12th, UG, PG, Diploma
        institution: { type: String, default: '' },
        degree: { type: String, default: '' },
        fieldOfStudy: { type: String, default: '' },
        passingYear: { type: String, default: '' },
        grade: { type: String, default: '' },
      },
    ],
    experience: [
      {
        title: { type: String, default: '' },
        company: { type: String, default: '' },
        location: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        isCurrent: { type: Boolean, default: false },
        description: { type: String, default: '' },
      },
    ],
    projects: [
      {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        technologies: { type: String, default: '' },
        link: { type: String, default: '' },
      },
    ],
    certifications: [
      {
        title: { type: String, default: '' },
        issuer: { type: String, default: '' },
        issueDate: { type: String, default: '' },
        credentialUrl: { type: String, default: '' },
      },
    ],
    resume: {
      type: String,
      default: '',
    },
    resumeOriginalName: {
      type: String,
      default: '',
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firebaseUid: 1 }, { unique: true, sparse: true });

// Hash password before saving & synchronize employer fields
userSchema.pre('save', async function (next) {
  if (this.role === 'Employer') {
    if (this.companyName && !this.username) {
      this.username = this.companyName;
    } else if (this.username && !this.companyName) {
      this.companyName = this.username;
    }

    if (this.mobileNumber && !this.contactNumber) {
      this.contactNumber = this.mobileNumber;
    } else if (this.contactNumber && !this.mobileNumber) {
      this.mobileNumber = this.contactNumber;
    }

    // Keep approvalStatus in sync with status / isApproved / employerAccess
    if (this.isModified('approvalStatus')) {
      const appr = (this.approvalStatus || '').toLowerCase();
      if (appr === 'pending') {
        this.status = 'Pending';
        this.isApproved = false;
        this.employerAccess = false;
      } else if (appr === 'approved') {
        this.status = 'Active';
        this.isApproved = true;
        this.employerAccess = true;
      } else if (appr === 'rejected') {
        this.status = 'Rejected';
        this.isApproved = false;
        this.employerAccess = false;
      } else if (appr === 'revoked') {
        this.status = 'Suspended';
        this.isApproved = false;
        this.employerAccess = false;
      }
    } else if (
      this.isModified('status') ||
      this.isModified('isApproved') ||
      this.isModified('employerAccess')
    ) {
      if (this.status === 'Rejected') {
        this.approvalStatus = 'rejected';
      } else if (this.status === 'Suspended' || this.employerAccess === false) {
        this.approvalStatus = 'revoked';
      } else if (
        this.status === 'Pending' ||
        (this.isApproved === false && this.status !== 'Suspended' && this.status !== 'Rejected')
      ) {
        this.approvalStatus = 'pending';
      } else if (this.status === 'Active' && this.isApproved !== false && this.employerAccess !== false) {
        this.approvalStatus = 'approved';
      }
    }
  }

  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
