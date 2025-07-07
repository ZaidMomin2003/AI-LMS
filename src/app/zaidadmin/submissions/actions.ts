'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

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
    // We removed the orderBy clause to avoid needing a custom index.
    const q = query(submissionsRef);
    const querySnapshot = await getDocs(q);

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
    
    // Sort the results in memory on the server.
    submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return submissions;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}
