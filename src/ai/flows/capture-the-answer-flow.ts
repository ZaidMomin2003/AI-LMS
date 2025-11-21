
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
  solution: z.string().describe("A step-by-step explanation or solution for how the answer was reached, formatted in HTML."),
});
export type CaptureTheAnswerOutput = z.infer<typeof CaptureTheAnswerOutputSchema>;

export async function captureTheAnswer(input: CaptureTheAnswerInput): Promise<CaptureTheAnswerOutput> {
  return captureTheAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'captureTheAnswerPrompt',
  input: {schema: CaptureTheAnswerInputSchema},
  output: {schema: CaptureTheAnswerOutputSchema},
  prompt: `You are an expert tutor AI. Your task is to analyze the provided image, identify the question, and provide a correct answer with a clear, step-by-step solution.

**Output Requirements:**
Your response MUST be a valid JSON object matching the provided schema.

- **question**: A string containing the exact question from the image.
- **answer**: A string with only the final, direct answer.
- **solution**: A string containing a step-by-step explanation formatted in simple HTML.
  - Use \`<h4>\` for step headings (e.g., \`<h4>Step 1: Identify the formula</h4>\`).
  - Use \`<p>\` for explanations.
  - Use \`<strong>\` to highlight key terms or values.
  - **CRITICAL**: All mathematical formulas, variables, and equations MUST be enclosed in KaTeX delimiters (e.g., \`$$P = \\frac{a^3b^2}{c\\sqrt{d}}$$\`). This is non-negotiable.
  - Do NOT be conversational. Provide a direct, structured solution.

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
