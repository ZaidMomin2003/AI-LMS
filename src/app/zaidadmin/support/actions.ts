
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, type Timestamp } from 'firebase/firestore';

export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  queryType: string;
  message: string;
  createdAt: string; // Serialized date
  status: string;
}

export async function fetchSupportRequests(): Promise<SupportRequest[]> {
  if (!isFirebaseEnabled || !db) {
    console.warn('Firebase not configured, returning empty support requests.');
    return [];
  }

  try {
    const requestsRef = collection(db, 'supportRequests');
    const q = query(requestsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const requests = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAtTimestamp = data.createdAt as Timestamp;
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        queryType: data.queryType,
        message: data.message,
        status: data.status || 'new',
        createdAt: createdAtTimestamp?.toDate ? createdAtTimestamp.toDate().toISOString() : new Date().toISOString(),
      };
    });
    
    return requests;
  } catch (error: any) {
    console.error('Error fetching support requests:', error);
    if (error.code === 'failed-precondition') {
        console.error("Firestore Error: This query requires an index. Please check the console logs for a link to create it automatically.");
    }
    return [];
  }
}
