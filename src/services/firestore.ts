
'use client';

import { doc, getDoc, setDoc, onSnapshot, type DocumentData, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import type { Topic } from '@/types';

/**
 * Fetches a user's document from Firestore.
 * @param uid The user's unique ID.
 * @returns A promise that resolves to the user's document data or null if not found.
 */
export const getUserDoc = async (uid: string) => {
  if (!db) return null;
  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);
  return docSnap.exists() ? docSnap.data() : null;
};

/**
 * Updates a user's document in Firestore.
 * @param uid The user's unique ID.
 * @param data The data to merge into the user's document.
 * @returns A promise that resolves when the update is complete.
 */
export const updateUserDoc = async (uid: string, data: object) => {
  if (!db) return;
  const userDocRef = doc(db, 'users', uid);
  await setDoc(userDocRef, data, { merge: true });
};

/**
 * Creates a shareable topic document in a public collection.
 * @param topicData The topic data to share.
 * @returns The ID of the newly created shareable document.
 */
export const createShareableTopic = async (topicData: Omit<Topic, 'id'>) => {
    if (!db) throw new Error("Firestore is not initialized.");
    const shareableCollectionRef = collection(db, 'sharedTopics');
    const docRef = await addDoc(shareableCollectionRef, topicData);
    return docRef.id;
};

/**
 * Fetches a shareable topic from the public collection.
 * @param shareId The ID of the shareable document.
 * @returns The topic data or null if not found.
 */
export const getShareableTopic = async (shareId: string): Promise<(Omit<Topic, 'id'> & { ownerId: string }) | null> => {
    if (!db) return null;
    const shareDocRef = doc(db, 'sharedTopics', shareId);
    const docSnap = await getDoc(shareDocRef);
    if (docSnap.exists()) {
        return docSnap.data() as (Omit<Topic, 'id'> & { ownerId: string });
    }
    return null;
}

/**
 * Sets up a real-time listener for a user's document.
 * @param user The Firebase user object.
 * @param callback A function to be called with the user's data whenever it changes.
 * @returns An unsubscribe function to stop listening for changes.
 */
export const listenToUserDoc = (user: User, callback: (data: DocumentData | null) => void) => {
    if (!db) {
        callback(null);
        return () => {}; // Return a no-op unsubscribe function
    }

    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data());
        } else {
            // Document does not exist, create it with a default structure
            const initialData = {
                exam: null,
                pomodoroHistory: [],
                profile: null,
                roadmap: null,
                subjects: [],
                tasks: [],
                topics: [],
                subscription: null,
            };
            setDoc(userDocRef, initialData);
            callback(initialData);
        }
    }, (error) => {
        console.error("Error listening to user document:", error);
        callback(null);
    });

    return unsubscribe;
};
