
import { getAdminDB } from '@/lib/firebase-admin';
import type { FirestoreError } from 'firebase-admin/firestore';

/**
 * Updates a user's document in the 'users' collection.
 * This function merges the new data with any existing document data.
 * @param uid The user's unique ID.
 * @param data An object containing the data to save.
 */
export const updateUserDoc = async (uid: string, data: object): Promise<boolean> => {
  const db = getAdminDB();
  if (!uid || !db) return false;

  try {
    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.set(data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating user document: ", error);
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
    const db = getAdminDB();
    if (!uid || !db) return null;
    try {
        const userDocRef = db.collection('users').doc(uid);
        const docSnap = await userDocRef.get();
        if (docSnap.exists) {
            // Convert Firestore Timestamp to JS Date if necessary, then to a serializable format.
            const data = docSnap.data();
            if (data) {
                for (const key in data) {
                    if (data[key] instanceof admin.firestore.Timestamp) {
                        data[key] = data[key].toDate().toISOString();
                    }
                }
                 // Specifically handle nested Timestamps, e.g., in topics
                if (data.topics && Array.isArray(data.topics)) {
                    data.topics = data.topics.map((topic: any) => {
                        if (topic.createdAt && topic.createdAt instanceof admin.firestore.Timestamp) {
                            return { ...topic, createdAt: topic.createdAt.toDate().toISOString() };
                        }
                        return topic;
                    });
                }
            }
            return data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user document: ", error);
        return null;
    }
};

// Re-export admin for direct use in other server files if necessary
import admin from 'firebase-admin';
export { admin };
