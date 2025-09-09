
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, type Timestamp } from 'firebase/firestore';

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

    const submissions = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAtTimestamp = data.createdAt as Timestamp;
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        message: data.message,
        createdAt: createdAtTimestamp?.toDate ? createdAtTimestamp.toDate().toISOString() : new Date().toISOString(),
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
