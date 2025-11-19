
'use server';

import { initializeFirebase, isFirebaseEnabled } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface SubmissionData {
  name: string;
  email: string;
  message: string;
}

export async function saveContactSubmission(data: SubmissionData): Promise<void> {
  const { db } = initializeFirebase();
  if (!isFirebaseEnabled || !db) {
    console.error('Firebase is not configured. Submission cannot be saved.');
    // In a real app, you might want to send this to a different logging service
    // or fallback to a different contact method.
    // For this demo, we'll simulate a success to avoid breaking the user flow.
    return;
  }

  try {
    await addDoc(collection(db, 'submissions'), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving contact submission to Firestore:', error);
    throw new Error('Could not save submission.');
  }
}
