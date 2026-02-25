'use server';

import { captureTheAnswer, type CaptureTheAnswerInput, type CaptureTheAnswerOutput } from '@/ai/flows/capture-the-answer-flow';

export async function captureAnswerAction(input: CaptureTheAnswerInput): Promise<CaptureTheAnswerOutput> {
  try {
    const result = await captureTheAnswer(input);
    return result;
  } catch (error) {
    console.error('Error getting answer from AI:', error);
    throw new Error('Failed to get an answer from the AI. Please try again.');
  }
}
