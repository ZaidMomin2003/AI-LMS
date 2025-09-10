
import admin from 'firebase-admin';

// Function to parse the service account key from environment variable
const getServiceAccount = () => {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    // Throw a clear error if the key is not set. This prevents downstream issues.
    throw new Error('Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }
  try {
    // Replace escaped newlines for environments that require it.
    return JSON.parse(serviceAccountJson.replace(/\\n/g, '\n'));
  } catch (error) {
    // Throw a clear error for parsing issues.
    throw new Error("Firebase Admin SDK Error: Could not parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string.");
  }
};

let firebaseAdmin: admin.app.App;

// Initialize Firebase Admin SDK only if it hasn't been already.
if (!admin.apps.length) {
  const serviceAccount = getServiceAccount(); // This will throw if it fails.
  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  firebaseAdmin = admin.app();
}

/**
 * A simple function to check if the admin app is initialized.
 * This allows other parts of the app to fail gracefully if the setup is incorrect.
 * @returns {boolean} True if the Firebase Admin app is initialized, false otherwise.
 */
export function isFirebaseAdminInitialized(): boolean {
    return admin.apps.length > 0;
}

// Export the initialized admin instance.
// Note: Direct usage is preferred over the function check now.
export { firebaseAdmin };
