'use server';

/**
 * @fileOverview An AI agent that generates detailed, structured study notes on a given topic.
 *
 * - generateStudyNotes - A function that generates a structured set of study materials.
 * - GenerateStudyNotesInput - The input type for the generateStudyNotes function.
 * - GenerateStudyNotesOutput - The return type for the generateStudyNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyNotesInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate study notes.'),
});
export type GenerateStudyNotesInput = z.infer<typeof GenerateStudyNotesInputSchema>;

// The output is now a simple string
const GenerateStudyNotesOutputSchema = z.string().describe("A comprehensive set of study notes in Markdown format.");
export type GenerateStudyNotesOutput = z.infer<typeof GenerateStudyNotesOutputSchema>;

export async function generateStudyNotes(input: GenerateStudyNotesInput): Promise<GenerateStudyNotesOutput> {
  return generateStudyNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyNotesPrompt',
  input: {schema: GenerateStudyNotesInputSchema},
  prompt: `You are an expert educator AI that creates high-quality, detailed, and structured study materials for any topic.

  Your task is to generate a comprehensive set of study notes for the topic: **{{{topic}}}**.

  The output MUST be a single, well-formatted Markdown string.

  **Instructions for the notes:**
  - Start with an introduction.
  - Provide a detailed explanation of the core concepts. Use Markdown for formatting (headings, lists, bold text).
  - Include 2-3 clear, practical examples.
  - If applicable, list key formulas and their explanations.
  - Identify and define 5-7 of the most important key terms.
  `,
});

const generateStudyNotesFlow = ai.defineFlow(
  {
    name: 'generateStudyNotesFlow',
    inputSchema: GenerateStudyNotesInputSchema,
    outputSchema: GenerateStudyNotesOutputSchema,
  },
  async input => {
    const llmResponse = await ai.generate({ prompt: prompt.compile({ input }) });
    return llmResponse.text;
  }
);
