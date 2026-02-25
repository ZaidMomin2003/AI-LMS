'use server';

import { getAdminDB } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

type FeedbackAnswers = Record<string, string>;

export async function saveFeedbackSubmission(answers: FeedbackAnswers): Promise<void> {
  const db = getAdminDB();
  if (!db) {
    console.error('Firebase Admin DB is not configured. Feedback submission cannot be saved.');
    // We can throw an error here to notify the client-side
    throw new Error('Server is not configured to save feedback.');
  }

  try {
    // Add the feedback along with a server timestamp
    await db.collection('feedbackSubmissions').add({
      ...answers,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving feedback submission to Firestore:', error);
    // Propagate the error back to the client
    throw new Error('Could not save your feedback at this time.');
  }
}
