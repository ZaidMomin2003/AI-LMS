
'use server';

import { generateFlashcards } from '@/ai/flows/generate-flashcards';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import { generateStudyNotes, type GenerateStudyNotesInput } from '@/ai/flows/generate-study-notes';
import type { Topic, ProfileData } from '@/types';


export async function createTopicAction(
  title: string,
  subject: string,
  profile: ProfileData | null
): Promise<Omit<Topic, 'id' | 'createdAt'>> {
  try {
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
