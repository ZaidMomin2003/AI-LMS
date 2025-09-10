
import admin from 'firebase-admin';
import 'dotenv/config';

// Function to parse the service account key from environment variable
const getServiceAccount = () => {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    // This error will be caught by the initAdmin logic, but it's good practice
    // to have a clear point of failure.
    return null;
  }
  try {
    return JSON.parse(serviceAccountJson);
  } catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", error);
    return null;
  }
};

// Initialize Firebase Admin SDK
// This pattern ensures that it's initialized only once.
if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    console.error('Could not initialize Firebase Admin SDK: Service Account Key is missing or invalid in environment variables.');
  }
}

// A simple function to check if the admin app is initialized.
// This allows other parts of the app to fail gracefully if the setup is incorrect.
function isAdminInitialized() {
    return admin.apps.length > 0;
}

// Deprecated initAdmin, we now initialize on module load.
// Kept for compatibility if other files still call it, but it does nothing.
export async function initAdmin() {
  if (isAdminInitialized()) {
    return;
  }
  // This function is now essentially a no-op that warns if initialization failed.
  console.warn("Firebase Admin SDK was not initialized. Please check your environment variables.");
}

// Export the initialized admin instance
export const firebaseAdmin = admin;
export const isFirebaseAdminInitialized = isAdminInitialized();
