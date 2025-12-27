
'use server';

import { generateFlashcards } from '@/ai/flows/generate-flashcards';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import { generateStudyNotes, type GenerateStudyNotesInput } from '@/ai/flows/generate-study-notes';
import type { Topic } from '@/types';

// This is a server-only file. We can safely import and use server-side modules.
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { getAdminDB } from '@/lib/firebase-admin';

async function getUserProfile() {
  const sessionCookie = cookies().get('__session')?.value || '';
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth().verifySessionCookie(sessionCookie, true);
    const db = getAdminDB();
    if (!db) return null;

    const userDoc = await db.collection('users').doc(decodedClaims.uid).get();
    if (userDoc.exists) {
      return userDoc.data()?.profile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile on server:", error);
    return null;
  }
}

export async function createTopicAction(
  title: string,
  subject: string
): Promise<Omit<Topic, 'id' | 'createdAt'>> {
  try {
    const profile = await getUserProfile();

    const studyNotesInput: GenerateStudyNotesInput = {
      topic: title,
      userName: profile?.aiName || 'there', // fallback name
      userGoal: profile?.goal,
      contentStyle: profile?.contentStyle,
      userSuperpower: profile?.superpower,
      userWeakness: profile?.achillesHeel,
      educationLevel: profile?.educationLevel,
    };
    
    // Generate all materials in parallel
    const [notesResult, flashcardsResult, quizResult] = await Promise.all([
      generateStudyNotes(studyNotesInput),
      generateFlashcards({ topic: title }),
      generateQuizQuestions({ topic: title }),
    ]);

    return {
      title,
      subject,
      notes: notesResult,
      flashcards: flashcardsResult.flashcards,
      quiz: quizResult.questions,
    };
  } catch (error) {
    console.error('Error generating study materials:', error);
    throw new Error('Failed to generate topic materials. Please try again.');
  }
}
