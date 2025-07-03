'use server';
/**
 * @fileOverview An AI agent that functions as a study assistant chatbot.
 *
 * - sageMakerFlow - A function that handles the chat interaction.
 * - SageMakerInput - The input type for the sageMakerFlow function.
 * - SageMakerOutput - The return type for the sageMakerFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SageMakerInputSchema = z.object({
  prompt: z.string().describe('The user\'s question or message.'),
  imageDataUri: z.string().optional().describe(
    "An optional image provided by the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type SageMakerInput = z.infer<typeof SageMakerInputSchema>;

const SageMakerOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s response.'),
});
export type SageMakerOutput = z.infer<typeof SageMakerOutputSchema>;

// This exported function is what the client-side component will call.
export async function sageMakerFlow(input: SageMakerInput): Promise<SageMakerOutput> {
  return sageMakerFlowInternal(input);
}

const prompt = ai.definePrompt({
  name: 'sageMakerPrompt',
  input: {schema: SageMakerInputSchema},
  output: {schema: SageMakerOutputSchema},
  prompt: `You are SageMaker, a friendly, encouraging, and knowledgeable AI study assistant for the ScholarAI platform. Your goal is to help students understand topics by answering their questions. Be clear, concise, and break down complex concepts into simple terms.

  Use the following question from the user to provide a helpful answer. If an image is provided, use it as context for your response.

  Question: {{{prompt}}}
  {{#if imageDataUri}}
  Image context:
  {{media url=imageDataUri}}
  {{/if}}
  `,
});

const sageMakerFlowInternal = ai.defineFlow(
  {
    name: 'sageMakerFlow',
    inputSchema: SageMakerInputSchema,
    outputSchema: SageMakerOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
