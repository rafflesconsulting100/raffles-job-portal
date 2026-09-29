const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../config/email');
const { uploadAvatar, uploadResume } = require('../config/cloudinary');
const { normalizeMobileNumber, mobileSearchValues } = require('../utils/validation');
const { verifyFirebaseIdToken } = require('../utils/firebaseAuth');
const { getJwtSecret } = require('../config/auth');

// Create token helper
const sendTokenResponse = (user, statusCode, res) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  const token = jwt.sign(
    { id: user._id },
    getJwtSecret(),
    { expiresIn }
  );

  // Parse the JWT expiry so the cookie never outlives the token.
  // Supports "7d", "24h", "30m", "60" (seconds) — the formats jsonwebtoken accepts.
  const match = expiresIn.match(/^(\d+)([dhm]|)$/);
  let cookieMs = 7 * 24 * 60 * 60 * 1000; // default 7 days
  if (match) {
    const value = parseInt(match[1], 10);
    const unit = match[2];
    if (unit === 'd') cookieMs = value * 24 * 60 * 60 * 1000;
    else if (unit === 'h') cookieMs = value * 60 * 60 * 1000;
    else if (unit === 'm') cookieMs = value * 60 * 1000;
    else cookieMs = value * 1000; // seconds
  }

  const cookieOptions = {
    expires: new Date(Date.now() + cookieMs),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Lax is helpful for local cross-port dev
  };

  // Determine if employer requires mobile number completion
  const requiresMobileNumber = user.role === 'Employer' &&
    user.isApproved === true &&
    user.employerAccess === true &&
    user.status === 'Active' &&
    (!user.mobileNumber || user.mobileNumber.trim() === '');

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    user: {
      _id: user._id,
      username: user.username,
      companyName: user.companyName || (user.role === 'Employer' ? user.username : ''),
      email: user.email,
      role: user.role,
      approvalStatus: user.approvalStatus || (
        user.status === 'Rejected'
          ? 'rejected'
          : user.status === 'Pending' || user.isApproved === false
          ? 'pending'
          : user.status === 'Suspended' || user.employerAccess === false
          ? 'revoked'
          : 'approved'
      ),
      isApproved: user.isApproved !== undefined ? user.isApproved : true,
      employerAccess: user.employerAccess !== undefined ? user.employerAccess : true,
      status: user.status || 'Active',
      mobileNumber: user.mobileNumber || user.contactNumber || '',
      contactNumber: user.contactNumber || user.mobileNumber || '',
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      location: user.location,
      gender: user.gender,
      dob: user.dob,
      education: user.education,
      experience: user.experience,
      projects: user.projects,
      certifications: user.certifications,
      resume: user.resume,
      resumeOriginalName: user.resumeOriginalName,
      savedJobs: user.savedJobs,
      requiresMobileNumber,
    },
  });
};

// @desc    Register new Job Seeker via Google
// @route   POST /api/auth/job-seeker/google/register
// @access  Public
exports.googleRegister = async (req, res, next) => {
  try {
    const { idToken, acceptedTerms } = req.body;

    const googleUser = await verifyFirebaseIdToken(idToken);
    if (!googleUser.valid) {
      return res.status(401).json({ success: false, message: googleUser.message });
    }

    const { firebaseUid, email, displayName, photoURL } = googleUser;

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
      isEmailVerified: true,
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
// SECURITY: the frontend sends a Firebase ID token; the server verifies it with
// Google's Identity Toolkit lookup API and only trusts the verified claims
// (email, uid, name, photo). Raw profile fields from the request body are
// ignored, so a caller cannot sign in as someone else.
// Google Sign-In is LOGIN ONLY — it never creates new accounts.
exports.googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const googleUser = await verifyFirebaseIdToken(idToken);
    if (!googleUser.valid) {
      return res.status(401).json({ success: false, message: googleUser.message });
    }

    const { firebaseUid, email, displayName, photoURL } = googleUser;
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
    user.isEmailVerified = true;
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
// ANTI-ENUMERATION: callers must not learn whether an email is registered.
// This endpoint always stores an OTP and always answers 200, so a registered
// and an unregistered address are indistinguishable from the outside.
exports.sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    // Generate a random 6-digit OTP (crypto, not Math.random — the code is a
    // credential and must not be predictable).
    const otpCode = crypto.randomInt(100000, 1000000).toString();

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

    try {
      await sendEmail({
        to: email,
        subject: `[RAFFLES JOBS] Your Verification OTP (${otpCode})`,
        text: `Your OTP verification code for Raffles Jobs is ${otpCode}. It is valid for 5 minutes.`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError.message);
      return res.status(500).json({
        success: false,
        message: 'We could not send the verification email right now. Please try again.',
      });
    }

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
    const {
      username,
      companyName: bodyCompanyName,
      email,
      password,
      confirmPassword,
      role,
      otp,
      mobileNumber: bodyMobileNumber,
      contactNumber: bodyContactNumber,
      acceptedTerms,
    } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, message: 'Please provide OTP' });
    }

    // The backend decides the account role. Only Job Seeker / Employer
    // registrations are accepted — registration input can never grant Admin.
    const requestedRole = typeof role === 'string' ? role.trim() : '';
    const roleKey = requestedRole.toLowerCase();
    if (requestedRole && roleKey !== 'job seeker' && roleKey !== 'employer') {
      return res.status(400).json({ success: false, message: 'Invalid registration role' });
    }
    const isEmployer = roleKey === 'employer';
    const accountRole = isEmployer ? 'Employer' : 'Job Seeker';
    const resolvedCompany = typeof bodyCompanyName === 'string' && bodyCompanyName.trim()
      ? bodyCompanyName.trim()
      : (typeof username === 'string' ? username.trim() : '');
    const resolvedUsername = typeof username === 'string' && username.trim()
      ? username.trim()
      : resolvedCompany;
    const companyName = resolvedCompany;
    const termsAccepted = acceptedTerms === true || acceptedTerms === 'true';

    // Common validations — these used to run only for Employers, so a Job
    // Seeker registration could skip the terms check entirely.
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    if (!password || String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Employers must always confirm; Job Seekers only send the field when the
    // form rendered it, so an empty value must not fail their registration.
    const confirmProvided = confirmPassword !== undefined && confirmPassword !== null && String(confirmPassword) !== '';
    if (isEmployer && !confirmProvided) {
      return res.status(400).json({ success: false, message: 'Please confirm your password' });
    }
    if (confirmProvided && confirmPassword !== password) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the Terms & Conditions and Privacy Policy.',
      });
    }

    // Employer registration validations
    let employerMobile = '';
    if (isEmployer) {
      if (!companyName) {
        return res.status(400).json({ success: false, message: 'Company name is required' });
      }

      const rawMobile = typeof (bodyMobileNumber || bodyContactNumber) === 'string' ? (bodyMobileNumber || bodyContactNumber).trim() : '';
      if (!rawMobile) {
        return res.status(400).json({ success: false, message: 'Mobile number is required' });
      }

      const normalizedMobile = normalizeMobileNumber(rawMobile);
      if (!normalizedMobile) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid mobile number (10-digit mobile number or +91XXXXXXXXXX).',
        });
      }

      employerMobile = normalizedMobile;
    }

    // Verify OTP first. Account-existence checks only run after the caller
    // proves control of the inbox, so outsiders cannot probe for registered
    // emails or mobiles through registration errors.
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP has expired or does not exist. Please request a new one.' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // NOTE: the OTP is only burned after every remaining validation passed
    // and the account actually exists. Deleting it first meant a later 400
    // (duplicate email/mobile, missing username) forced the user to request a
    // fresh OTP and restart the whole registration.

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    if (isEmployer) {
      const existingMobile = await User.findOne({
        $or: [
          { contactNumber: { $in: mobileSearchValues(employerMobile) } },
          { mobileNumber: { $in: mobileSearchValues(employerMobile) } },
        ]
      });
      if (existingMobile) {
        return res.status(400).json({ success: false, message: 'This mobile number is already registered.' });
      }
    }

    // Create user — new Employers always start as Pending awaiting Admin approval
    const user = await User.create({
      username: isEmployer ? (resolvedUsername || companyName) : username,
      companyName: isEmployer ? companyName : '',
      email: email.toLowerCase().trim(),
      password,
      role: accountRole,
      contactNumber: employerMobile,
      mobileNumber: employerMobile,
      approvalStatus: isEmployer ? 'pending' : 'approved',
      isApproved: !isEmployer,
      employerAccess: !isEmployer,
      status: isEmployer ? 'Pending' : 'Active',
      acceptedTerms: termsAccepted,
      termsAcceptedAt: termsAccepted ? new Date() : null,
      termsVersion: termsAccepted ? '1.0' : '',
    });

    // Consume the verified OTP only once the account exists.
    await OTP.deleteMany({ email });

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

    // `!email || !password` is true for objects/arrays too, and a non-string
    // email reaches bcrypt.compare (=> 500) or a `$`-operator filter.
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
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

    // Block suspended/rejected accounts from obtaining a new token
    if (user.status === 'Suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }
    if (user.status === 'Rejected') {
      return res.status(403).json({ success: false, message: 'Your account registration was not approved.' });
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
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    const isApprovedEmployer = user.role === 'Employer' &&
      (user.approvalStatus === 'approved' || (
        user.status === 'Active' &&
        user.isApproved !== false &&
        user.employerAccess !== false &&
        user.status !== 'Pending' &&
        user.status !== 'Rejected' &&
        user.status !== 'Suspended'
      ));

    const hasMobile = (typeof user.mobileNumber === 'string' && user.mobileNumber.trim() !== '') ||
      (typeof user.contactNumber === 'string' && user.contactNumber.trim() !== '');

    userObj.requiresMobileNumber = user.role === 'Employer' && isApprovedEmployer && !hasMobile;

    res.status(200).json({ success: true, user: userObj });
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
      companyName,
      bio,
      skills,
      location,
      contactNumber,
      mobileNumber,
      gender,
      dob,
      education,
      experience,
      projects,
      certifications
    } = req.body;

    // Protected fields: role, approvalStatus, isApproved, employerAccess, status cannot be changed by user
    if (user.role === 'Employer') {
      if (companyName) {
        user.companyName = companyName.trim();
      }
      if (username) {
        user.username = username.trim();
      }
      if (!user.companyName && user.username) {
        user.companyName = user.username;
      }
      if (!user.username && user.companyName) {
        user.username = user.companyName;
      }
    } else if (username) {
      user.username = username.trim();
    }

    if (mobileNumber !== undefined) {
      const rawMobile = typeof mobileNumber === 'string' ? mobileNumber.trim() : '';
      if (!rawMobile) {
        return res.status(400).json({ success: false, message: 'Mobile number cannot be empty' });
      }
      const normalizedMobile = normalizeMobileNumber(rawMobile);
      if (!normalizedMobile) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid mobile number (10-digit mobile number or +91XXXXXXXXXX).',
        });
      }
      const existingMobile = await User.findOne({
        _id: { $ne: user._id },
        $or: [
          { contactNumber: { $in: mobileSearchValues(normalizedMobile) } },
          { mobileNumber: { $in: mobileSearchValues(normalizedMobile) } },
        ],
      });
      if (existingMobile) {
        return res.status(400).json({ success: false, message: 'This mobile number is already registered.' });
      }
      user.mobileNumber = normalizedMobile;
      user.contactNumber = normalizedMobile;
    } else if (contactNumber !== undefined) {
      const rawContact = typeof contactNumber === 'string' ? contactNumber.trim() : '';
      if (!rawContact) {
        return res.status(400).json({ success: false, message: 'Contact number cannot be empty' });
      }
      const normalizedContact = normalizeMobileNumber(rawContact);
      if (!normalizedContact) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid mobile number (10-digit mobile number or +91XXXXXXXXXX).',
        });
      }
      const existingContact = await User.findOne({
        _id: { $ne: user._id },
        $or: [
          { contactNumber: { $in: mobileSearchValues(normalizedContact) } },
          { mobileNumber: { $in: mobileSearchValues(normalizedContact) } },
        ],
      });
      if (existingContact) {
        return res.status(400).json({ success: false, message: 'This mobile number is already registered.' });
      }
      user.contactNumber = normalizedContact;
      user.mobileNumber = normalizedContact;
    }

    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
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

    const userObj = user.toObject();
    delete userObj.password;

    const isApprovedEmployer = user.role === 'Employer' &&
      (user.approvalStatus === 'approved' || (
        user.status === 'Active' &&
        user.isApproved !== false &&
        user.employerAccess !== false &&
        user.status !== 'Pending' &&
        user.status !== 'Rejected' &&
        user.status !== 'Suspended'
      ));

    const hasMobile = (typeof user.mobileNumber === 'string' && user.mobileNumber.trim() !== '') ||
      (typeof user.contactNumber === 'string' && user.contactNumber.trim() !== '');

    userObj.requiresMobileNumber = user.role === 'Employer' && isApprovedEmployer && !hasMobile;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};
