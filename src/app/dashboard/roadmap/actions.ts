'use server';

import { generateRoadmap, type GenerateRoadmapInput, type GenerateRoadmapOutput } from '@/ai/flows/generate-roadmap-flow';

export async function createRoadmapAction(input: GenerateRoadmapInput): Promise<GenerateRoadmapOutput> {
  try {
    const roadmap = await generateRoadmap(input);
    return roadmap;
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error('Failed to generate study roadmap. Please try again.');
  }
}
