import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  getMessaging,
  onMessage,
  getToken,
  deleteToken,
  onTokenRefresh,
} from 'firebase/messaging';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export { onMessage, getToken, deleteToken, onTokenRefresh };
export const firestore = getFirestore(app);

googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGooglePopup = async () => {
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
};

/**
 * Get the current FCM token and register it with the backend.
 * Call this after successful authentication.
 * Requires user to have granted notification permission.
 */
export const registerFCMTokenIfAllowed = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    const currentToken = await getToken(messaging);

    if (currentToken) {
      return currentToken;
    } else {
      console.warn('FCM token not available. Permission granted but token not generated.');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};
