# Google Login Setup — RafflesJobs (Job Seekers Only)

## Overview

Firebase Google Authentication is enabled **only for Job Seeker** accounts. Employers and Admins continue using email/password authentication exclusively.

**This implementation uses Firebase Client SDK only. Firebase Admin SDK is NOT used.**

---

## Architecture

```
Job Seeker clicks "Continue with Google"
        ↓
[Agreement checkbox must be checked]
        ↓
Firebase Client SDK opens Google popup
        ↓
User authenticates with Google
        ↓
Firebase Client SDK returns user info
        ↓
Frontend sends user info to: POST /api/auth/job-seeker/google
        ↓
Backend creates/finds Job Seeker in MongoDB
        ↓
Backend creates JWT session
        ↓
Frontend stores token, redirects to /jobseeker-dashboard
```

---

## Security Limitation

**This implementation does NOT use Firebase Admin SDK.**

The backend receives Firebase user information from the frontend after Firebase Client SDK authentication. Without Firebase Admin SDK, the backend cannot cryptographically verify that the Firebase ID token is authentic.

- The frontend sends `firebaseUid`, `email`, `displayName`, `photoURL`, `emailVerified`
- The backend trusts this data as coming from a legitimate Firebase authentication
- The backend assigns `role = 'Job Seeker'` server-side (never from frontend)
- Employer/Admin emails are blocked by checking MongoDB records

**For production cryptographic verification**, Firebase Admin SDK should be added in the future.

---

## Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select or create the project **raffles-jobs**
3. Navigate to **Authentication > Sign-in method**
4. Enable **Google** as a sign-in provider
5. Set the **Project support email** (your admin email)
6. Click **Save**

### Authorized Domains

Under **Authentication > Settings > Authorized domains**, add:

- `rafflesjobs.com`
- `www.rafflesjobs.com`
- `localhost` (for development)

---

## Environment Variables

### Frontend (`client/.env`)

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=raffles-jobs.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=raffles-jobs
VITE_FIREBASE_STORAGE_BUCKET=raffles-jobs.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=671825970627
VITE_FIREBASE_APP_ID=1:671825970627:web:...
```

These are web client config values (not secrets). Safe for frontend.

---

## API Endpoint

```
POST /api/auth/job-seeker/google
```

**Request:**
```json
{
  "firebaseUid": "firebase-user-uid",
  "email": "user@gmail.com",
  "displayName": "User Name",
  "photoURL": "https://...",
  "emailVerified": true,
  "acceptedTerms": true
}
```

**Success Response (200/201):**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "_id": "...",
    "username": "John Doe",
    "email": "john@gmail.com",
    "role": "Job Seeker",
    "avatar": "https://...",
    ...
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Google Sign-In is available only for Job Seekers."
}
```

---

## Existing User Handling

| Case | Action |
|---|---|
| Firebase UID exists + Job Seeker | Login existing user |
| Email exists + Job Seeker | Link Firebase UID, login |
| Email exists + Employer | Reject (403) |
| Email exists + Admin | Reject (403) |
| New email | Create new Job Seeker |
| acceptedTerms !== true | Reject (400) |

---

## Security Protections

| Protection | Implementation |
|---|---|
| Role not trusted from frontend | Backend assigns role='Job Seeker' server-side |
| Employer blocked | Email match + role !== 'Job Seeker' → 403 |
| Admin blocked | Email match + role !== 'Job Seeker' → 403 |
| No duplicate accounts | Firebase UID lookup first, then email linking |
| Agreement required | acceptedTerms must be true for new accounts |
| Password not stored | Google users get random internal password |

---

## Files Changed

| File | Change |
|---|---|
| `server/models/User.js` | Added firebaseUid, authProvider, isEmailVerified, acceptedTerms fields; made password optional |
| `server/controllers/authController.js` | Added googleLogin handler (no Admin SDK); guarded password-less login |
| `server/routes/authRoutes.js` | Added POST /job-seeker/google route |
| `client/src/Service/apis.js` | Added GOOGLE_LOGIN_API |
| `client/src/Service/Operation/authApi.js` | Added googleLogin() function |
| `client/src/CorePages/LoginPage.jsx` | Google button (Job Seeker only) |
| `client/src/CorePages/RegisterPage.jsx` | Google button (Job Seeker only) |
| `client/src/Template/GoogleLoginButton.jsx` | Agreement checkbox + Google sign-in |
| `client/src/Template/index.js` | Exported GoogleLoginButton |
| `.gitignore` | Added Firebase service account JSON exclusions |

## Files Created

| File | Purpose |
|---|---|
| `client/src/config/firebase.js` | Firebase web SDK config |
| `GOOGLE_LOGIN_SETUP.md` | This documentation |

## Files Removed

| File | Reason |
|---|---|
| `server/config/firebaseAdmin.js` | Firebase Admin SDK not used |

## Dependencies

| Package | Status |
|---|---|
| `firebase` (client) | Retained — required for Google Sign-In |
| `firebase-admin` (server) | Removed — not used |

---

## Testing Checklist

| Test | Expected |
|---|---|
| New Google user → Job Seeker | Account created, role = 'Job Seeker', logged in |
| Existing Job Seeker → Google Login | No duplicate, linked, logged in |
| Existing email/password Job Seeker → Google | Firebase UID linked, same account |
| Employer → Google Login | Rejected: 403 |
| Admin → Google Login | Rejected: 403 |
| Agreement unchecked → Google button | Disabled, error shown |
| Popup closed by user | Friendly toast |
| Employer login still works | Unchanged |
| Admin login still works | Unchanged |
