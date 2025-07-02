'use server';

import { generateStudyNotes } from '@/ai/flows/generate-study-notes';
import { generateFlashcards } from '@/ai/flows/generate-flashcards';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import type { Topic, Flashcard, QuizQuestion } from '@/types';

export async function createTopicAction(
  title: string
): Promise<Omit<Topic, 'id' | 'createdAt'>> {
  try {
    // Generate all materials in parallel
    const [notesResult, flashcardsResult, quizResult] = await Promise.all([
      generateStudyNotes({ topic: title }),
      generateFlashcards({ topic: title }),
      generateQuizQuestions({ topic: title }),
    ]);

    return {
      title,
      notes: notesResult.studyNotes,
      flashcards: flashcardsResult.flashcards,
      quiz: quizResult.questions,
    };
  } catch (error) {
    console.error('Error generating study materials:', error);
    throw new Error('Failed to generate topic materials. Please try again.');
  }
}
