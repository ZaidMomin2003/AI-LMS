'use server';

import { explainText, type ExplainTextInput, type ExplainTextOutput } from '@/ai/flows/explain-text-flow';

export async function explainTextAction(input: ExplainTextInput): Promise<ExplainTextOutput> {
  try {
    const result = await explainText(input);
    return result;
  } catch (error) {
    console.error('Error getting explanation from AI:', error);
    throw new Error('Failed to get an explanation from the AI. Please try again.');
  }
}
