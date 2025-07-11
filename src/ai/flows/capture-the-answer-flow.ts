
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
import type {Part} from 'genkit/generate';

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
  solution: z.string().describe("A step-by-step explanation or solution for how the answer was reached."),
});
export type CaptureTheAnswerOutput = z.infer<typeof CaptureTheAnswerOutputSchema>;

export async function captureTheAnswer(input: CaptureTheAnswerInput): Promise<CaptureTheAnswerOutput> {
  const { imageDataUri } = input;

  const promptParts: Part[] = [
    {
      text: `You are an expert tutor AI with deep knowledge across all subjects. Your task is to analyze the provided image, accurately identify the question written in it, and provide a correct, clear, and concise answer along with a step-by-step solution.

Your response MUST be a valid JSON object with three keys: "question", "answer", and "solution". The JSON should not be inside a markdown block.

- "question": A string containing the exact question you identified from the image.
- "answer": A string containing the correct and direct answer to that question.
- "solution": A string containing a simple, step-by-step explanation of how to arrive at the correct answer.

Example response format:
{
  "question": "What is 25% of 200?",
  "answer": "50",
  "solution": "To find 25% of 200, you can convert the percentage to a decimal by dividing by 100 (25 / 100 = 0.25). Then, multiply the decimal by the number (0.25 * 200 = 50)."
}

Image with the question is below:`,
    },
    { media: { url: imageDataUri } },
  ];

  const llmResponse = await ai.generate({
    prompt: promptParts,
  });

  let responseText = llmResponse.text.trim();

  // The model sometimes wraps the JSON in markdown backticks. Let's remove them.
  if (responseText.startsWith('```json')) {
    responseText = responseText.substring(7, responseText.length - 3).trim();
  }

  try {
    const parsedResponse = JSON.parse(responseText);
    const validatedOutput = CaptureTheAnswerOutputSchema.parse(parsedResponse);
    return validatedOutput;
  } catch (e) {
    console.error("Failed to parse or validate AI response:", e);
    console.error("Raw AI Response:", responseText);
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
}
