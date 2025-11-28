
'use server';
/**
 * @fileOverview An AI agent that functions as a study assistant chatbot.
 *
 * - wisdomGptFlow - A function that handles the chat interaction.
 * - WisdomGptInput - The input type for the wisdomGptFlow function.
 * - WisdomGptOutput - The return type for the wisdomGptFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {Part} from 'genkit/generate';

const WisdomGptInputSchema = z.object({
  prompt: z.string().describe("The user's question or message."),
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "An optional image provided by the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type WisdomGptInput = z.infer<typeof WisdomGptInputSchema>;

const WisdomGptOutputSchema = z.object({
  response: z.string().describe("The AI assistant's HTML-formatted response."),
});
export type WisdomGptOutput = z.infer<typeof WisdomGptOutputSchema>;


export async function wisdomGptFlow(
  input: WisdomGptInput
): Promise<WisdomGptOutput> {
  const {prompt, imageDataUri} = input;

  const promptParts: Part[] = [
    {
      text: `You are WisdomGPT, a friendly, encouraging, and knowledgeable AI study assistant. Your primary goal is to help students by providing clear, simple, and concise answers to their questions.

**Your Response Style & Formatting:**
*   **Generate Clean HTML:** Your entire response MUST be formatted as valid HTML. Use tags like <h4> for headings, <p> for paragraphs, <ul> and <li> for lists, and <strong> for bolding important keywords.
*   **Be Concise & Organized:** Get straight to the point. Structure your answer logically.
*   **Avoid Extra Spacing:** Do NOT add multiple or unnecessary newline characters (\n) between paragraphs or list items. Keep the formatting tight and clean, like a well-written document.
*   **Mathematical Formulas:** All mathematical formulas MUST be enclosed in KaTeX delimiters. Use \`$$...$$\` for block-level equations and \`$...$\` for inline equations.
*   **No Further Reading:** Do NOT include a "Further Reading" section.

Based on these instructions, answer the user's question.

Question: ${prompt}`,
    },
  ];

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

  const responseText = llmResponse.text?.replace(/\n{3,}/g, '\n\n').trim();

  if (!responseText) {
    throw new Error('The AI model returned an empty text response.');
  }

  return {response: responseText};
}

    
