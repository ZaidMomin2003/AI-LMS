import { doc, getDoc, setDoc, type FirestoreError } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from 'firebase/auth';

/**
 * Updates a user's document in the 'users' collection.
 * This function merges the new data with any existing document data.
 * @param uid The user's unique ID.
 * @param data An object containing the data to save.
 */
export const updateUserDoc = async (uid: string, data: object) => {
  if (!uid || !db) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    console.error("Error updating user document: ", error);
    const firestoreError = error as FirestoreError;
    if (firestoreError.code === 'failed-precondition') {
        throw new Error("Firestore might not be enabled. Please check your Firebase project console.");
    }
    throw new Error("Could not save user data.");
  }
};

/**
 * Retrieves a user's document from the 'users' collection.
 * @param uid The user's unique ID.
 * @returns The user's document data, or null if it doesn't exist.
 */
export const getUserDoc = async (uid: string) => {
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
        throw new Error("Could not fetch data. It's likely Firestore is not enabled in your Firebase project console. Please go to your Firebase project, find 'Firestore Database' in the build menu, and click 'Create database'.");
    }
    throw new Error("Could not fetch user data.");
  }
};
