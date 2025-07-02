'use server';

import { generateStudyMaterials } from '@/ai/flows/generate-study-materials';
import type { Topic, Flashcard, QuizQuestion } from '@/types';

export async function createTopicAction(
  title: string
): Promise<Omit<Topic, 'id' | 'createdAt'>> {
  try {
    const rawMaterials = await generateStudyMaterials({ topic: title });

    let flashcards: Flashcard[] = [];
    try {
      // The AI is prompted to return a JSON string.
      flashcards = JSON.parse(rawMaterials.flashcards);
    } catch (e) {
      console.error('Failed to parse flashcards JSON:', e);
      // Fallback or error handling if parsing fails. Could try to parse from a different format.
      // For now, we'll leave it as an empty array.
    }

    let quiz: QuizQuestion[] = [];
    try {
      // The AI is prompted to return a JSON string.
      quiz = JSON.parse(rawMaterials.quizQuestions);
    } catch (e) {
      console.error('Failed to parse quiz JSON:', e);
      // Fallback for quiz parsing.
    }

    return {
      title,
      notes: rawMaterials.studyNotes,
      flashcards,
      quiz,
    };
  } catch (error) {
    console.error('Error generating study materials:', error);
    throw new Error('Failed to generate topic materials. Please try again.');
  }
}
