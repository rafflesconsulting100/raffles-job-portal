const mongoose = require('mongoose');

/**
 * AuditLog — immutable record of employer-lifecycle and admin actions.
 *
 * This is append-only: no document should ever be updated or deleted
 * once created.  Frontend consumers must never receive sensitive values
 * (passwords, OTP, tokens).
 */
const auditLogSchema = new mongoose.Schema(
  {
    // The employer (or user) the action targets
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // The admin or system that performed the action (null = system)
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    /**
     * Canonical action codes:
     *   employer_registered        – new employer account created
     *   employer_approved          – admin approved the employer
     *   employer_rejected          – admin rejected the employer
     *   employer_revoked           – admin revoked access
     *   employer_regranted         – admin re-granted access
     *   employer_mobile_updated    – employer saved/updated their mobile number
     *   employer_profile_updated   – employer updated other profile fields
     */
    action: {
      type: String,
      required: true,
      enum: [
        'employer_registered',
        'employer_approved',
        'employer_rejected',
        'employer_revoked',
        'employer_regranted',
        'employer_mobile_updated',
        'employer_profile_updated',
        'employer_login',
      ],
    },
    // Human-readable description — never include secrets here
    description: {
      type: String,
      default: '',
    },
    // Optional key→value metadata (e.g. previous status, new status)
    // Keep values short; never store passwords/tokens/OTPs here.
    meta: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,   // createdAt only matters; updatedAt is unused
    versionKey: false,
  }
);

// Fast lookups by target user in reverse-chronological order
auditLogSchema.index({ targetUser: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
