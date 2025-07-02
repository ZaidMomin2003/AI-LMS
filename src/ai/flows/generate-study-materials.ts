'use server';

/**
 * @fileOverview An AI agent that generates study materials based on a given topic.
 *
 * - generateStudyMaterials - A function that generates study notes, flashcards, and quiz questions.
 * - GenerateStudyMaterialsInput - The input type for the generateStudyMaterials function.
 * - GenerateStudyMaterialsOutput - The return type for the generateStudyMaterials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyMaterialsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate study materials.'),
});
export type GenerateStudyMaterialsInput = z.infer<typeof GenerateStudyMaterialsInputSchema>;

const GenerateStudyMaterialsOutputSchema = z.object({
  studyNotes: z.string().describe('Generated study notes for the topic.'),
  flashcards: z.string().describe('Generated flashcards for the topic.'),
  quizQuestions: z.string().describe('Generated quiz questions for the topic.'),
});
export type GenerateStudyMaterialsOutput = z.infer<typeof GenerateStudyMaterialsOutputSchema>;

export async function generateStudyMaterials(input: GenerateStudyMaterialsInput): Promise<GenerateStudyMaterialsOutput> {
  return generateStudyMaterialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyMaterialsPrompt',
  input: {schema: GenerateStudyMaterialsInputSchema},
  output: {schema: GenerateStudyMaterialsOutputSchema},
  prompt: `You are an AI assistant designed to generate study materials for students.

  Based on the given topic, generate study notes, flashcards, and quiz questions.

  Topic: {{{topic}}}

  Output the study notes, flashcards, and quiz questions in a JSON format.
  `,
});

const generateStudyMaterialsFlow = ai.defineFlow(
  {
    name: 'generateStudyMaterialsFlow',
    inputSchema: GenerateStudyMaterialsInputSchema,
    outputSchema: GenerateStudyMaterialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
