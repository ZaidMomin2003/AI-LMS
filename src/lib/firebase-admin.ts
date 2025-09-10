
import admin from 'firebase-admin';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// This function now correctly builds the service account object from the single environment variable.
const getServiceAccount = () => {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountString) {
    throw new Error('Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }
  
  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    
    // CRITICAL FIX: Ensure the private key has real newlines.
    // The value from .env file has "\\n" which needs to be replaced with "\n".
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    return serviceAccount as admin.ServiceAccount;
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
