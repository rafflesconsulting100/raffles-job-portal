const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getJwtSecret } = require('../config/auth');

const protect = async (req, res, next) => {
  let token;

  // 1. Get token from cookies or authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, please login first' });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, getJwtSecret());

    // 3. Find user and attach to request
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User matching this token no longer exists' });
    }

    // 4. Block suspended/rejected accounts from accessing protected routes
    if (req.user.status === 'Suspended' || req.user.status === 'Rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended or rejected. Please contact support.',
      });
    }

    next();
  } catch (error) {
    console.error('JWT Auth Error:', error.message);
    return res.status(401).json({ success: false, message: 'Session expired or invalid token' });
  }
};

// Restrict access based on user role
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role || 'Guest'}) is not authorized to access this resource`,
      });
    }
    next();
  };
};

// Check if employer access is active & approved by admin
const checkEmployerAccess = (req, res, next) => {
  if (req.user && req.user.role === 'Employer') {
    const approval = (req.user.approvalStatus || '').toLowerCase();
    const isAccessGranted = 
      (approval ? approval === 'approved' : true) &&
      req.user.employerAccess !== false && 
      req.user.isApproved !== false && 
      req.user.status !== 'Suspended' &&
      req.user.status !== 'Rejected' &&
      req.user.status !== 'Pending';
      
    if (!isAccessGranted) {
      let message = 'Your employer portal access is pending admin approval or has been restricted. Please contact support.';

      if (
        approval === 'pending' ||
        req.user.status === 'Pending' ||
        (req.user.isApproved === false && req.user.status !== 'Suspended' && req.user.status !== 'Rejected')
      ) {
        message = 'Your employer account is pending Admin approval.';
      } else if (approval === 'rejected' || req.user.status === 'Rejected') {
        message = 'Your employer account registration was not approved.';
      } else if (approval === 'revoked' || req.user.status === 'Suspended' || req.user.employerAccess === false) {
        message = 'Your employer access has been revoked. Please contact RafflesJobs support.';
      }

      return res.status(403).json({
        success: false,
        message,
      });
    }
  }
  next();
};


// Optional auth: identifies user if token is provided, but does not block if not
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = await User.findById(decoded.id).select('-password');
  } catch (error) {
    // Ignore invalid/expired token for optional auth
  }
  next();
};

module.exports = { protect, restrictTo, checkEmployerAccess, optionalAuth };
