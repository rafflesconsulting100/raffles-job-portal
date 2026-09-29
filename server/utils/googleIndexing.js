// Google Indexing API client (server-side only).
//
// Architecture notes:
//   * Requires a Google Cloud service account with the "Web Search Indexer"
//     role and the Indexing API enabled. Credentials come ONLY from env vars —
//     nothing is hard-coded or committed.
//   * Without credentials every call is a silent no-op, so local dev and
//     deployments that have not configured the API keep working unchanged.
//   * Uses Node built-ins only (crypto for RS256 JWT signing, global fetch).
//
// Suggested env vars:
//   GOOGLE_INDEXING_SERVICE_ACCOUNT  -> JSON key contents (or an absolute path)
//   GOOGLE_INDEXING_ENABLED=true     -> opt-in switch
//
// Call sites: after a job is created / updated / closed, ping its public URL.

const crypto = require('crypto');

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const INDEXING_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const JWT_AUDIENCE = TOKEN_ENDPOINT;
const SCOPE = 'https://www.googleapis.com/auth/indexing';

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function getServiceAccount() {
  if (process.env.GOOGLE_INDEXING_ENABLED !== 'true') return null;

  const raw = (process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT || '').trim();
  if (!raw) return null;

  try {
    const json = raw.startsWith('{') ? raw : require('fs').readFileSync(raw, 'utf8');
    const parsed = JSON.parse(json);
    if (!parsed.client_email || !parsed.private_key) return null;
    return parsed;
  } catch (err) {
    console.warn('Google Indexing API: invalid service account config —', err.message);
    return null;
  }
}

function base64Url(input) {
  return Buffer.from(input).toString('base64url');
}

function signRs256(data, privateKey) {
  return crypto.sign('RSA-SHA256', Buffer.from(data), privateKey);
}

function buildAssertionToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: SCOPE,
      aud: JWT_AUDIENCE,
      iat: now,
      exp: now + 3600,
    })
  );
  const signature = signRs256(`${header}.${payload}`, serviceAccount.private_key);
  return `${header}.${payload}.${base64Url(signature)}`;
}

async function getAccessToken(serviceAccount) {
  if (cachedToken && Date.now() < cachedTokenExpiresAt) return cachedToken;

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: buildAssertionToken(serviceAccount),
    }),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed (${response.status})`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  // Refresh 60s before actual expiry.
  cachedTokenExpiresAt = Date.now() + Math.max((data.expires_in - 60) * 1000, 60 * 1000);
  return cachedToken;
}

/**
 * Publishes a URL to the Google Indexing API.
 * Returns { skipped: true } when the API is not configured.
 */
async function notifyGoogle(url, urlUpdateType = 'URL_UPDATED') {
  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    return { skipped: true, reason: 'not-configured' };
  }

  try {
    const token = await getAccessToken(serviceAccount);
    const response = await fetch(INDEXING_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, urlUpdateType }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Indexing publish failed (${response.status}): ${body.slice(0, 200)}`);
    }

    return { skipped: false, ...(await response.json()) };
  } catch (err) {
    // Never let indexing notifications break the API response.
    console.warn('Google Indexing API notify failed:', err.message);
    return { skipped: false, error: err.message };
  }
}

/** Convenience helpers for job lifecycle events. */
const notifyJobUpdated = (url) => notifyGoogle(url, 'URL_UPDATED');
const notifyJobDeleted = (url) => notifyGoogle(url, 'URL_DELETED');

module.exports = { notifyGoogle, notifyJobUpdated, notifyJobDeleted };
