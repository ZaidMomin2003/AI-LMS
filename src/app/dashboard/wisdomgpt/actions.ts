'use server';

import { wisdomGptFlow, type WisdomGptInput, type WisdomGptOutput } from '@/ai/flows/wisdom-gpt-flow';

export async function wisdomGptAction(input: WisdomGptInput): Promise<WisdomGptOutput> {
  try {
    // Directly return the raw HTML response from the flow
    return await wisdomGptFlow(input);
  } catch (error) {
    console.error('Error in WisdomGPT action:', error);
    // In case of an error, return a structured HTML error message
    return {
      response: `<h4>Error</h4><p>Sorry, I failed to get a response from the AI. Please try again.</p><p>Details: ${(error as Error).message}</p>`
    };
  }
}
