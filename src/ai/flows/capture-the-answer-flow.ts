'use server';

/**
 * @fileOverview An AI agent that analyzes an image of a question and provides an answer.
 *
 * - captureTheAnswer - A function that handles the question answering process from an image.
 * - CaptureTheAnswerInput - The input type for the captureTheAnswer function.
 * - CaptureTheAnswerOutput - The return type for the captureTheAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CaptureTheAnswerInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CaptureTheAnswerInput = z.infer<typeof CaptureTheAnswerInputSchema>;

const CaptureTheAnswerOutputSchema = z.object({
  question: z.string().describe('The question identified from the image.'),
  answer: z.string().describe("A simple, easy-to-understand answer to the question."),
});
export type CaptureTheAnswerOutput = z.infer<typeof CaptureTheAnswerOutputSchema>;

export async function captureTheAnswer(input: CaptureTheAnswerInput): Promise<CaptureTheAnswerOutput> {
  return captureTheAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'captureTheAnswerPrompt',
  input: {schema: CaptureTheAnswerInputSchema},
  output: {schema: CaptureTheAnswerOutputSchema},
  prompt: `You are an expert tutor AI. Your task is to analyze the provided image, identify the question written in it, and provide a clear, concise, and easy-to-understand answer.

  1.  First, carefully read the image and determine the main question being asked. Put this in the 'question' field.
  2.  Then, formulate a simple and direct answer to that question. Put this in the 'answer' field.
  3.  The answer should be simple enough for a student to understand quickly. Avoid jargon where possible.

  Image with the question is below:
  {{media url=imageDataUri}}
  `,
});

const captureTheAnswerFlow = ai.defineFlow(
  {
    name: 'captureTheAnswerFlow',
    inputSchema: CaptureTheAnswerInputSchema,
    outputSchema: CaptureTheAnswerOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
