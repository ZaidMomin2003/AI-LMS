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

const GenerateStudyNotesOutputSchema = z.object({
  introduction: z.string().describe("A brief, engaging introduction to the topic in Markdown format."),
  detailedExplanation: z.string().describe("A comprehensive, in-depth explanation of the topic in Markdown format. This should cover the core concepts thoroughly."),
  examples: z.array(z.object({
    title: z.string().describe("A clear, descriptive title for the example."),
    explanation: z.string().describe("The example explained in detail, in Markdown format.")
  })).describe("A list of 2-3 practical and clear examples related to the topic."),
  formulas: z.array(z.object({
    name: z.string().describe("The name of the formula."),
    formula: z.string().describe("The formula, written clearly (e.g., 'E = mc^2')."),
    description: z.string().describe("A brief explanation of the formula and its components.")
  })).optional().describe("A list of key formulas, if applicable to the topic."),
  mnemonics: z.array(z.object({
    concept: z.string().describe("The concept the mnemonic helps remember."),
    mnemonic: z.string().describe("The mnemonic itself (e.g., 'King Phillip Came Over For Good Soup')."),
    explanation: z.string().describe("A brief explanation of how the mnemonic works.")
  })).optional().describe("A list of 1-2 helpful mnemonics to aid memory, if applicable."),
  keyTerms: z.array(z.object({
    term: z.string().describe('An important or difficult term from the notes.'),
    definition: z.string().describe('A concise definition of the term in the context of the topic.')
  })).describe('A list of 5-7 key terms and their definitions found in the study notes.')
});
export type GenerateStudyNotesOutput = z.infer<typeof GenerateStudyNotesOutputSchema>;

export async function generateStudyNotes(input: GenerateStudyNotesInput): Promise<GenerateStudyNotesOutput> {
  return generateStudyNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyNotesPrompt',
  input: {schema: GenerateStudyNotesInputSchema},
  output: {schema: GenerateStudyNotesOutputSchema},
  prompt: `You are an expert educator AI that creates high-quality, detailed, and structured study materials for any topic.

  Your task is to generate a comprehensive set of study materials for the topic: **{{{topic}}}**.

  The output MUST be a valid JSON object that adheres to the provided schema.

  **Instructions for each field:**
  - **introduction**: Write a brief, engaging paragraph to introduce the topic.
  - **detailedExplanation**: Provide a thorough, in-depth explanation of the core concepts. Use Markdown for formatting (headings, lists, bold text).
  - **examples**: Create 2-3 clear, practical examples that illustrate the topic. Each example needs a title and a detailed explanation.
  - **formulas**: If the topic involves mathematical or scientific formulas, provide the key ones. For each, include its name, the formula itself, and a description of its components. If not applicable, provide an empty array.
  - **mnemonics**: If appropriate, create 1-2 memorable mnemonics to help the user remember key information. If not applicable, provide an empty array.
  - **keyTerms**: Identify 5-7 of the most important or complex terms from the materials you've generated. For each term, provide a concise definition. Ensure the 'term' field is an exact match to a word or phrase in the generated content.
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