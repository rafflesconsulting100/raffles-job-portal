const express = require('express');
const router = express.Router();
const {
  applyJob,
  getCandidateApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
  getDashboardStats,
  getStudentDatabase,
} = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');

router.get('/student-database', protect, restrictTo('Employer'), getStudentDatabase);
router.post('/apply/:jobId', protect, restrictTo('Job Seeker'), upload.fields([{ name: 'resume', maxCount: 1 }]), applyJob);
router.get('/my-applications', protect, restrictTo('Job Seeker'), getCandidateApplications);
router.get('/job/:jobId', protect, restrictTo('Employer'), getJobApplicants);
router.get('/stats', protect, restrictTo('Employer'), getDashboardStats);
router.patch('/:id/status', protect, restrictTo('Employer'), updateApplicationStatus);
router.delete('/:id', protect, restrictTo('Job Seeker'), withdrawApplication);

module.exports = router;
