const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/auth');

let io = null;

/**
 * Initialize Socket.IO with HTTP server
 */
const initSocket = (server) => {
  // Allow the same origins as the Express HTTP API (CLIENT_URL, comma-separated).
  const allowedOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  io = socketIO(server, {
    cors: {
      origin: (origin, callback) => {
        // Native/mobile clients send no Origin header; browsers always do.
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        console.warn(`[Socket.IO] Rejected handshake from non-allowlisted origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      },
      // Handshakes only ever need GET (polling) and POST (polling payloads).
      methods: ['GET', 'POST'],
      credentials: false,
    },
    pingTimeout: 30000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  });

  // Authenticate socket connections using JWT token
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '') ||
        socket.handshake.query?.token;

      if (!token) {
        console.warn('[Socket.IO] Connection rejected: No auth token provided');
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(
        token,
        getJwtSecret()
      );

      if (!decoded || !decoded.id) {
        console.warn('[Socket.IO] Connection rejected: Invalid token payload');
        return next(new Error('Invalid token payload'));
      }

      socket.userId = decoded.id.toString();
      return next();
    } catch (err) {
      console.error('[Socket.IO] Authentication failed:', err.message);
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userRoom = `user:${socket.userId}`;
    socket.join(userRoom);
    console.log(`[Socket.IO] User connected: ${socket.userId} joined room ${userRoom}`);

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] User disconnected: ${socket.userId} (reason: ${reason})`);
    });
  });

  console.log('[Socket.IO] Initialized successfully');
  return io;
};

/**
 * Get the initialized io instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO is not initialized!');
  }
  return io;
};

/**
 * Send a real-time notification to a specific user room
 * @param {string|mongoose.Types.ObjectId} recipientId - User ID of the recipient
 * @param {Object} notification - Notification document or object
 */
const sendNotificationToUser = (recipientId, notification) => {
  if (!io) {
    console.warn('[Socket.IO] Cannot send notification: io instance not initialized');
    return false;
  }

  if (!recipientId) {
    console.warn('[Socket.IO] Cannot send notification: recipientId missing');
    return false;
  }

  try {
    const recipientRoom = `user:${recipientId.toString()}`;
    const payload = {
      notification: {
        _id: notification._id?.toString() || notification.id?.toString(),
        id: notification._id?.toString() || notification.id?.toString(),
        recipient: recipientId.toString(),
        sender: notification.sender,
        message: notification.message,
        type: notification.type || 'system',
        relatedJob: notification.relatedJob ? notification.relatedJob.toString() : null,
        isRead: notification.isRead || false,
        createdAt: notification.createdAt || new Date().toISOString(),
        updatedAt: notification.updatedAt || new Date().toISOString(),
      },
    };

    console.log(`[Socket.IO] Emitting 'notification:new' to room ${recipientRoom}:`, payload.notification.message);
    io.to(recipientRoom).emit('notification:new', payload);
    return true;
  } catch (err) {
    console.error('[Socket.IO] Error emitting notification:', err.message);
    return false;
  }
};

module.exports = {
  initSocket,
  getIO,
  sendNotificationToUser,
};
