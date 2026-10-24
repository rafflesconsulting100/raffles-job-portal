const Notification = require('../models/Notification');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { sendNotificationToUser } = require('../utils/socket');
const { sendToTokens, cleanupInvalidTokens } = require('../utils/fcm');

// Helper: send FCM push to a user's registered device tokens
const sendPushToUser = async (userId, payload) => {
  try {
    const user = await User.findById(userId).select('deviceTokens').lean();
    if (!user || !user.deviceTokens || user.deviceTokens.length === 0) {
      return { sent: 0, reason: 'no_tokens' };
    }

    // Extract token strings from deviceTokens array (supports both string and object formats, filters corrupted tokens)
    const tokens = user.deviceTokens
      .map(t => (typeof t === 'string' ? t : t?.token))
      .filter(t => t && t !== '[object Object]' && typeof t === 'string' && t.trim().length > 0);

    if (tokens.length === 0) {
      return { sent: 0, reason: 'no_valid_tokens' };
    }

    const result = await sendToTokens(tokens, payload);

    // Clean up invalid tokens
    if (result.invalidTokens && result.invalidTokens.length > 0) {
      await cleanupInvalidTokens(userId, result.invalidTokens);
    }

    return { sent: result.successCount, failed: result.failureCount, reason: result.reason };
  } catch (err) {
    console.error('[Push] Failed to send push to user:', userId, err.message);
    return { sent: 0, error: err.message };
  }
};

// @desc    Register FCM device token for authenticated user
// @route   POST /api/notifications/register-token OR /api/notifications/fcm-token
// @access  Private
exports.registerToken = async (req, res, next) => {
  try {
    const rawToken = req.body?.token;
    const token = typeof rawToken === 'string' ? rawToken.trim() : '';
    if (!token || token === '[object Object]') {
      return res.status(400).json({ success: false, message: 'Valid FCM token is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove this device token from any other accounts on this device to prevent cross-account push leakage
    await User.updateMany(
      { _id: { $ne: user._id } },
      {
        $pull: {
          deviceTokens: { token: token },
        },
      }
    );
    try {
      await User.collection.updateMany(
        { _id: { $ne: user._id }, deviceTokens: token },
        { $pull: { deviceTokens: token } }
      );
    } catch (_) {}

    // Initialize array if needed
    if (!user.deviceTokens) {
      user.deviceTokens = [];
    }

    // Clean up any corrupted "[object Object]" or empty tokens from current user
    user.deviceTokens = user.deviceTokens.filter(t => {
      const tStr = typeof t === 'string' ? t : t?.token;
      return tStr && tStr !== '[object Object]' && tStr.trim().length > 0;
    });

    // Check if token already exists
    const exists = user.deviceTokens.some(t => {
      const tStr = typeof t === 'string' ? t : t?.token;
      return tStr === token;
    });

    if (!exists) {
      user.deviceTokens.push({
        token,
        createdAt: new Date(),
        deviceType: req.body?.deviceType || 'android',
      });
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      message: 'FCM token registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove FCM device token (logout/handoff)
// @route   POST /api/notifications/remove-token OR DELETE /api/notifications/fcm-token
// @access  Private
exports.removeToken = async (req, res, next) => {
  try {
    const rawToken = req.body?.token;
    const token = typeof rawToken === 'string' ? rawToken.trim() : '';
    if (!token) {
      return res.status(400).json({ success: false, message: 'FCM token is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.deviceTokens && user.deviceTokens.length > 0) {
      user.deviceTokens = user.deviceTokens.filter(t => {
        const tokenStr = typeof t === 'string' ? t : t?.token;
        return tokenStr !== token && tokenStr !== '[object Object]';
      });
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      message: 'FCM token removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check daily activity for banner condition
// @route   GET /api/daily-activity/check
// @access  Private (Job Seeker only)
exports.checkDailyActivity = async (req, res, next) => {
  try {
    const { user } = req;

    if (user.role !== 'Job Seeker') {
      return res.status(200).json({
        success: true,
        hasActivity: false,
        message: 'Daily check only applies to Job Seekers',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of local day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Check if any job was published today (platform-wide)
    const jobsToday = await Job.find({
      status: 'active',
      createdAt: { $gte: today, $lt: tomorrow },
    }).select('_id');

    const hasPlatformActivity = jobsToday.length > 0;

    // 2. Check if the current user applied for any job today
    const applicationsToday = await Application.find({
      applicant: user._id,
      createdAt: { $gte: today, $lt: tomorrow },
    }).select('_id');

    const hasUserActivity = applicationsToday.length > 0;

    const hasActivity = hasPlatformActivity || hasUserActivity;

    res.status(200).json({
      success: true,
      hasActivity,
      platformActivity: hasPlatformActivity,
      userActivity: hasUserActivity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
exports.markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Verify recipient
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to read this notification' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all user notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all user notifications
// @route   DELETE /api/notifications
// @access  Private
exports.clearNotifications = async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({ recipient: req.user.id });

    res.status(200).json({
      success: true,
      message: 'All notifications cleared successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Notify eligible job seekers about a new job posting
// Creates persistent notifications and sends FCM push
// @param {Object} job - The saved Job document
// @param {string} [correlationId] - Tracing correlation ID
exports.notifyJobSeekersAboutNewJob = async (job, correlationId) => {
  const cid = correlationId || `job_${job?._id || 'unknown'}_${Date.now()}`;
  try {
    if (!job || !job._id) {
      console.warn(`[JobNotify][cid=${cid}] Invalid job document provided`);
      return { created: 0, pushed: 0 };
    }

    // [Trace Stage 2] Notification event handler executed
    console.log(`[Trace Stage 2] Notification event handler executed: notifyJobSeekersAboutNewJob for job=${job._id}, cid=${cid}`);

    // [Trace Stage 3] Resolve recipient account IDs:
    // - Role: Job Seeker
    // - Status: Active (not Suspended or Rejected)
    const eligibleSeekers = await User.find({
      role: 'Job Seeker',
      status: { $nin: ['Suspended', 'Rejected', 'suspended', 'rejected'] },
    }).select('_id deviceTokens').lean();

    const recipientCount = eligibleSeekers.length;
    const recipientSample = eligibleSeekers.slice(0, 3).map(s => s._id.toString().substring(0, 8) + '...').join(', ');
    console.log(`[Trace Stage 3] Resolved ${recipientCount} eligible Job Seeker recipient account(s) (sample: [${recipientSample}]) for cid=${cid}`);

    if (eligibleSeekers.length === 0) {
      console.log(`[JobNotify][cid=${cid}] No eligible job seekers found`);
      return { created: 0, pushed: 0 };
    }

    const title = 'New Job Opportunity!';
    const message = `${job.title} at ${job.company} is now hiring.`;

    let created = 0;
    let pushed = 0;

    // Create notifications in batches to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < eligibleSeekers.length; i += batchSize) {
      const batch = eligibleSeekers.slice(i, i + batchSize);

      // Prepare bulk upsert with unique per-seeker eventKey for deduplication
      const bulkOps = batch.map(seeker => {
        const eventKey = `job_published:${job._id}:${seeker._id}`;
        return {
          updateOne: {
            filter: { recipient: seeker._id, eventKey },
            update: {
              $setOnInsert: {
                recipient: seeker._id,
                sender: job.creator,
                message,
                type: 'new_job',
                relatedJob: job._id,
                eventKey,
                isRead: false,
              },
            },
            upsert: true,
          },
        };
      });

      try {
        const result = await Notification.bulkWrite(bulkOps, { ordered: false });
        created += result.upsertedCount || 0;
      } catch (err) {
        if (err.code === 11000) {
          const inserted = err.result?.nUpserted || err.result?.upsertedCount || 0;
          created += inserted;
          console.log(`[JobNotify][cid=${cid}] Batch ${i}: duplicate skipped, ${inserted} upserted`);
        } else {
          console.error(`[JobNotify][cid=${cid}] Batch bulkWrite failed:`, err.message);
        }
      }

      // [Trace Stage 4] Saved to MongoDB
      console.log(`[Trace Stage 4] Saved ${created} notification record(s) to MongoDB for job=${job._id}, cid=${cid}`);

      // Send FCM push in parallel (best effort)
      const pushPromises = batch.map(seeker =>
        sendPushToUser(seeker._id, {
          title,
          body: message,
          data: {
            type: 'new_job',
            jobId: job._id.toString(),
            notificationType: 'job_published',
            correlationId: cid,
          },
        })
      );

      const pushResults = await Promise.allSettled(pushPromises);
      pushResults.forEach(r => {
        if (r.status === 'fulfilled' && r.value && r.value.sent > 0) {
          pushed += r.value.sent;
        }
      });
    }

    // [Trace Stage 5] FCM send attempted and result recorded
    console.log(`[Trace Stage 5] FCM push summary for job=${job._id}, cid=${cid}: pushed=${pushed}, recipientsCount=${eligibleSeekers.length}`);
    return { created, pushed, correlationId: cid };
  } catch (error) {
    console.error(`[JobNotify][cid=${cid}] Failed to notify job seekers:`, error.message);
    return { created: 0, pushed: 0, error: error.message, correlationId: cid };
  }
};

// @desc    Notify employer about new application
// Creates persistent notification and sends FCM push
// @param {Object} application - The saved Application document (populated with job and applicant, or raw)
// @param {string} [correlationId] - Tracing correlation ID
exports.notifyEmployerAboutApplication = async (application, correlationId) => {
  const cid = correlationId || `app_${application?._id || 'unknown'}_${Date.now()}`;
  try {
    if (!application || !application._id) {
      console.warn(`[AppNotify][cid=${cid}] Invalid application document provided`);
      return { created: 0, pushed: 0 };
    }

    // [Trace Stage 2] Notification event handler executed
    console.log(`[Trace Stage 2] Notification event handler executed: notifyEmployerAboutApplication for application=${application._id}, cid=${cid}`);

    let job = application.job;
    let applicant = application.applicant;

    // Ensure job and its creator are available even if application wasn't fully populated
    if (!job || !job.creator || !job.title) {
      const jobId = job?._id || job || application.job;
      if (jobId) {
        job = await Job.findById(jobId);
      }
    }

    if (!job || !job.creator) {
      console.warn(`[AppNotify][cid=${cid}] Job or creator missing for application`, application._id);
      return { created: 0, pushed: 0 };
    }

    // Ensure applicant is populated
    if (!applicant || !applicant.username) {
      const applicantId = applicant?._id || applicant || application.applicant;
      if (applicantId) {
        applicant = await User.findById(applicantId).select('username avatar');
      }
    }

    const employerId = job.creator.toString();
    const applicantName = applicant?.username || 'A candidate';
    const applicantId = applicant?._id || application.applicant;
    const eventKey = `application_submitted:${application._id}`;
    const title = 'New Job Application';
    const message = `${applicantName} applied for "${job.title}" at ${job.company}`;

    // [Trace Stage 3] Resolved employer recipient account ID
    console.log(`[Trace Stage 3] Resolved employer recipient account id=${employerId} (role: Employer, for job "${job.title}") for cid=${cid}`);

    // Deduplication check: return early if already notified for this application
    const existingNotif = await Notification.findOne({ recipient: employerId, eventKey });
    if (existingNotif) {
      console.log(`[AppNotify][cid=${cid}] Duplicate application notification skipped:`, eventKey);
      return { created: 0, pushed: 0, duplicate: true, correlationId: cid };
    }

    // Create notification (deduplicated by eventKey)
    let notification;
    try {
      notification = await Notification.create({
        recipient: employerId,
        sender: applicantId,
        message,
        type: 'new_application',
        relatedJob: job._id,
        relatedApplication: application._id,
        eventKey,
        isRead: false,
      });
      // [Trace Stage 4] Saved to MongoDB
      console.log(`[Trace Stage 4] Saved new_application notification to MongoDB: notifId=${notification._id}, recipient=${employerId}, cid=${cid}`);
    } catch (err) {
      if (err.code === 11000) {
        console.log(`[AppNotify][cid=${cid}] Duplicate application notification skipped:`, eventKey);
        return { created: 0, pushed: 0, duplicate: true, correlationId: cid };
      }
      throw err;
    }

    // Send real-time socket notification
    try {
      const populatedNotif = await Notification.findById(notification._id).populate('sender', 'username avatar');
      sendNotificationToUser(employerId, populatedNotif || notification);
    } catch (err) {
      console.error(`[AppNotify][cid=${cid}] Socket emit failed:`, err.message);
    }

    // Send FCM push to employer
    const pushResult = await sendPushToUser(employerId, {
      title,
      body: message,
      data: {
        type: 'new_application',
        jobId: job._id.toString(),
        applicationId: application._id.toString(),
        notificationType: 'application_received',
        correlationId: cid,
      },
    });

    // [Trace Stage 5] FCM send attempted and result recorded
    console.log(`[Trace Stage 5] FCM push to employer ${employerId} for cid=${cid}: sent=${pushResult.sent}, failed=${pushResult.failed || 0}, reason=${pushResult.reason || 'ok'}`);
    return { created: 1, pushed: pushResult.sent || 0, correlationId: cid };
  } catch (error) {
    console.error(`[AppNotify][cid=${cid}] Failed to notify employer:`, error.message);
    return { created: 0, pushed: 0, error: error.message, correlationId: cid };
  }
};

// @desc    Notify candidate about application status change
// Creates persistent notification and sends FCM push
exports.notifyCandidateAboutStatusChange = async (application, newStatus, employerId) => {
  try {
    const job = application.job;
    const applicantId = application.applicant.toString();

    const eventKey = `status_change:${application._id}:${newStatus}`;
    const actionMsg = newStatus === 'accepted' ? 'ACCEPTED' : 'REJECTED';
    const title = 'Application Status Updated';
    const message = `Your application for "${job.title}" at ${job.company} was ${actionMsg}.`;

    // Create notification (deduplicated by eventKey)
    let notification;
    try {
      notification = await Notification.create({
        recipient: applicantId,
        sender: employerId,
        message,
        type: 'status_change',
        relatedJob: job._id,
        relatedApplication: application._id,
        eventKey,
        isRead: false,
      });
    } catch (err) {
      if (err.code === 11000) {
        console.log('[StatusNotify] Duplicate status notification skipped:', eventKey);
        return { created: 0, pushed: 0, duplicate: true };
      }
      throw err;
    }

    // Send real-time socket notification
    try {
      const populatedNotif = await Notification.findById(notification._id).populate('sender', 'username avatar');
      sendNotificationToUser(applicantId, populatedNotif || notification);
    } catch (err) {
      console.error('[StatusNotify] Socket emit failed:', err.message);
    }

    // Send FCM push
    const pushResult = await sendPushToUser(applicantId, {
      title,
      body: message,
      data: {
        type: 'status_change',
        jobId: job._id.toString(),
        applicationId: application._id.toString(),
        status: newStatus,
        notificationType: 'application_status',
      },
    });

    console.log(`[StatusNotify] Application ${application._id} -> ${newStatus}: notification created, push sent: ${pushResult.sent}`);
    return { created: 1, pushed: pushResult.sent || 0 };
  } catch (error) {
    console.error('[StatusNotify] Failed to notify candidate:', error.message);
    return { created: 0, pushed: 0, error: error.message };
  }
};