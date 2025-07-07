import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { User } from 'firebase/auth';

if (!app) {
    throw new Error("Firebase has not been initialized. Please check your configuration.");
}
const db = getFirestore(app);

/**
 * Updates a user's document in the 'users' collection.
 * This function merges the new data with any existing document data.
 * @param uid The user's unique ID.
 * @param data An object containing the data to save.
 */
export const updateUserDoc = async (uid: string, data: object) => {
  if (!uid) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    console.error("Error updating user document: ", error);
    throw new Error("Could not save user data.");
  }
};

/**
 * Retrieves a user's document from the 'users' collection.
 * @param uid The user's unique ID.
 * @returns The user's document data, or null if it doesn't exist.
 */
export const getUserDoc = async (uid: string) => {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching user document: ", error);
    throw new Error("Could not fetch user data.");
  }
};
