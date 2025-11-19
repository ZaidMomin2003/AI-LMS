'use server';

import { generateRoadmap, type GenerateRoadmapInput, type GenerateRoadmapOutput } from '@/ai/flows/generate-roadmap-flow';
import { getAdminDB } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function createRoadmapAction(input: GenerateRoadmapInput): Promise<GenerateRoadmapOutput> {
  try {
    const roadmap = await generateRoadmap(input);
    return roadmap;
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error('Failed to generate study roadmap. Please try again.');
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
