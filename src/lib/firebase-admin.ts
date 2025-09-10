
import admin from 'firebase-admin';
import { config } from 'dotenv';

// Load environment variables from .env file.
config();

// This function ensures we initialize the app only once.
const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountJson) {
    // This will be caught by the server and displayed as a clear error.
    throw new Error('Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase Admin SDK Error: Could not parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string.", error);
    // Throw a more specific error to help diagnose the problem.
    throw new Error('Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_KEY is malformed.');
  }

  return admin;
};

// Export the function to get the initialized instance.
export const getFirebaseAdmin = () => {
  return initializeFirebaseAdmin();
};

// A simple boolean check for convenience.
export const isFirebaseAdminInitialized = () => {
    return admin.apps.length > 0;
};
