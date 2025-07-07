'use server';
/**
 * @fileOverview An AI agent that functions as a study assistant chatbot.
 *
 * - sageMakerFlow - A function that handles the chat interaction.
 * - SageMakerInput - The input type for the sageMakerFlow function.
 * - SageMakerOutput - The return type for the sageMakerFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {Part} from 'genkit/generate';

const SageMakerInputSchema = z.object({
  prompt: z.string().describe("The user's question or message."),
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "An optional image provided by the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SageMakerInput = z.infer<typeof SageMakerInputSchema>;

const SageMakerOutputSchema = z.object({
  response: z.string().describe("The AI assistant's response."),
});
export type SageMakerOutput = z.infer<typeof SageMakerOutputSchema>;

// This is now a direct async function, removing the ai.defineFlow wrapper for robustness.
export async function sageMakerFlow(
  input: SageMakerInput
): Promise<SageMakerOutput> {
  const {prompt, imageDataUri} = input;

  // Manually construct the prompt parts for reliability
  const promptParts: Part[] = [
    {
      text: `You are SageMaker, a friendly, encouraging, and knowledgeable AI study assistant. Your primary goal is to help students by providing clear, simple, and concise answers to their questions.

**Your Response Style:**
*   **Be Concise:** Get straight to the point. Avoid long explanations unless the user specifically asks for more detail.
*   **Simplify Concepts:** Break down complex ideas into easy-to-understand parts. Use analogies if helpful.
*   **Use Markdown:** Format your response using Markdown. Use **bold text** for important keywords or concepts to make them stand out.
*   **Provide Further Reading:** If applicable, end your response with a "Further Reading:" section that includes 1-2 high-quality links (like Wikipedia, Khan Academy, or reputable educational sites) where the user can learn more.

Based on these instructions, answer the user's question.

Question: ${prompt}`,
    },
  ];

  // Add the image to the prompt if it exists
  if (imageDataUri) {
    promptParts.push({text: 'Use this image as context for your response:'});
    promptParts.push({media: {url: imageDataUri}});
  }

  const llmResponse = await ai.generate({
    prompt: promptParts,
    config: {
      safetySettings: [
        {category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE'},
        {category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE'},
        {category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE'},
        {category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE'},
      ],
    },
  });

  const responseText = llmResponse.text;

  if (!responseText) {
    throw new Error('The AI model returned an empty text response.');
  }

  return {response: responseText};
}
