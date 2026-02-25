'use server';

import { generateCustomQuiz, type GenerateCustomQuizInput, type GenerateCustomQuizOutput } from '@/ai/flows/generate-custom-quiz';

export async function createQuizAction(input: GenerateCustomQuizInput): Promise<GenerateCustomQuizOutput> {
  try {
    const result = await generateCustomQuiz(input);
    return result;
  } catch (error) {
    console.error('Error generating custom quiz:', error);
    throw new Error('Failed to generate quiz. Please check the AI configuration and try again.');
  }
}
