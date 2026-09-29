const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/', contactLimiter, submitContactForm);

module.exports = router;
