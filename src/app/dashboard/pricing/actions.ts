'use server';

import { getAdminDB } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

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
