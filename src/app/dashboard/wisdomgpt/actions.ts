'use server';

import { wisdomGptFlow, type WisdomGptInput, type WisdomGptOutput } from '@/ai/flows/wisdom-gpt-flow';

export async function wisdomGptAction(input: WisdomGptInput): Promise<WisdomGptOutput> {
  try {
    return await wisdomGptFlow(input);
  } catch (error) {
    console.error('Error in WisdomGPT action:', error);
    throw new Error('Failed to get a response from the AI.');
  }
}
