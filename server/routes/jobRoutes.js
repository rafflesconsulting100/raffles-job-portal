const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getEmployerJobs,
  getJobById,
  getJobBySlug,
  updateJob,
  deleteJob,
  saveJob,
  getSavedJobs,
} = require('../controllers/jobController');
const { protect, restrictTo, checkEmployerAccess, optionalAuth } = require('../middleware/authMiddleware');

router.route('/')
  .get(optionalAuth, getJobs)
  .post(protect, restrictTo('Employer'), checkEmployerAccess, createJob);

router.get('/my-jobs', protect, restrictTo('Employer'), checkEmployerAccess, getEmployerJobs);
router.get('/saved', protect, restrictTo('Job Seeker'), getSavedJobs);

// Public SEO route: /api/jobs/slug/:slug (two segments, never shadows /:id)
router.get('/slug/:slug', getJobBySlug);

router.route('/:id')
  .get(getJobById)
  .put(protect, restrictTo('Employer'), checkEmployerAccess, updateJob)
  .delete(protect, restrictTo('Employer'), checkEmployerAccess, deleteJob);

router.post('/:id/save', protect, restrictTo('Job Seeker'), saveJob);

module.exports = router;
