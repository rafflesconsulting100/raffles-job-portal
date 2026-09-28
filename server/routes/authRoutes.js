const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, updateProfile, sendOtp, googleLogin, googleRegister } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');
const { sendOtpLimiter, loginLimiter, registerLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/send-otp', sendOtpLimiter, sendOtp);

router.post('/job-seeker/google/register', googleRegister);
router.post('/job-seeker/google/login', googleLogin);

router.post(
  '/register',
  registerLimiter,
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  register
);

router.post('/login', loginLimiter, login);

router.post('/logout', protect, logout);

router.route('/profile')
  .get(protect, getProfile)
  .put(
    protect,
    upload.fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'resume', maxCount: 1 }
    ]),
    updateProfile
  );

module.exports = router;
