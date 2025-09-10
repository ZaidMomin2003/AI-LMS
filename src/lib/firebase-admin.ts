
'use server';

import admin from 'firebase-admin';
import { config } from 'dotenv';

// Load environment variables from .env file.
config({ path: '.env' });

// This function now correctly handles the service account key.
const getServiceAccount = () => {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    throw new Error('Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }
  try {
    // Correctly parse the JSON by handling the newline characters in the private key.
    return JSON.parse(serviceAccountJson.replace(/\\n/g, '\\n'));
  } catch (error) {
    console.error("Firebase Admin SDK Error: Could not parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string in your .env file.", error);
    throw new Error('Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_KEY is malformed.');
  }
};


// This function ensures we initialize the app only once.
const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin;
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(getServiceAccount()),
  });

  return admin;
};

// Export the initialized instance directly.
export const firebaseAdmin = initializeFirebaseAdmin();

// A simple boolean check for convenience.
export const isFirebaseAdminInitialized = () => {
    return admin.apps.length > 0;
};
