const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markRead,
  markAllRead,
  clearNotifications,
  registerToken,
  removeToken,
  checkDailyActivity,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Notification CRUD
router.get('/', protect, getNotifications);
router.delete('/', protect, clearNotifications);
router.patch('/read-all', protect, markAllRead);
router.patch('/:id/read', protect, markRead);

// FCM Device Token Management (supports both /register-token and /fcm-token endpoints)
router.post('/register-token', protect, registerToken);
router.post('/fcm-token', protect, registerToken);
router.post('/remove-token', protect, removeToken);
router.delete('/fcm-token', protect, removeToken);

// Daily Activity Check (for Job Seeker banner)
router.get('/daily-activity/check', protect, checkDailyActivity);

module.exports = router;