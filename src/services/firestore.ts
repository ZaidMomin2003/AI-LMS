

import { doc, getDoc, setDoc, type FirestoreError } from 'firebase/firestore';
import { initializeFirebase } from '@/lib/firebase';

/**
 * Updates a user's document in the 'users' collection.
 * This function merges the new data with any existing document data.
 * @param uid The user's unique ID.
 * @param data An object containing the data to save.
 */
export const updateUserDoc = async (uid: string, data: object): Promise<boolean> => {
  const { db } = initializeFirebase();
  if (!uid || !db) return false;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating user document: ", error);
    // Log helpful message for common setup issue.
    const firestoreError = error as FirestoreError;
    if (firestoreError.code === 'failed-precondition') {
        console.error("Firestore Error: The database has not been created or enabled in your Firebase project. Please go to your Firebase project console -> Firestore Database -> Create database.");
    }
    return false;
  }
};

/**
 * Retrieves a user's document from the 'users' collection.
 * Instead of throwing an error and crashing the app, it now returns null on failure.
 * @param uid The user's unique ID.
 * @returns The user's document data, or null if it doesn't exist or an error occurs.
 */
export const getUserDoc = async (uid: string) => {
  const { db } = initializeFirebase();
  if (!uid || !db) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching user document: ", error);
    const firestoreError = error as FirestoreError;
    // This specific error code often means Firestore database has not been created/enabled.
    if (firestoreError.code === 'failed-precondition') {
        console.error("Could not fetch data. It's likely Firestore is not enabled in your Firebase project console. Please go to your Firebase project, find 'Firestore Database' in the build menu, and click 'Create database'.");
    }
    // Return null to allow the app to continue running instead of crashing.
    return null;
  }
};
