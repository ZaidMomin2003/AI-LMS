'use server';

import {
  generateFlowchart,
  type GenerateFlowchartInput,
  type GenerateFlowchartOutput,
} from '@/ai/flows/generate-flowchart-flow';

export async function createFlowchartAction(
  input: GenerateFlowchartInput
): Promise<GenerateFlowchartOutput> {
  try {
    const result = await generateFlowchart(input);
    return result;
  } catch (error) {
    console.error('Error generating flowchart:', error);
    throw new Error('Failed to generate the flowchart. Please try again.');
  }
}
