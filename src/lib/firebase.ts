'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseEnabled = !!firebaseConfig.apiKey;

function initializeFirebase() {
  if (!isFirebaseEnabled) {
     console.log(
      '================================================================================',
      '\nFirebase is not configured. Authentication and database features will be disabled.',
      '\nCreate a file named .env in the project root and add your Firebase config.',
      '\nSee the README for more details.',
      '\n================================================================================'
    );
    return { app: null, auth: null, db: null, googleProvider: null };
  }

  const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth: Auth = getAuth(app);
  const db: Firestore = getFirestore(app);
  const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

  return { app, auth, db, googleProvider };
}

export { initializeFirebase };
export const { app, auth, db, googleProvider } = initializeFirebase();