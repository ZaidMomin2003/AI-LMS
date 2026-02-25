
'use server';

/**
 * @fileOverview An AI agent that generates detailed, structured study notes on a given topic.
 *
 * - generateStudyNotes - A function that generates a structured set of study materials.
 * - GenerateStudyNotesInput - The input type for the generateStudyNotes function.
 * - GenerateStudyNotesOutput - The return type for the generateStudyNotes function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { StudyNotes } from '@/types';

const GenerateStudyNotesInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate study notes.'),
  // Personalization fields
  userName: z.string().optional().describe("The user's name or nickname."),
  userGoal: z.string().optional().describe("The user's primary learning goal."),
  contentStyle: z.string().optional().describe("The user's preferred style for the content (e.g., humorous, formal)."),
  userSuperpower: z.string().optional().describe("The user's self-described study superpower."),
  userWeakness: z.string().optional().describe("The user's self-described study weakness."),
  educationLevel: z.string().optional().describe("The user's education level (e.g., High School, University)."),
});

export type GenerateStudyNotesInput = z.infer<typeof GenerateStudyNotesInputSchema>;

const GenerateStudyNotesOutputSchema = z.object({
  introduction: z.string().describe("A brief, engaging introduction to the topic, formatted in HTML within <p> tags."),
  coreConcepts: z.string().describe("A detailed explanation of the topic's core concepts, formatted as HTML with <h2> for the main title, <h3> for sub-headings, <p> for paragraphs, and <strong> for emphasis."),
  keyVocabulary: z.string().describe("A list of 5-7 essential vocabulary words, formatted as an HTML unordered list (<ul>) with each term inside '<li><strong>Term:</strong> Description</li>'."),
  keyDefinitions: z.string().describe("A list of 3-5 key definitions, formatted as an HTML unordered list (<ul>) with each item as '<li><strong>Concept:</strong> Full definition.</li>'."),
  keyFormulasOrPoints: z.string().describe("A list of crucial formulas or bullet points, formatted as an HTML unordered list. If not applicable, state 'None' in a <p> tag."),
  summary: z.string().describe("A concise summary of the entire topic, formatted in HTML within <p> tags."),
  exampleWithExplanation: z.string().describe("A practical example demonstrating a core concept, formatted as HTML with a <h3> title and <p> tags for the explanation."),
});

export async function generateStudyNotes(input: GenerateStudyNotesInput): Promise<StudyNotes> {
  return generateStudyNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyNotesPrompt',
  input: { schema: GenerateStudyNotesInputSchema },
  output: { schema: GenerateStudyNotesOutputSchema },
  prompt: `You are an expert AI tutor creating personalized, high-quality, and structured study materials in HTML for a student.

  **Student's Profile:**
  - Name: {{{userName}}}
  - Goal: {{{userGoal}}}
  - Preferred Style: {{{contentStyle}}}
  - Education Level: {{{educationLevel}}}
  - Superpower: {{{userSuperpower}}}
  - Weakness: {{{userWeakness}}}

  **Your Persona & Task:**
  - Act as a personal narrator and tutor for {{{userName}}}.
  - Your tone MUST match the student's preferred style: '{{{contentStyle}}}'.
  - The content MUST be appropriate for their stated education level: '{{{educationLevel}}}'.
  - Tailor your explanations to help them with their weakness ('{{{userWeakness}}}') and leverage their superpower ('{{{userSuperpower}}}').
  - You are generating a comprehensive set of study notes for the topic: **{{{topic}}}**.
  - The output MUST be a valid JSON object matching the requested schema. All string values must be valid, well-formed HTML. Do NOT include <html> or <body> tags.

  **CRITICAL FORMATTING RULE:**
  - All mathematical formulas, variables, and equations MUST be enclosed in KaTeX delimiters. Use \`$$...$$\` for block-level equations and \`$...$\` for inline equations. This is non-negotiable and applies to all sections.

  **Instructions for Each Section (in HTML):**
  - **introduction**: A brief, engaging intro written directly to {{{userName}}}. For example: "Alright, {{{userName}}}, let's dive into..."
  - **coreConcepts**: The main content. Use <h2> for the main title, <h3> for sub-headings, and <p> tags. Keep the tone consistent with '{{{contentStyle}}}'.
  - **keyVocabulary**: An HTML <ul> of 5-7 important vocabulary words. Format: '<li><strong>Word:</strong> Brief definition.</li>'.
  - **keyDefinitions**: An HTML <ul> of 3-5 key concepts with full definitions. Format: '<li><strong>Concept:</strong> Detailed explanation.</li>'.
  - **keyFormulasOrPoints**: An HTML <ul> of key formulas or important bullet points. If there are no formulas, the value should be the string '<p>None</p>'. Adhere to the critical KaTeX formatting rule here.
  - **summary**: A concise summary of all notes in one or two <p> tags, written as a wrap-up for {{{userName}}}.
  - **exampleWithExplanation**: A clear example tailored to the student. Use a <h3> for the example title and <p> tags for the content.
  `,
});

const generateStudyNotesFlow = ai.defineFlow(
  {
    name: 'generateStudyNotesFlow',
    inputSchema: GenerateStudyNotesInputSchema,
    outputSchema: GenerateStudyNotesOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
