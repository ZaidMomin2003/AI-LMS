'use server';

import { getAdminDB } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

interface SubmissionData {
  name: string;
  email: string;
  message: string;
}

export async function saveContactSubmission(data: SubmissionData): Promise<void> {
  const db = getAdminDB();
  if (!db) {
    console.error('Firebase Admin DB is not configured. Submission cannot be saved.');
    // To avoid breaking user flow if backend is not ready, we can simulate success.
    // In a production app, you might want a more robust fallback.
    return;
  }

  try {
    await db.collection('submissions').add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving contact submission to Firestore:', error);
    throw new Error('Could not save submission.');
  }
}
