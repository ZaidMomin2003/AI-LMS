'use server';

/**
 * @fileOverview An AI agent that generates study notes based on a given topic.
 *
 * - generateStudyNotes - A function that generates study notes.
 * - GenerateStudyNotesInput - The input type for the generateStudyNotes function.
 * - GenerateStudyNotesOutput - The return type for the generateStudyNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyNotesInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate study notes.'),
});
export type GenerateStudyNotesInput = z.infer<typeof GenerateStudyNotesInputSchema>;

const GenerateStudyNotesOutputSchema = z.object({
  studyNotes: z.string().describe('Generated study notes for the topic, in Markdown format.'),
  keyTerms: z.array(z.object({
    term: z.string().describe('An important or difficult term from the notes.'),
    definition: z.string().describe('A concise definition of the term in the context of the topic.')
  })).describe('A list of key terms and their definitions found in the study notes.')
});
export type GenerateStudyNotesOutput = z.infer<typeof GenerateStudyNotesOutputSchema>;

export async function generateStudyNotes(input: GenerateStudyNotesInput): Promise<GenerateStudyNotesOutput> {
  return generateStudyNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyNotesPrompt',
  input: {schema: GenerateStudyNotesInputSchema},
  output: {schema: GenerateStudyNotesOutputSchema},
  prompt: `You are an AI assistant designed to generate study materials for students.

  Based on the given topic, generate comprehensive study notes. The notes should be well-structured, easy to understand, and in Markdown format.

  Also, identify between 5 and 7 important or complex terms from the notes you've generated. For each term, provide a concise definition relevant to the topic. Ensure the 'term' field is an exact match to a word or phrase in the study notes.

  Topic: {{{topic}}}
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
