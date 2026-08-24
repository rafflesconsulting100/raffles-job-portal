const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllEmployers,
  toggleEmployerAccess,
  getAllJobs,
  updateJobStatus,
  deleteJobByAdmin,
  getAllUsers,
  updateUserRole,
  deleteUserByAdmin,
  seedAdmin,
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Route for self-promoting/seeding admin access (protected by login)
router.post('/seed', protect, seedAdmin);

// All following routes require Admin role
router.use(protect, restrictTo('Admin'));

router.get('/stats', getAdminStats);
router.get('/employers', getAllEmployers);
router.put('/employers/:id/access', toggleEmployerAccess);

router.get('/jobs', getAllJobs);
router.put('/jobs/:id/status', updateJobStatus);
router.delete('/jobs/:id', deleteJobByAdmin);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserByAdmin);

module.exports = router;
