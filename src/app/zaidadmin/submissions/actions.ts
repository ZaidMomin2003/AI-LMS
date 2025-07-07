'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string; // Serialized date
}

export async function fetchSubmissions(): Promise<Submission[]> {
  if (!isFirebaseEnabled || !db) {
    console.warn('Firebase not configured, returning empty submissions.');
    return [];
  }

  try {
    const submissionsRef = collection(db, 'submissions');
    const q = query(submissionsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
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
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}
