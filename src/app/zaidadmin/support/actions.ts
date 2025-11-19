'use server';

import { getAdminDB } from '@/lib/firebase-admin';

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
  const db = getAdminDB();
  if (!db) {
    console.warn('Firebase Admin DB not configured, returning empty support requests.');
    return [];
  }

  try {
    const requestsRef = db.collection('supportRequests');
    const q = requestsRef.orderBy('createdAt', 'desc');
    const querySnapshot = await q.get();

    const requests = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        queryType: data.queryType,
        message: data.message,
        status: data.status || 'new',
        createdAt: data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
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
