const express = require('express');
const router = express.Router();
const {
  applyJob,
  getCandidateApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
  getDashboardStats,
  getEmployerApplications,
  getStudentDatabase,
  getApplicationResume,
} = require('../controllers/applicationController');
const { protect, restrictTo, checkEmployerAccess } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');

router.get('/student-database', protect, restrictTo('Employer'), checkEmployerAccess, getStudentDatabase);
router.post('/apply/:jobId', protect, restrictTo('Job Seeker'), upload.fields([{ name: 'resume', maxCount: 1 }]), applyJob);
router.get('/employer-applications', protect, restrictTo('Employer'), checkEmployerAccess, getEmployerApplications);
router.get('/my-applications', protect, restrictTo('Job Seeker'), getCandidateApplications);
router.get('/job/:jobId', protect, restrictTo('Employer', 'Admin'), checkEmployerAccess, getJobApplicants);
router.get('/:id/resume', protect, restrictTo('Employer', 'Admin'), checkEmployerAccess, getApplicationResume);
router.get('/stats', protect, restrictTo('Employer'), checkEmployerAccess, getDashboardStats);
router.patch('/:id/status', protect, restrictTo('Employer', 'Admin'), checkEmployerAccess, updateApplicationStatus);
router.delete('/:id', protect, restrictTo('Job Seeker'), withdrawApplication);

module.exports = router;
