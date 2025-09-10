import admin from 'firebase-admin';
import { config } from 'dotenv';

// Load environment variables directly within this module.
config();

const getServiceAccount = () => {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    // This error will be thrown if the .env variable is missing or not loaded.
    throw new Error('Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set or not accessible.');
  }
  try {
    return JSON.parse(serviceAccountJson.replace(/\\n/g, '\n'));
  } catch (error) {
    console.error("Firebase Admin SDK Error: Could not parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string.", error);
    throw new Error('Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_KEY is malformed.');
  }
};

// This function ensures we initialize the app only once.
const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    const serviceAccount = getServiceAccount();
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }
  return admin;
};

// Export the function to get the initialized instance.
export const getFirebaseAdmin = () => {
  return initializeFirebaseAdmin();
};

// A simple boolean check for convenience, though getFirebaseAdmin is preferred.
export const isFirebaseAdminInitialized = () => {
    return admin.apps.length > 0;
};
