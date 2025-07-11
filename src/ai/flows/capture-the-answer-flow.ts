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
  answer: z.string().describe("A simple, easy-to-understand answer to the question."),
});
export type CaptureTheAnswerOutput = z.infer<typeof CaptureTheAnswerOutputSchema>;

// This is now a direct async function, removing the ai.defineFlow wrapper for robustness.
export async function captureTheAnswer(input: CaptureTheAnswerInput): Promise<CaptureTheAnswerOutput> {
  const { imageDataUri } = input;

  const promptParts: Part[] = [
    {
      text: `You are an expert tutor AI. Your task is to analyze the provided image, identify the question written in it, and provide a clear, concise, and easy-to-understand answer.
      
Your response MUST be a valid JSON object with two keys: "question" and "answer".
- "question": A string containing the question you identified from the image.
- "answer": A string containing a simple, direct answer to that question.

Example response format:
{
  "question": "What is the powerhouse of the cell?",
  "answer": "The powerhouse of the cell is the mitochondria."
}

Image with the question is below:`,
    },
    { media: { url: imageDataUri } },
  ];

  const llmResponse = await ai.generate({
    prompt: promptParts,
  });

  const responseText = llmResponse.text.trim();

  try {
    // Attempt to parse the JSON response from the model
    const parsedResponse = JSON.parse(responseText);
    // Validate the parsed response against our Zod schema
    const validatedOutput = CaptureTheAnswerOutputSchema.parse(parsedResponse);
    return validatedOutput;
  } catch (e) {
    console.error("Failed to parse or validate AI response:", e);
    console.error("Raw AI Response:", responseText);
    // If parsing or validation fails, throw an error to be caught by the action
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
}
