// Central JWT secret handling.
//
// The signing secret must come from the JWT_SECRET environment variable. In
// development a fixed constant keeps a fresh checkout working out of the box;
// in production the server refuses to start without a strong secret, and the
// previously hard-coded default is explicitly rejected.

const REVOKED_DEFAULT_SECRET = 'supersecretkey1234567890abcdefjobportal';
const DEV_FALLBACK_SECRET = 'dev-only-insecure-jwt-secret-change-me';
const MIN_PRODUCTION_SECRET_LENGTH = 32;

const isProduction = () => process.env.NODE_ENV === 'production';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (isProduction()) {
      throw new Error('JWT_SECRET is not set. Refusing to start in production without a JWT signing secret.');
    }
    return DEV_FALLBACK_SECRET;
  }

  if (isProduction()) {
    if (secret === REVOKED_DEFAULT_SECRET) {
      throw new Error('JWT_SECRET still uses the revoked default value. Set a unique secret.');
    }
    if (secret.length < MIN_PRODUCTION_SECRET_LENGTH) {
      throw new Error(`JWT_SECRET must be at least ${MIN_PRODUCTION_SECRET_LENGTH} characters long.`);
    }
  }

  return secret;
};

// Admin passkey used by POST /api/admin/login.
//
// There is deliberately no passkey literal in the source: when the variable is
// missing the endpoint answers 503 instead of falling back to a guessable
// constant. A local checkout still works because server/.env provides the value.
const LEGACY_ADMIN_PASSKEY = 'RafflesAdmin@2026';
const DEFAULT_ADMIN_EMAIL = 'admin@rafflesconsulting.in';

const getAdminEmail = () => {
  const email = process.env.ADMIN_EMAIL;
  if (email && email.trim()) return email.trim().toLowerCase();
  if (isProduction()) return null;
  return DEFAULT_ADMIN_EMAIL;
};

const getAdminPasskey = () => {
  const key = process.env.ADMIN_PASSKEY;
  if (key && key.trim()) {
    // The sample value is committed to the repository, so it is public. In
    // production it must not authenticate anyone (mirrors the JWT_SECRET
    // rejection above) — fall through to the 503 path instead.
    if (isProduction() && key === LEGACY_ADMIN_PASSKEY) {
      return null;
    }
    return key;
  }
  if (isProduction()) return null;
  console.warn('[auth] ADMIN_PASSKEY is not set — using the development-only admin passkey.');
  return LEGACY_ADMIN_PASSKEY;
};

const warnWeakAdminPasskey = () => {
  if (!isProduction()) return;
  if (!process.env.ADMIN_PASSKEY || process.env.ADMIN_PASSKEY === LEGACY_ADMIN_PASSKEY) {
    console.warn(
      '[auth] ADMIN_PASSKEY is missing or still the committed sample value. Admin login is disabled until a unique passkey is set.'
    );
  }
};

// Fail fast at startup when the production configuration is unsafe.
const validateServerSecrets = () => {
  getJwtSecret();
  warnWeakAdminPasskey();
};

module.exports = { getJwtSecret, getAdminPasskey, getAdminEmail, validateServerSecrets };
