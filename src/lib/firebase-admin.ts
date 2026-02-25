
import * as admin from 'firebase-admin';

// This function ensures the Firebase Admin SDK is initialized only once.
const initAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  // Check if all required environment variables are set
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.error("Firebase Admin SDK environment variables are not fully set.");
    return null;
  }
  
  try {
    const cert = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    return admin.initializeApp({
        credential: admin.credential.cert(cert),
    });
  } catch (error: any) {
      console.error("Error initializing Firebase Admin SDK:", error);
      if (error.code === 'app/duplicate-app') {
        return admin.app();
      }
      return null;
  }
};

function getAdminDB() {
    const app = initAdminApp();
    if (!app) {
        // Return a dummy object or handle the error as appropriate for your app
        // This prevents the app from crashing if Firebase Admin fails to initialize
        return null;
    }
    return admin.firestore();
}

export { getAdminDB };
