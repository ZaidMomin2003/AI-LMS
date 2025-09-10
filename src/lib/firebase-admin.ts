
import admin from 'firebase-admin';
import 'dotenv/config';

// Function to parse the service account key from environment variable
const getServiceAccount = () => {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    console.error('Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    return null;
  }
  try {
    // This replaces escaped newlines with actual newlines before parsing.
    return JSON.parse(serviceAccountJson.replace(/\\n/g, '\n'));
  } catch (error) {
    console.error("Firebase Admin SDK Error: Could not parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string.", error);
    return null;
  }
};

// Initialize Firebase Admin SDK only if it hasn't been already.
if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

/**
 * A simple function to check if the admin app is initialized.
 * This allows other parts of the app to fail gracefully if the setup is incorrect.
 * @returns {boolean} True if the Firebase Admin app is initialized, false otherwise.
 */
export function isFirebaseAdminInitialized(): boolean {
    return admin.apps.length > 0;
}

// Export the initialized admin instance
export const firebaseAdmin = admin;
