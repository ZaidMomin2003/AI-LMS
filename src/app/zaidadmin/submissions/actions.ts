'use server';

import { getAdminDB } from '@/lib/firebase-admin';

export interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string; // Serialized date
}

export async function fetchSubmissions(): Promise<Submission[]> {
  const db = getAdminDB();
  if (!db) {
    console.warn('Firebase Admin DB not configured, returning empty submissions.');
    return [];
  }

  try {
    const submissionsRef = db.collection('submissions');
    const q = submissionsRef.orderBy('createdAt', 'desc');
    const querySnapshot = await q.get();

    const submissions = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        message: data.message,
        // Firestore Timestamps need to be converted to a serializable format (ISO string)
        createdAt: data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
      };
    });
    
    return submissions;
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    if (error.code === 'failed-precondition') {
        console.error("Firestore Error: This query requires an index. Please check the console logs in your browser or Firebase Functions for a link to create it automatically.");
    }
    return [];
  }
}
