/**
 * Firebase Cloud Messaging service for sending push notifications.
 * Uses Firebase Admin SDK with service account credentials from environment.
 */

const admin = require('firebase-admin');

let fcmInitialized = false;
let initError = null;

/**
 * Initialize Firebase Admin SDK.
 * Reads credentials from FIREBASE_SERVICE_ACCOUNT (raw JSON) or
 * FIREBASE_SERVICE_ACCOUNT_PATH (file path) environment variables.
 * Falls back to Application Default Credentials (ADC) if available.
 */
const initFCM = () => {
  if (fcmInitialized) return true;
  if (initError) return false;

  try {
    // Check if already initialized (e.g., by another module)
    if (admin.apps.length > 0) {
      fcmInitialized = true;
      console.log('[FCM] Firebase Admin SDK already initialized');
      return true;
    }

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const googleAppCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    let credential;

    if (serviceAccountJson && serviceAccountJson.trim().length > 0) {
      // Parse raw JSON from environment variable
      const serviceAccount = JSON.parse(serviceAccountJson);
      credential = admin.credential.cert(serviceAccount);
      console.log('[FCM] Initialized with FIREBASE_SERVICE_ACCOUNT (JSON)');
    } else if (serviceAccountPath && serviceAccountPath.trim().length > 0) {
      // Load from file path
      credential = admin.credential.cert(serviceAccountPath);
      console.log('[FCM] Initialized with FIREBASE_SERVICE_ACCOUNT_PATH (file)');
    } else if (googleAppCreds && googleAppCreds.trim().length > 0) {
      // Application Default Credentials with explicit path
      credential = admin.credential.applicationDefault();
      console.log('[FCM] Initialized with GOOGLE_APPLICATION_CREDENTIALS');
    } else {
      initError = new Error('No Firebase credentials configured in environment');
      console.warn('[FCM] Push notifications disabled: FIREBASE_SERVICE_ACCOUNT environment variable is not configured.');
      return false;
    }

    admin.initializeApp({ credential });
    fcmInitialized = true;
    console.log('[FCM] Firebase Admin SDK initialized successfully');
    return true;
  } catch (err) {
    initError = err;
    console.error('[FCM] Initialization failed:', err.message);
    console.warn('[FCM] Push notifications disabled: Set FIREBASE_SERVICE_ACCOUNT to enable push notifications.');
    return false;
  }
};

/**
 * Send a push notification to a single device token.
 * @param {string} token - FCM device token
 * @param {Object} payload - Notification payload
 * @param {string} payload.title - Notification title
 * @param {string} payload.body - Notification body
 * @param {Object} [payload.data] - Additional data fields (all values must be strings)
 * @returns {Promise<Object|null>} FCM response or null if failed
 */
const sendToToken = async (token, payload) => {
  if (!initFCM()) {
    console.warn('[FCM] Skipping send: FCM not initialized');
    return null;
  }

  if (!token) {
    console.warn('[FCM] Skipping send: empty token');
    return null;
  }

  try {
    const message = {
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
      android: {
        priority: 'high',
        notification: {
          channelId: 'rafflesjobs_channel',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK', // Standard FCM click action
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            'content-available': 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('[FCM] Message sent successfully:', response);
    return response;
  } catch (err) {
    // Handle specific FCM errors
    if (err.code === 'messaging/registration-token-not-registered' ||
        err.code === 'messaging/invalid-registration-token' ||
        err.code === 'messaging/third-party-auth-error') {
      console.warn('[FCM] Token invalid/unregistered:', token, '-', err.message);
      return { error: 'token_invalid', code: err.code };
    }
    console.error('[FCM] Send failed:', err.message);
    return null;
  }
};

/**
 * Send push notifications to multiple device tokens.
 * @param {string[]} tokens - Array of FCM device tokens
 * @param {Object} payload - Notification payload (same as sendToToken)
 * @returns {Promise<Object>} Results with success/failure counts and invalid tokens
 */
const sendToTokens = async (tokens, payload) => {
  if (!initFCM()) {
    return { successCount: 0, failureCount: tokens.length, invalidTokens: [], responses: [], reason: 'fcm_not_configured' };
  }

  if (!tokens || tokens.length === 0) {
    return { successCount: 0, failureCount: 0, invalidTokens: [], responses: [] };
  }

  // Filter out empty tokens
  const validTokens = tokens.filter(t => t && t.trim());
  if (validTokens.length === 0) {
    return { successCount: 0, failureCount: 0, invalidTokens: [], responses: [] };
  }

  try {
    const message = {
      tokens: validTokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
      android: {
        priority: 'high',
        notification: {
          channelId: 'rafflesjobs_channel',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            'content-available': 1,
          },
        },
      },
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    const invalidTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const err = resp.error;
        if (err.code === 'messaging/registration-token-not-registered' ||
            err.code === 'messaging/invalid-registration-token' ||
            err.code === 'messaging/third-party-auth-error') {
          invalidTokens.push(validTokens[idx]);
        }
      }
    });

    console.log(`[FCM] Multicast: ${response.successCount} success, ${response.failureCount} failed, ${invalidTokens.length} invalid tokens`);
    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokens,
      responses: response.responses,
    };
  } catch (err) {
    console.error('[FCM] Multicast send failed:', err.message);
    return { successCount: 0, failureCount: validTokens.length, invalidTokens: [], responses: [] };
  }
};

/**
 * Clean up invalid tokens from user's deviceTokens array.
 * @param {string} userId - User ID
 * @param {string[]} invalidTokens - Tokens to remove
 */
const cleanupInvalidTokens = async (userId, invalidTokens) => {
  if (!invalidTokens || invalidTokens.length === 0) return;

  try {
    const User = require('../models/User');
    await User.updateOne(
      { _id: userId },
      {
        $pull: {
          deviceTokens: {
            token: { $in: invalidTokens },
          },
        },
      }
    );
    try {
      await User.collection.updateOne(
        { _id: userId },
        {
          $pull: {
            deviceTokens: {
              $in: invalidTokens,
            },
          },
        }
      );
    } catch (_) {}
    console.log(`[FCM] Cleaned up ${invalidTokens.length} invalid tokens for user ${userId}`);
  } catch (err) {
    console.error('[FCM] Failed to cleanup invalid tokens:', err.message);
  }
};

module.exports = {
  initFCM,
  sendToToken,
  sendToTokens,
  cleanupInvalidTokens,
};