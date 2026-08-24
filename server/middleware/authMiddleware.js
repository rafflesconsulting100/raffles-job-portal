const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey1234567890abcdefjobportal');

    // 3. Find user and attach to request
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User matching this token no longer exists' });
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
    const isAccessGranted = 
      req.user.employerAccess !== false && 
      req.user.isApproved !== false && 
      req.user.status !== 'Suspended';
      
    if (!isAccessGranted) {
      return res.status(403).json({
        success: false,
        message: 'Your employer portal access is restricted or suspended by Admin. Please contact system support for approval.',
      });
    }
  }
  next();
};

module.exports = { protect, restrictTo, checkEmployerAccess };
