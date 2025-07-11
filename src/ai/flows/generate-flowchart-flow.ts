
'use server';

/**
 * @fileOverview An AI agent that generates a flowchart SVG from a syllabus.
 *
 * - generateFlowchart - A function that handles the flowchart generation process.
 * - GenerateFlowchartInput - The input type for the generateFlowchart function.
 * - GenerateFlowchartOutput - The return type for the generateFlowchart function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateFlowchartInputSchema = z.object({
  syllabus: z.string().min(1, 'Syllabus content is required.'),
});
export type GenerateFlowchartInput = z.infer<typeof GenerateFlowchartInputSchema>;

const GenerateFlowchartOutputSchema = z.object({
  svg: z.string().describe('The flowchart represented as a valid SVG string.'),
});
export type GenerateFlowchartOutput = z.infer<typeof GenerateFlowchartOutputSchema>;

export async function generateFlowchart(
  input: GenerateFlowchartInput
): Promise<GenerateFlowchartOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are an expert in instructional design and data visualization. Your task is to create a clear, concise, and visually appealing flowchart from a given syllabus or list of topics.

    **Instructions:**
    1.  Analyze the provided syllabus and determine the logical sequence and relationships of the topics.
    2.  Generate a flowchart that represents this structure.
    3.  The final output MUST be a single, valid, self-contained SVG string. Do not wrap it in markdown backticks or any other characters.
    4.  The SVG should be styled professionally. Use rounded rectangles for nodes, arrows for connectors, and a clean, readable font.
    5.  The SVG dimensions should be reasonably large to ensure clarity, for example, width="800" height="600".
    6.  Use different colors to distinguish between different levels or types of topics if it enhances clarity.
    7.  Ensure text within nodes is properly centered and does not overflow the node boundaries.

    **Syllabus:**
    ${input.syllabus}

    **Example SVG output format:**
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">...</svg>

    Now, generate the SVG for the syllabus above.`,
  });

  const svgContent = llmResponse.text.trim();
  
  // Basic validation to ensure it looks like an SVG
  if (!svgContent.startsWith('<svg') || !svgContent.endsWith('</svg>')) {
      throw new Error('The AI did not return a valid SVG. Please try again.');
  }

  return { svg: svgContent };
}
