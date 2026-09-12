const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../config/email');
const { uploadToCloudinaryOrLocal, uploadAvatar, uploadResume } = require('../config/cloudinary');

// Create token helper
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'supersecretkey1234567890abcdefjobportal',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Lax is helpful for local cross-port dev
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved !== undefined ? user.isApproved : true,
      employerAccess: user.employerAccess !== undefined ? user.employerAccess : true,
      status: user.status || 'Active',
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      location: user.location,
      contactNumber: user.contactNumber,
      gender: user.gender,
      dob: user.dob,
      education: user.education,
      experience: user.experience,
      projects: user.projects,
      certifications: user.certifications,
      resume: user.resume,
      resumeOriginalName: user.resumeOriginalName,
      savedJobs: user.savedJobs,
    },
  });
};

// @desc    Register new Job Seeker via Google
// @route   POST /api/auth/job-seeker/google/register
// @access  Public
exports.googleRegister = async (req, res, next) => {
  try {
    const { firebaseUid, email, displayName, photoURL, emailVerified, acceptedTerms } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ success: false, message: 'Missing required Google authentication data' });
    }

    if (!acceptedTerms) {
      return res.status(400).json({ success: false, message: 'You must agree to the Terms & Conditions and Privacy Policy.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const name = (displayName || email.split('@')[0] || 'Job Seeker').trim();

    // Check if email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (existingUser.role === 'Job Seeker') {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please log in.',
        });
      }
      if (existingUser.role === 'Employer') {
        return res.status(403).json({
          success: false,
          message: 'An Employer account already exists with this email. Please use the Employer login.',
        });
      }
      if (existingUser.role === 'Admin') {
        return res.status(403).json({
          success: false,
          message: 'An Admin account already exists with this email.',
        });
      }
    }

    // Create new Job Seeker
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      username: name,
      email: normalizedEmail,
      password: randomPassword,
      firebaseUid,
      authProvider: 'google',
      avatar: photoURL || '',
      isEmailVerified: !!emailVerified,
      role: 'Job Seeker',
      isApproved: true,
      employerAccess: true,
      status: 'Active',
      acceptedTerms: true,
      termsAcceptedAt: new Date(),
      termsVersion: '1.0',
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'An account with this Google email already exists.' });
    }
    console.error('Google register error:', error.message);
    next(error);
  }
};

// @desc    Login existing Job Seeker via Google
// @route   POST /api/auth/job-seeker/google
// @access  Public
// SECURITY NOTE: This endpoint receives Firebase user info from the frontend.
// Without Firebase Admin SDK, the backend cannot cryptographically verify
// the Firebase ID token. The frontend sends user data after Firebase Client SDK
// authentication. This is a known limitation.
// Google Sign-In is LOGIN ONLY — it never creates new accounts.
exports.googleLogin = async (req, res, next) => {
  try {
    const { firebaseUid, email, displayName, photoURL, emailVerified } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ success: false, message: 'Missing required Google authentication data' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find existing user by email
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No RafflesJobs account was found with this Google email. Please register first.',
      });
    }

    // Role check — only Job Seekers allowed
    if (user.role !== 'Job Seeker') {
      return res.status(403).json({
        success: false,
        message: 'Google Sign-In is available only for registered Job Seekers.',
      });
    }

    // Link Google UID if not already linked
    if (!user.firebaseUid) {
      user.firebaseUid = firebaseUid;
      user.authProvider = 'google';
    }
    if (!user.avatar && photoURL) user.avatar = photoURL;
    user.isEmailVerified = user.isEmailVerified || !!emailVerified;
    await user.save();

    return sendTokenResponse(user, 200, res);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'An account with this Google email already exists.' });
    }
    console.error('Google login error:', error.message);
    next(error);
  }
};

// @desc    Send OTP via Email
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Generate a random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in database
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: otpCode });

    // Send Email via Raffles Jobs Brevo SMTP Template
    const { getRafflesEmailTemplate } = require('../utils/emailTemplate');
    const emailHtml = getRafflesEmailTemplate({
      title: 'Verify Your Email Address',
      subtitle: 'RAFFLES JOBS Account Verification',
      greeting: 'Welcome to RAFFLES JOBS,',
      bodyText: 'Thank you for registering with us. Please use the following One-Time Password (OTP) code to verify your email address and activate your account:',
      otpCode: otpCode,
      footerNote: 'This OTP is valid for 5 minutes. If you did not request this verification, please ignore this email.',
    });

    await sendEmail({
      to: email,
      subject: `[RAFFLES JOBS] Your Verification OTP (${otpCode})`,
      text: `Your OTP verification code for Raffles Jobs is ${otpCode}. It is valid for 5 minutes.`,
      html: emailHtml,
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, message: 'Please provide OTP' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP has expired or does not exist. Please request a new one.' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    // Delete verified OTP
    await OTP.deleteMany({ email });

    // let avatarUrl = '';
    // if (req.files && req.files.avatar) {
    //   avatarUrl = await uploadToCloudinaryOrLocal(req.files.avatar[0], 'avatars');
    // }

    // Create user
    const isEmployer = (role === 'Employer');
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'Job Seeker',
      isApproved: !isEmployer,
      employerAccess: !isEmployer,
      status: isEmployer ? 'Pending' : 'Active',
      // avatar: avatarUrl,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(401).json({ success: false, message: 'This account uses Google Sign-In. Please use "Continue with Google" to sign in.' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout User / Clear Cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5000),
      httpOnly: true,
    });
    res.status(200).json({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      username,
      bio,
      skills,
      location,
      contactNumber,
      gender,
      dob,
      education,
      experience,
      projects,
      certifications
    } = req.body;

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (gender !== undefined) user.gender = gender;
    if (dob !== undefined) user.dob = dob;

    if (skills) {
      if (Array.isArray(skills)) {
        user.skills = skills;
      } else if (typeof skills === 'string') {
        try {
          user.skills = JSON.parse(skills);
        } catch (e) {
          user.skills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
      }
    }

    // Helper for parsing JSON array fields sent via FormData
    const parseField = (fieldData) => {
      if (!fieldData) return null;
      if (Array.isArray(fieldData)) return fieldData;
      if (typeof fieldData === 'string') {
        try {
          return JSON.parse(fieldData);
        } catch (e) {
          return null;
        }
      }
      return null;
    };

    if (education !== undefined) {
      const parsedEdu = parseField(education);
      if (parsedEdu) user.education = parsedEdu;
    }

    if (experience !== undefined) {
      const parsedExp = parseField(experience);
      if (parsedExp) user.experience = parsedExp;
    }

    if (projects !== undefined) {
      const parsedProj = parseField(projects);
      if (parsedProj) user.projects = parsedProj;
    }

    if (certifications !== undefined) {
      const parsedCert = parseField(certifications);
      if (parsedCert) user.certifications = parsedCert;
    }

    // Handle files upload (Direct folder routing for avatar and resume)
    if (req.files) {
      if (req.files.avatar) {
        user.avatar = await uploadAvatar(req.files.avatar[0]);
      }
      if (req.files.resume) {
        user.resume = await uploadResume(req.files.resume[0]);
        user.resumeOriginalName = req.files.resume[0].originalname;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};
