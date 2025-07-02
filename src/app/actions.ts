'use server';

import type { Topic, Flashcard, QuizQuestion } from '@/types';

export async function createTopicAction(
  title: string
): Promise<Omit<Topic, 'id' | 'createdAt'>> {
  try {
    // This is mock data for testing without a Gemini API key.
    const mockNotes = `# Mock Study Notes for ${title}

This is some mock content for your study notes. To see real, AI-generated content, you will need to provide a Gemini API key.

## Key Point 1
- Detail A
- Detail B

## Key Point 2
- Detail C
- Detail D
    `;

    const mockFlashcards: Flashcard[] = [
      { term: 'Mock Term 1', definition: 'This is the definition for the first mock term.' },
      { term: 'Mock Term 2', definition: 'This is the definition for the second mock term.' },
      { term: 'Mock Term 3', definition: 'This is the definition for the third mock term.' },
    ];

    const mockQuiz: QuizQuestion[] = [
      {
        question: 'What is this?',
        options: ['A real quiz', 'A mock quiz', 'A trick question', 'All of the above'],
        answer: 'A mock quiz',
      },
      {
        question: 'When will the real quiz appear?',
        options: ['Now', 'Never', 'When an API key is added', 'Yesterday'],
        answer: 'When an API key is added',
      },
    ];
    
    // Simulate network delay for a realistic loading experience
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      title,
      notes: mockNotes,
      flashcards: mockFlashcards,
      quiz: mockQuiz,
    };
  } catch (error) {
    console.error('Error generating study materials:', error);
    throw new Error('Failed to generate topic materials. Please try again.');
  }
}
