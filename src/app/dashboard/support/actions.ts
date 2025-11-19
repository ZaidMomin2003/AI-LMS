'use server';

import { getAdminDB } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';


interface SupportRequestData {
  name: string;
  email: string;
  queryType: string;
  message: string;
}

export async function submitSupportRequest(data: SupportRequestData): Promise<void> {
  const db = getAdminDB();
  if (!db) {
    console.error('Firebase Admin DB is not configured. Support request cannot be saved.');
    // Simulate success to avoid breaking user flow if backend is not ready
    return;
  }

  try {
    await db.collection('supportRequests').add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      status: 'new', // Default status
    });
  } catch (error) {
    console.error('Error saving support request to Firestore:', error);
    throw new Error('Could not save your support request.');
  }
}
