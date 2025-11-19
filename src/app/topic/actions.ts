'use server';

import { getAdminDB } from '@/lib/firebase-admin';
import { explainText, type ExplainTextInput, type ExplainTextOutput } from '@/ai/flows/explain-text-flow';
import * as admin from 'firebase-admin';

export async function explainTextAction(input: ExplainTextInput): Promise<ExplainTextOutput> {
  try {
    const result = await explainText(input);
    return result;
  } catch (error) {
    console.error('Error getting explanation from AI:', error);
    throw new Error('Failed to get an explanation from the AI. Please try again.');
  }
}

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

export const getUserDoc = async (uid: string) => {
    const db = getAdminDB();
    if (!uid || !db) return null;
    try {
        const userDocRef = db.collection('users').doc(uid);
        const docSnap = await userDocRef.get();
        if (docSnap.exists) {
            const data = docSnap.data();
            if (data) {
                // Recursively convert Timestamps to ISO strings
                const convertTimestamps = (obj: any): any => {
                    if (obj instanceof admin.firestore.Timestamp) {
                        return obj.toDate().toISOString();
                    }
                    if (Array.isArray(obj)) {
                        return obj.map(convertTimestamps);
                    }
                    if (typeof obj === 'object' && obj !== null) {
                        const newObj: { [key: string]: any } = {};
                        for (const key in obj) {
                            newObj[key] = convertTimestamps(obj[key]);
                        }
                        return newObj;
                    }
                    return obj;
                };
                return convertTimestamps(data);
            }
            return data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user document: ", error);
        return null;
    }
};
