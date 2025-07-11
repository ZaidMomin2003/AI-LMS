
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
    prompt: `You are an expert SVG flowchart generator for a DARK THEME application. Your ONLY job is to create a valid SVG string based on the syllabus provided.

    **CRITICAL Instructions:**
    1.  Analyze the provided syllabus to determine the logical flow of topics.
    2.  Generate a flowchart representing this structure.
    3.  Your output MUST be a single, valid, self-contained SVG string and NOTHING else.
    4.  DO NOT include markdown backticks (like \`\`\`svg), explanations, or any text outside of the SVG tags.
    5.  The SVG dimensions should be reasonable, like width="800" height="600".
    6.  **DARK THEME STYLING IS ESSENTIAL**:
        *   **Text Color**: All text MUST be a light color (e.g., \`#FFFFFF\`, \`#E5E7EB\`).
        *   **Node Fill Color**: Use a semi-dark color for node fills (e.g., \`#2d3748\`).
        *   **Node Border Color**: Use a brighter border color (e.g., \`#4A0082\`).
        *   **Arrow Color**: Use a light color for arrows (e.g., \`#9CA3AF\`).
        *   **SVG Background**: The SVG background MUST be transparent.

    **Syllabus:**
    ${input.syllabus}

    **Example of a valid, complete response:**
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">...</svg>

    Now, generate ONLY the SVG code for the syllabus above.`,
  });

  let svgContent = llmResponse.text.trim();
  
  // The model sometimes wraps the SVG in markdown backticks. Let's remove them.
  if (svgContent.startsWith('```svg')) {
    svgContent = svgContent.substring(7, svgContent.length - 3).trim();
  } else if (svgContent.startsWith('```')) {
    svgContent = svgContent.substring(3, svgContent.length - 3).trim();
  }
  
  // Basic validation to ensure it looks like an SVG
  if (!svgContent.startsWith('<svg') || !svgContent.endsWith('</svg>')) {
      console.error("Invalid SVG response from AI:", svgContent);
      throw new Error('The AI did not return a valid SVG. Please try again.');
  }

  return { svg: svgContent };
}
