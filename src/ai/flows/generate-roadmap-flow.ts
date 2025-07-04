'use server';

/**
 * @fileOverview An AI agent that generates a personalized study roadmap.
 *
 * - generateRoadmap - A function that handles the study plan generation process.
 * - GenerateRoadmapInput - The input type for the generateRoadmap function.
 * - GenerateRoadmapOutput - The return type for the generateRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateRoadmapInputSchema = z.object({
  syllabus: z.string().describe('The full syllabus or list of topics to study.'),
  hoursPerDay: z.number().positive().describe('The number of hours the user can study each day.'),
  targetDate: z.string().describe('The target completion date for the syllabus, in YYYY-MM-DD format.'),
  startDate: z.string().describe('The start date for the study plan, in YYYY-MM-DD format.'),
});
export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapInputSchema>;

export const GenerateRoadmapOutputSchema = z.object({
  plan: z.array(
    z.object({
      date: z.string().describe("The specific date for this study session in 'Month Day, YYYY' format (e.g., 'August 27, 2024')."),
      dayOfWeek: z.string().describe("The day of the week (e.g., 'Tuesday')."),
      topicsToCover: z.string().describe('A detailed list of specific topics, chapters, or tasks from the syllabus to be covered on this day.'),
      estimatedHours: z.number().describe("The estimated number of hours required for the day's topics, respecting the user's daily study limit."),
    })
  ).describe('A day-by-day study plan.'),
});
export type GenerateRoadmapOutput = z.infer<typeof GenerateRoadmapOutputSchema>;

export async function generateRoadmap(input: GenerateRoadmapInput): Promise<GenerateRoadmapOutput> {
  return generateRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoadmapPrompt',
  input: {schema: GenerateRoadmapInputSchema},
  output: {schema: GenerateRoadmapOutputSchema},
  prompt: `You are an expert academic planner. Your task is to create a detailed, day-by-day study plan for a user.

  **User's Input:**
  - **Syllabus:** {{{syllabus}}}
  - **Available Study Hours Per Day:** {{{hoursPerDay}}} hours
  - **Start Date:** {{{startDate}}}
  - **Target Completion Date:** {{{targetDate}}}

  **Instructions:**
  1.  Analyze the provided syllabus and break it down into manageable daily tasks.
  2.  Distribute the tasks chronologically from the start date to the target date.
  3.  The estimated hours for each day's tasks MUST NOT exceed the user's available hours per day. Be realistic with the time allocation.
  4.  The plan should cover the entire syllabus within the given timeframe. If the time is insufficient, prioritize the most important topics and make a note of it in the topicsToCover for the last day. If there is extra time, schedule review days.
  5.  For each day in the plan, provide the exact date, the day of the week, a clear and specific list of topics to cover, and the estimated hours for that session.
  6.  Format the output as a valid JSON object matching the provided schema.
  7.  Ensure the date format in the output is 'Month Day, YYYY' (e.g., 'August 27, 2024').
  `,
});

const generateRoadmapFlow = ai.defineFlow(
  {
    name: 'generateRoadmapFlow',
    inputSchema: GenerateRoadmapInputSchema,
    outputSchema: GenerateRoadmapOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
