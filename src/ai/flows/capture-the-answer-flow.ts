
'use server';

/**
 * @fileOverview An AI agent that analyzes an image of a question and provides an answer with a solution.
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
  answer: z.string().describe("A simple, direct answer to the question."),
  solution: z.string().describe("A step-by-step explanation or solution for how the answer was reached, formatted in Markdown."),
});
export type CaptureTheAnswerOutput = z.infer<typeof CaptureTheAnswerOutputSchema>;

export async function captureTheAnswer(input: CaptureTheAnswerInput): Promise<CaptureTheAnswerOutput> {
  return captureTheAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'captureTheAnswerPrompt',
  input: {schema: CaptureTheAnswerInputSchema},
  output: {schema: CaptureTheAnswerOutputSchema},
  prompt: `You are an expert tutor AI with deep knowledge across all subjects. Your task is to analyze the provided image, accurately identify the question written in it, and provide a correct, clear, and concise answer along with a step-by-step solution.

Your response MUST be a valid JSON object matching the provided schema.

- "question": A string containing the exact question you identified from the image.
- "answer": A string containing the correct and direct answer to that question.
- "solution": A string containing a step-by-step explanation of how to arrive at the correct answer. **This solution must be formatted in Markdown**, using lists, bold text for emphasis, or code blocks where appropriate to make it as clear as possible.

Image with the question is below:
{{media url=imageDataUri}}`,
});


const captureTheAnswerFlow = ai.defineFlow(
  {
    name: 'captureTheAnswerFlow',
    inputSchema: CaptureTheAnswerInputSchema,
    outputSchema: CaptureTheAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI returned an invalid response format. Please try again.");
    }
    return output;
  }
);
