'use server';

/**
 * @fileOverview An AI agent that explains a selected piece of text within a larger context.
 *
 * - explainText - A function that provides a contextual explanation for selected text.
 * - ExplainTextInput - The input type for the explainText function.
 * - ExplainTextOutput - The return type for the explainText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTextInputSchema = z.object({
  selectedText: z.string().describe('The specific word, phrase, or sentence selected by the user.'),
  contextText: z.string().describe('The full document or surrounding text from which the text was selected.'),
});
export type ExplainTextInput = z.infer<typeof ExplainTextInputSchema>;

const ExplainTextOutputSchema = z.object({
  explanation: z.string().describe("A clear and concise explanation of the selected text in the given context, formatted as simple HTML (e.g., using <p> and <strong> tags)."),
});
export type ExplainTextOutput = z.infer<typeof ExplainTextOutputSchema>;


export async function explainText(input: ExplainTextInput): Promise<ExplainTextOutput> {
    return explainTextFlow(input);
}


const prompt = ai.definePrompt({
  name: 'explainTextPrompt',
  input: {schema: ExplainTextInputSchema},
  output: {schema: ExplainTextOutputSchema},
  prompt: `You are an expert tutor AI. A student has highlighted a piece of text and needs an explanation.

Your task is to explain the selected text in the context of the surrounding document.

- **Analyze the Context:** First, understand the overall topic from the 'contextText'.
- **Focus on the Selection:** Then, provide a clear, concise explanation for the 'selectedText'.
- **CRITICAL:** Your explanation must be a maximum of 30 words. Be brief and to the point.
- **Keep it Simple:** Explain it as you would to a high school student. Avoid jargon.
- **Format in HTML:** Your response must be formatted as a simple HTML string. Use tags like <p> for paragraphs and <strong> for emphasis on key terms. Do not use headings or lists.

**Context Document:**
---
{{{contextText}}}
---

**Selected Text to Explain:**
"{{{selectedText}}}"

Now, provide your explanation (max 30 words).`,
});


const explainTextFlow = ai.defineFlow(
  {
    name: 'explainTextFlow',
    inputSchema: ExplainTextInputSchema,
    outputSchema: ExplainTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI returned an invalid response format. Please try again.");
    }
    return output;
  }
);
