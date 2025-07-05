import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if the required Firebase config values are missing or still placeholders
if (
  !firebaseConfig.apiKey ||
  firebaseConfig.apiKey.includes('your_api_key_here') ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId
) {
  // This error is thrown to prevent the app from initializing Firebase with invalid credentials,
  // making it clear to the developer that they need to configure their .env file.
  throw new Error(
    'Firebase environment variables are not set correctly. Please add your Firebase project credentials to the .env file.'
  );
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
