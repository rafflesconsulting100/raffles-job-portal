const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['status_change', 'new_application', 'new_job', 'system'],
      default: 'system',
    },
    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Stable event key for deduplication (e.g., "job_published:<jobId>" or "application_submitted:<applicationId>")
    eventKey: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Notifications are polled per recipient on every dashboard load.
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
// Compound unique index prevents duplicate notifications for the same event per recipient
notificationSchema.index({ recipient: 1, eventKey: 1 }, { unique: true, sparse: true });
notificationSchema.index({ eventKey: 1 }, { sparse: true });

module.exports = mongoose.model('Notification', notificationSchema);
