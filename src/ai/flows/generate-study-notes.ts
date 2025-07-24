
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
import type {StudyNotes} from '@/types';

const GenerateStudyNotesInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate study notes.'),
});
export type GenerateStudyNotesInput = z.infer<typeof GenerateStudyNotesInputSchema>;

const GenerateStudyNotesOutputSchema = z.object({
  introduction: z.string().describe('A brief introduction to the topic.'),
  coreConcepts: z.string().describe("A detailed explanation of the topic's core concepts in Markdown format."),
  examples: z.string().describe('2-3 practical examples in Markdown format.'),
  keyFormulas: z.string().describe("Key formulas and their explanations in Markdown format. If not applicable, state 'None'."),
  keyTerms: z.string().describe("Definitions for 5-7 of the most important key terms in Markdown format."),
});

export async function generateStudyNotes(input: GenerateStudyNotesInput): Promise<StudyNotes> {
  return generateStudyNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyNotesPrompt',
  input: {schema: GenerateStudyNotesInputSchema},
  output: {schema: GenerateStudyNotesOutputSchema},
  prompt: `You are an expert educator AI that creates high-quality, detailed, and structured study materials for any topic.

  Your task is to generate a comprehensive set of study notes for the topic: **{{{topic}}}**.

  The output MUST be a valid JSON object matching the requested schema.

  **Instructions for the notes:**
  - **introduction**: Start with a concise introduction.
  - **coreConcepts**: Provide a detailed explanation of the core concepts. Use Markdown for formatting (headings, lists, bold text).
  - **examples**: Include 2-3 clear, practical examples. Use Markdown.
  - **keyFormulas**: If applicable, list key formulas and their explanations. Use Markdown. If there are no formulas, the value should be 'None'.
  - **keyTerms**: Identify and define 5-7 of the most important key terms. Use Markdown.
  `,
});

const generateStudyNotesFlow = ai.defineFlow(
  {
    name: 'generateStudyNotesFlow',
    inputSchema: GenerateStudyNotesInputSchema,
    outputSchema: GenerateStudyNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
