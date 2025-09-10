
import admin from 'firebase-admin';

// This function now correctly builds the service account object from individual environment variables.
// This is a more robust method than parsing a single JSON string.
const getServiceAccount = () => {
  const privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY environment variable is not set.');
  }

  const serviceAccount: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
    privateKey: privateKey.replace(/\\n/g, '\n'), // Ensure newlines are correctly formatted.
    clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  };

  // Basic validation to ensure all required fields are present.
  if (!serviceAccount.projectId || !serviceAccount.clientEmail) {
      throw new Error('Firebase Admin SDK Error: Missing projectId or clientEmail in service account configuration.');
  }

  return serviceAccount;
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
