'use server';

import { sageMakerFlow, SageMakerInput, SageMakerOutput } from '@/ai/flows/sage-maker-flow';

export async function sageMakerAction(input: SageMakerInput): Promise<SageMakerOutput> {
  try {
    return await sageMakerFlow(input);
  } catch (error) {
    console.error('Error in SageMaker action:', error);
    throw new Error('Failed to get a response from the AI.');
  }
}
