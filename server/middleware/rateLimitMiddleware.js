// In-memory fixed-window rate limiter (no extra dependency).
// Limits are per client IP and per endpoint bucket, so one caller cannot
// exhaust another caller's budget. Suitable for a single-process deployment;
// replace with a shared store if the API is ever scaled horizontally.
//
// Limits can be tuned with env vars (all optional):
//   RATE_LIMIT_WINDOW_MS         window length, default 900000 (15 min)
//   RATE_LIMIT_SEND_OTP_MAX      default 5
//   RATE_LIMIT_LOGIN_MAX         default 10
//   RATE_LIMIT_REGISTER_MAX      default 10
//   RATE_LIMIT_ADMIN_LOGIN_MAX   default 5

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) > 0
  ? Number(process.env.RATE_LIMIT_WINDOW_MS)
  : 15 * 60 * 1000;

const limit = (envName, fallback) => {
  const value = Number(process.env[envName]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const buckets = new Map();

// Periodic sweep so expired buckets never accumulate.
const sweeper = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 60 * 1000);
if (typeof sweeper.unref === 'function') sweeper.unref();

const clientKey = (req) => req.ip || req.socket?.remoteAddress || 'unknown';

const rateLimit = ({ windowMs = WINDOW_MS, max, keyPrefix, message }) => {
  return (req, res, next) => {
    const now = Date.now();
    const key = `${keyPrefix}:${clientKey(req)}`;

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - bucket.count)));
    res.setHeader('RateLimit-Retry-After', String(retryAfter));

    if (bucket.count > max) {
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({
        success: false,
        message: message || 'Too many attempts. Please wait a few minutes and try again.',
      });
    }

    return next();
  };
};

// Test helper: clears all counters (used by verification scripts).
const resetRateLimits = () => buckets.clear();

const sendOtpLimiter = rateLimit({
  keyPrefix: 'send-otp',
  max: limit('RATE_LIMIT_SEND_OTP_MAX', 5),
  message: 'Too many verification emails requested. Please wait a few minutes and try again.',
});

const loginLimiter = rateLimit({
  keyPrefix: 'login',
  max: limit('RATE_LIMIT_LOGIN_MAX', 10),
  message: 'Too many sign-in attempts. Please wait a few minutes and try again.',
});

const registerLimiter = rateLimit({
  keyPrefix: 'register',
  max: limit('RATE_LIMIT_REGISTER_MAX', 10),
  message: 'Too many registration attempts. Please wait a few minutes and try again.',
});

const adminLoginLimiter = rateLimit({
  keyPrefix: 'admin-login',
  max: limit('RATE_LIMIT_ADMIN_LOGIN_MAX', 5),
  message: 'Too many administrator sign-in attempts. Please wait a few minutes and try again.',
});

module.exports = {
  rateLimit,
  sendOtpLimiter,
  loginLimiter,
  registerLimiter,
  adminLoginLimiter,
  resetRateLimits,
};
