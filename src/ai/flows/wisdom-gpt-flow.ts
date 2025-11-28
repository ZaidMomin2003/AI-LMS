
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
  notesContext: z.string().optional().describe("Optional context from the user's study notes to provide a focused answer."),
  settings: z.object({
    explainSimple: z.boolean().optional(),
    includeExamples: z.boolean().optional(),
    suggestFollowUp: z.boolean().optional(),
  }).optional(),
});
export type WisdomGptInput = z.infer<typeof WisdomGptInputSchema>;

const WisdomGptOutputSchema = z.object({
  response: z.string().describe("The AI assistant's HTML-formatted response."),
});
export type WisdomGptOutput = z.infer<typeof WisdomGptOutputSchema>;


export async function wisdomGptFlow(
  input: WisdomGptInput
): Promise<WisdomGptOutput> {
  const {prompt, imageDataUri, settings, notesContext} = input;

  const promptParts: Part[] = [
    {
      text: `You are WisdomGPT, a friendly, encouraging, and knowledgeable AI study assistant. Your primary goal is to help students by providing clear, simple, and concise answers to their questions.

**Your Response Style & Formatting:**
*   **Generate RAW HTML ONLY:** Your entire response MUST be formatted as valid HTML. Use <h4> for headings, <p> for paragraphs, <ul> and <li> for lists, and <strong> for bolding important keywords.
*   **NO MARKDOWN:** Do NOT wrap your response in markdown code fences like \`\`\`html or \`\`\`. Your output must be only the raw HTML content.
*   **Be Concise & Organized:** Get straight to the point. Structure your answer logically.
*   **Avoid Extra Spacing:** Do NOT add multiple or unnecessary newline characters (\\n) between paragraphs or list items. Keep the formatting tight and clean, like a well-written document.
*   **CRITICAL: Mathematical Formulas:** ALL mathematical formulas, variables, and chemical equations (like CO2 or H2O) MUST be enclosed in KaTeX delimiters. Use \`$$...$$\` for block-level equations and \`$...$\` for inline equations. For example, write Carbon Dioxide as \`$CO_2$\`. This is non-negotiable.
*   **No Further Reading:** Do NOT include a "Further Reading" section.
${notesContext ? `*   **IMPORTANT CONTEXT:** You have been provided with the user's personal study notes. Use this as the primary source of truth to answer the following question. Refer to it as "your notes" or "the provided context".\n---STUDY NOTES---\n${notesContext}\n---END STUDY NOTES---` : ""}
${settings?.explainSimple ? "*   **Explain Simply:** Explain concepts as if you're talking to a 10-year-old. Use simple language, humor, and analogies." : ""}
${settings?.includeExamples ? "*   **Include Examples:** Where applicable, provide one or two real-world examples to illustrate your point. Format the example inside its own boxed and styled div, like this: \`<div class='example-box'><h4>Example</h4><p>Your example here...</p></div>\`" : ""}
${settings?.suggestFollowUp ? "*   **Suggest Follow-up:** At the very end of your response, suggest two interesting follow-up questions the user might want to ask. CRITICAL: Format them as HTML buttons, like this: \`<button class='follow-up-btn'>Your first question?</button><button class='follow-up-btn'>Your second question?</button>\`" : ""}

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

  // Clean up any markdown fences and extra newlines, just in case the AI includes them.
  const responseText = llmResponse.text
    ?.replace(/^```html\n?/, '') // Remove leading ```html
    .replace(/\n?```$/, '')      // Remove trailing ```
    .replace(/\n{2,}/g, '\n')     // Collapse multiple newlines
    .trim();

  if (!responseText) {
    throw new Error('The AI model returned an empty text response.');
  }

  return {response: responseText};
}
