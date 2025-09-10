import admin from 'firebase-admin';

// This function now handles getting the service account key and parsing it.
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
    throw new Error("Firebase Admin SDK Error: Could not parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string.");
  }
};

// Initialize Firebase Admin only if it hasn't been initialized yet.
// This is the single source of truth for the admin app instance.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(getServiceAccount()),
    });
  } catch (error: any) {
      console.error("Firebase Admin initialization error:", error.message);
      // We are not re-throwing here, but the check below will handle it.
  }
}

export const firebaseAdmin = admin;

// Export a simple boolean to check if the admin app is initialized.
// This is more reliable than checking admin.apps.length elsewhere.
export const isFirebaseAdminInitialized = () => admin.apps.length > 0;
