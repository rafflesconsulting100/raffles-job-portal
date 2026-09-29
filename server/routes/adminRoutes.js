const express = require('express');
const router = express.Router();
const {
  adminLoginPasskey,
  getAdminStats,
  getAllEmployers,
  toggleEmployerAccess,
  approveEmployer,
  rejectEmployer,
  revokeEmployer,
  getAllJobs,
  updateJobStatus,
  deleteJobByAdmin,
  getAllUsers,
  updateUserRole,
  deleteUserByAdmin,
  getAllApplications,
  getEmployerAuditLog,
} = require('../controllers/adminController');
const { updateApplicationStatus } = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { adminLoginLimiter } = require('../middleware/rateLimitMiddleware');

// Public Admin Login with passkey / credentials
router.post('/login', adminLoginLimiter, adminLoginPasskey);

// All following routes require Admin role
router.use(protect, restrictTo('Admin'));

router.get('/stats', getAdminStats);
router.get('/employers', getAllEmployers);
router.get('/employers/:id/audit', getEmployerAuditLog);
router.put('/employers/:id/access', toggleEmployerAccess);
router.put('/employers/:id/approve', approveEmployer);
router.put('/employers/:id/reject', rejectEmployer);
router.put('/employers/:id/revoke', revokeEmployer);

// Convenience aliases for admin approval/rejection/revocation
router.put('/approve/:id', approveEmployer);
router.put('/reject/:id', rejectEmployer);
router.put('/revoke/:id', revokeEmployer);

router.get('/applications', getAllApplications);
router.patch('/applications/:id/status', updateApplicationStatus);

router.get('/jobs', getAllJobs);
router.put('/jobs/:id/status', updateJobStatus);
router.delete('/jobs/:id', deleteJobByAdmin);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserByAdmin);

module.exports = router;
