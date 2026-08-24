const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: [true, 'OTP is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Expires in 5 minutes (TTL index)
    },
  }
);

module.exports = mongoose.model('OTP', otpSchema);
