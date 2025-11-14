
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
  introduction: z.string().describe('A brief introduction to the topic, formatted as HTML.'),
  coreConcepts: z.string().describe("A detailed explanation of the topic's core concepts, formatted as HTML with headings, lists, and bold tags."),
  examples: z.string().describe("2-3 practical examples, formatted as HTML."),
  keyFormulas: z.string().describe("Key formulas and their explanations, formatted as HTML. If not applicable, state 'None'."),
  keyTerms: z.string().describe("A list of the most important key terms and their definitions, formatted as an HTML unordered list."),
});

export async function generateStudyNotes(input: GenerateStudyNotesInput): Promise<StudyNotes> {
  return generateStudyNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyNotesPrompt',
  input: {schema: GenerateStudyNotesInputSchema},
  output: {schema: GenerateStudyNotesOutputSchema},
  prompt: `You are an expert educator AI that creates high-quality, detailed, and structured study materials formatted in HTML.

  Your task is to generate a comprehensive set of study notes for the topic: **{{{topic}}}**.

  The output MUST be a valid JSON object matching the requested schema. All string values in the JSON must be valid HTML.

  **Instructions for the HTML notes:**
  - **Overall:** Use semantic HTML tags. Use <h2> for section titles, <p> for paragraphs, <ul> and <li> for lists, <strong> for important keywords, and <em> for emphasis. Do NOT include <html> or <body> tags.
  - **introduction**: Start with a concise introduction in a <p> tag.
  - **coreConcepts**: Provide a detailed explanation of the core concepts. Use <h3> for sub-headings and structure content logically.
  - **examples**: Include 2-3 clear, practical examples. Use <h3> for each example title and <p> for the explanation.
  - **keyFormulas**: If applicable, list key formulas. For each formula, use a <p> tag with the formula name in a <strong> tag, followed by the explanation. If there are no formulas, the value should be the string 'None'.
  - **keyTerms**: Identify and define 8-12 of the most important key terms. Format this as an HTML unordered list (<ul>), with each term and definition inside a list item (<li>), like '<li><strong>Term:</strong> Definition</li>'.
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
