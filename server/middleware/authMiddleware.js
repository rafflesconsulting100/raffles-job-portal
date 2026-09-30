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
      let message = 'Your account has been suspended or rejected. Please contact support.';
      if (req.user.role === 'Employer') {
        if (req.user.status === 'Rejected' || req.user.approvalStatus === 'rejected') {
          message = 'Your employer account registration was not approved.';
        } else if (req.user.status === 'Suspended' || req.user.approvalStatus === 'revoked') {
          message = 'Your employer access has been revoked. Please contact RafflesJobs support.';
        }
      }
      return res.status(403).json({
        success: false,
        message,
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
    const userRole = (req.user?.role || '').trim();
    const normalizedUserRole = userRole.toLowerCase().replace(/[\s_-]+/g, '');
    const isAllowed = roles.some((role) => {
      const normalizedTarget = role.trim().toLowerCase().replace(/[\s_-]+/g, '');
      if (normalizedTarget === normalizedUserRole) return true;
      // Admin permission automatically extends to Super Admin variants
      if (normalizedTarget === 'admin' && (normalizedUserRole === 'admin' || normalizedUserRole === 'superadmin')) {
        return true;
      }
      return false;
    });

    if (!req.user || !isAllowed) {
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
    const isApproved =
      approval === 'approved' ||
      (req.user.status === 'Active' &&
        req.user.isApproved === true &&
        req.user.employerAccess === true &&
        req.user.status !== 'Pending' &&
        req.user.status !== 'Suspended' &&
        req.user.status !== 'Rejected');

    if (!isApproved) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG][EmployerAccessCheck] Employer ${req.user._id} approval: ${approval}, status: ${req.user.status} -> DENIED`);
      }

      let message = 'Your employer account is pending Admin approval.';

      if (approval === 'rejected' || req.user.status === 'Rejected') {
        message = 'Your employer account registration was not approved.';
      } else if (approval === 'revoked' || req.user.status === 'Suspended') {
        message = 'Your employer access has been revoked. Please contact RafflesJobs support.';
      } else {
        message = 'Your employer account is pending Admin approval.';
      }

      return res.status(403).json({
        success: false,
        code: 'EMPLOYER_ACCESS_REQUIRED',
        message,
      });
    }

    // Backend Access Control: Approved employers must provide mobile before creating jobs / accessing candidate tools
    const hasMobile =
      (typeof req.user.mobileNumber === 'string' && req.user.mobileNumber.trim() !== '') ||
      (typeof req.user.contactNumber === 'string' && req.user.contactNumber.trim() !== '');

    if (!hasMobile) {
      return res.status(403).json({
        success: false,
        code: 'MOBILE_NUMBER_REQUIRED',
        message: 'Mobile number is required. Please add your mobile number to complete verification before accessing employer features.',
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG][EmployerAccessCheck] Employer ${req.user._id} approval: ${approval}, status: ${req.user.status} -> ALLOWED`);
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
