
'use server';

/**
 * @fileOverview An AI agent that generates a custom quiz based on user specifications.
 *
 * - generateCustomQuiz - A function that handles the custom quiz generation process.
 * - GenerateCustomQuizInput - The input type for the generateCustomQuiz function.
 * - GenerateCustomQuizOutput - The return type for the generateCustomQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionTypeSchema = z.enum([
    'Multiple Choice',
    'True/False',
    'Fill in the Blanks',
]);

const GenerateCustomQuizInputSchema = z.object({
  topics: z.string().describe('A string containing the topics or content for the quiz.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the quiz.'),
  numQuestions: z.coerce.number().int().positive().describe('The number of questions to generate.'),
  questionType: QuestionTypeSchema.describe('The type of questions to generate.'),
});
export type GenerateCustomQuizInput = z.infer<typeof GenerateCustomQuizInputSchema>;


const McqSchema = z.object({
    question: z.string(),
    options: z.array(z.string()).length(4),
    answer: z.string(),
    explanation: z.string(),
});

const TrueFalseSchema = z.object({
    question: z.string(),
    answer: z.boolean(),
    explanation: z.string(),
});

const FillInTheBlanksSchema = z.object({
    question: z.string().describe("A sentence with one or more '____' for the user to fill in."),
    answers: z.array(z.string()).describe("The correct words for the blanks, in order."),
    explanation: z.string(),
});


export const GenerateCustomQuizOutputSchema = z.object({
  questions: z.any().describe("An array of generated quiz questions. The structure of objects in this array will depend on the requested questionType.")
});
export type GenerateCustomQuizOutput = z.infer<typeof GenerateCustomQuizOutputSchema>;

export async function generateCustomQuiz(input: GenerateCustomQuizInput): Promise<GenerateCustomQuizOutput> {
  return generateCustomQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCustomQuizPrompt',
  input: {schema: GenerateCustomQuizInputSchema},
  output: {schema: GenerateCustomQuizOutputSchema},
  prompt: `You are an expert quiz creator for students. Your task is to generate a set of quiz questions based on the provided configuration.

  **Quiz Details:**
  - **Topic/Content:** {{{topics}}}
  - **Difficulty:** {{{difficulty}}}
  - **Number of Questions:** {{{numQuestions}}}
  - **Question Type:** {{{questionType}}}

  **Instructions:**
  1.  Carefully analyze the provided topics and content.
  2.  Generate exactly {{{numQuestions}}} questions.
  3.  The questions must match the requested difficulty level.
  4.  The questions must be of the type '{{{questionType}}}'.
  5.  Your entire response MUST be a single, valid JSON object that conforms to the output schema. The 'questions' field should be an array.
  
  **JSON Structure for each Question Type:**

  -   **For "Multiple Choice":**
      Each object in the 'questions' array should be: \`{ "question": "...", "options": ["A", "B", "C", "D"], "answer": "...", "explanation": "..." }\`. The 'options' array must contain exactly 4 strings.

  -   **For "True/False":**
      Each object in the 'questions' array should be: \`{ "question": "...", "answer": boolean, "explanation": "..." }\`.

  -   **For "Fill in the Blanks":**
      Each object in the 'questions' array should be: \`{ "question": "Sentence with ____ for blanks.", "answers": ["word1", "word2"], "explanation": "..." }\`.
      - The 'question' string must contain '____' as a placeholder for each blank.
      - The 'answers' array should contain the correct words in order.

  Generate the JSON now.`,
});


const generateCustomQuizFlow = ai.defineFlow(
  {
    name: 'generateCustomQuizFlow',
    inputSchema: GenerateCustomQuizInputSchema,
    outputSchema: GenerateCustomQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI returned an invalid response format. Please try again.");
    }
    return output;
  }
);
