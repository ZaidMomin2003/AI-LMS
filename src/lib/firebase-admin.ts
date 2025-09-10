import admin from 'firebase-admin';

const getServiceAccount = () => {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    throw new Error('Firebase Admin SDK Error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }
  try {
    return JSON.parse(serviceAccountJson.replace(/\\n/g, '\n'));
  } catch (error) {
    throw new Error("Firebase Admin SDK Error: Could not parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string.");
  }
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(getServiceAccount()),
    });
  } catch (error: any) {
      console.error("Firebase Admin initialization error:", error.message);
      // We don't re-throw here to allow the app to potentially run in a degraded state
      // where client-side Firebase is available but admin features are not.
  }
}

export const firebaseAdmin = admin;

export function isFirebaseAdminInitialized(): boolean {
    return admin.apps.length > 0;
}
