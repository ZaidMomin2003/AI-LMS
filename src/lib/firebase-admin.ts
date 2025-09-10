
import admin from 'firebase-admin';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// This function now correctly builds the service account object from individual environment variables.
const getServiceAccount = () => {
  const serviceAccount = {
    projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    // CRITICAL FIX: Replace escaped newlines with actual newlines for the private key.
    privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    // The following are standard for service accounts and can be hardcoded
    type: "service_account",
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL}`
  };

  // Basic validation to ensure all required fields are present
  for (const [key, value] of Object.entries(serviceAccount)) {
    if (!value) {
      throw new Error(`Firebase Admin SDK Error: Missing environment variable for service account key: ${key}`);
    }
  }

  return serviceAccount as admin.ServiceAccount;
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
