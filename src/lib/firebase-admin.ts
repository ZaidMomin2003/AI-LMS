
import admin from 'firebase-admin';
import 'dotenv/config';

// Function to parse the service account key from environment variable
const getServiceAccount = () => {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    return null;
  }
  try {
    // This replaces escaped newlines (a common issue when parsing from env vars)
    // with actual newlines before parsing.
    const sanitizedJson = serviceAccountJson.replace(/\\n/g, '\n');
    return JSON.parse(sanitizedJson);
  } catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", error);
    return null;
  }
};

// Initialize Firebase Admin SDK only if it hasn't been already.
// This is a singleton pattern to prevent re-initialization.
if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
       console.error('Firebase Admin SDK initialization error:', error);
    }
  } else {
    console.error('Could not initialize Firebase Admin SDK: Service Account Key is missing or invalid in environment variables.');
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
