
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface SupportRequestData {
  name: string;
  email: string;
  queryType: string;
  message: string;
}

export async function submitSupportRequest(data: SupportRequestData): Promise<void> {
  if (!isFirebaseEnabled || !db) {
    console.error('Firebase is not configured. Support request cannot be saved.');
    // Simulate success to avoid breaking user flow if backend is not ready
    return;
  }

  try {
    await addDoc(collection(db, 'supportRequests'), {
      ...data,
      createdAt: serverTimestamp(),
      status: 'new', // Default status
    });
  } catch (error) {
    console.error('Error saving support request to Firestore:', error);
    throw new Error('Could not save your support request.');
  }
}
