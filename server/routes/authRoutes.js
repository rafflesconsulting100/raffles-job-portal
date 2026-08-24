const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, updateProfile, sendOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');

router.post('/send-otp', sendOtp);

router.post(
  '/register',
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  register
);

router.post('/login', login);

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
