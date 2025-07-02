'use server';

/**
 * @fileOverview Summarizes AI-generated study notes into key points.
 *
 * - summarizeStudyNotes - A function that summarizes the study notes.
 * - SummarizeStudyNotesInput - The input type for the summarizeStudyNotes function.
 * - SummarizeStudyNotesOutput - The return type for the summarizeStudyNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeStudyNotesInputSchema = z.object({
  studyNotes: z.string().describe('The AI-generated study notes to summarize.'),
});
export type SummarizeStudyNotesInput = z.infer<typeof SummarizeStudyNotesInputSchema>;

const SummarizeStudyNotesOutputSchema = z.object({
  summary: z.string().describe('A summary of the key points in the study notes.'),
});
export type SummarizeStudyNotesOutput = z.infer<typeof SummarizeStudyNotesOutputSchema>;

export async function summarizeStudyNotes(input: SummarizeStudyNotesInput): Promise<SummarizeStudyNotesOutput> {
  return summarizeStudyNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeStudyNotesPrompt',
  input: {schema: SummarizeStudyNotesInputSchema},
  output: {schema: SummarizeStudyNotesOutputSchema},
  prompt: `You are an expert summarizer. Please summarize the following study notes into key points:\n\n{{{studyNotes}}}`,
});

const summarizeStudyNotesFlow = ai.defineFlow(
  {
    name: 'summarizeStudyNotesFlow',
    inputSchema: SummarizeStudyNotesInputSchema,
    outputSchema: SummarizeStudyNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
