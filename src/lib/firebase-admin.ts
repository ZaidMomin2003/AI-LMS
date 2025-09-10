import admin from 'firebase-admin';

// This function now handles getting the service account key and parsing it.
const getServiceAccount = () => {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    // Return null instead of throwing an error if the key is not set.
    console.error("Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Server-side features requiring admin privileges (like processing payments or creating sessions) will be disabled.");
    return null;
  }
  try {
    // Replace escaped newlines for environments that require it.
    return JSON.parse(serviceAccountJson.replace(/\\n/g, '\n'));
  } catch (error) {
    console.error("Firebase Admin SDK Error: Could not parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string.", error);
    return null;
  }
};

// Initialize Firebase Admin only if it hasn't been initialized yet and the service account is available.
if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error: any) {
        console.error("Firebase Admin initialization error:", error.message);
    }
  }
}

export const firebaseAdmin = admin;

// Export a simple boolean to check if the admin app is initialized.
// This is more reliable than checking admin.apps.length elsewhere.
export const isFirebaseAdminInitialized = () => {
    // The SDK is only initialized if the service account key was provided and valid.
    return admin.apps.length > 0;
}
