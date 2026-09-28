// Verifies a Firebase ID token server-side with Google's Identity Toolkit
// Accounts Lookup REST API, so the backend trusts the token instead of raw
// profile fields sent by the browser.
// Docs: https://firebase.google.com/docs/reference/rest/auth#section-accounts-lookup
// Requires FIREBASE_API_KEY (the Firebase Web API Key) in the environment.

const LOOKUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup';

const verifyFirebaseIdToken = async (idToken) => {
  if (!idToken || typeof idToken !== 'string') {
    return { valid: false, message: 'Missing required Google authentication data' };
  }

  const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) {
    console.error('Google sign-in blocked: FIREBASE_API_KEY is not set on the server.');
    return { valid: false, message: 'Google Sign-In is temporarily unavailable.' };
  }

  try {
    const response = await fetch(`${LOOKUP_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error(`Google ID token rejected (${response.status}): ${detail}`);
      return { valid: false, message: 'Google Sign-In could not verify your identity.' };
    }

    const data = await response.json();
    const account = Array.isArray(data.users) && data.users.length ? data.users[0] : null;

    if (!account || !account.email) {
      console.error('Google ID token lookup returned no account.');
      return { valid: false, message: 'Google Sign-In could not verify your identity.' };
    }

    // Requiring a verified email is what stops a token minted in some other
    // Firebase project (or with an unverified address) from taking over an
    // account in this project.
    if (account.emailVerified !== true) {
      return { valid: false, message: 'Please verify your Google account email before signing in.' };
    }

    return {
      valid: true,
      firebaseUid: account.localId,
      email: account.email.toLowerCase().trim(),
      displayName: account.displayName || '',
      photoURL: account.photoUrl || '',
    };
  } catch (error) {
    console.error('Google ID token verification failed:', error.message);
    return { valid: false, message: 'Google Sign-In could not verify your identity.' };
  }
};

module.exports = { verifyFirebaseIdToken };
