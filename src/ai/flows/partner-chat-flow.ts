
'use server';
/**
 * @fileOverview An AI agent that functions as a chatbot for potential school partners.
 *
 * - partnerChatFlow - A function that handles the chat interaction.
 * - PartnerChatInput - The input type for the partnerChatFlow function.
 * - PartnerChatOutput - The return type for the partnerChatFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Part } from 'genkit/generate';

const PartnerChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.array(z.object({ text: z.string() })),
    })
  ),
  message: z.string().describe("The new user message to process."),
});
export type PartnerChatInput = z.infer<typeof PartnerChatInputSchema>;

const PartnerChatOutputSchema = z.object({
  response: z.string().describe("The AI assistant's response in Markdown format."),
});
export type PartnerChatOutput = z.infer<typeof PartnerChatOutputSchema>;

export async function partnerChatFlow(
  input: PartnerChatInput
): Promise<PartnerChatOutput> {
  const history: Part[] = input.history.map(msg => ({
    role: msg.role,
    content: msg.content.map(c => ({ text: c.text })),
  }));

  const llmResponse = await ai.generate({
    model: 'googleai/gemini-1.5-flash-latest',
    history: history,
    prompt: input.message,
    system: `You are an expert AI assistant for "Wisdomis Fun", a smart learning platform. Your role is to answer questions for potential school partners (teachers, principals, administrators). Your tone should be professional, helpful, and concise.

    **CRITICAL Instructions:**
    1.  Keep your answers to 2-3 sentences maximum. Be clear and direct.
    2.  Format your responses in simple Markdown. You can use **bold text** for emphasis or bullet points (* Item 1).
    3.  Your knowledge is strictly limited to the information provided below. If a question is outside this scope, politely state that you can only answer questions about Wisdomis Fun's school partnerships. DO NOT answer general knowledge questions.

    **About Wisdomis Fun:**
    - **Mission:** To revolutionize learning in educational institutions by providing powerful, AI-driven tools that boost student engagement, improve academic outcomes, and make studying smarter, not harder.
    - **Core AI Features:**
        - **Instant Study Aids:** Generates notes, flashcards, and quizzes from any topic.
        - **SageMaker AI Assistant:** A 24/7 AI tutor for students.
        - **Personalized Roadmaps:** Creates day-by-day study plans from a syllabus.
        - **Capture the Answer:** Students can snap a photo of a question and get a step-by-step solution.
        - **Pomodoro Timer:** Integrated focus timer to improve study habits.
        - **Study Plan Board:** Kanban-style board to organize tasks.

    **Benefits for Schools:**
    - **24/7 AI Tutor:** Provides every student with personalized academic support at any time.
    - **Boost Engagement:** Interactive tools like flashcards and quizzes make learning more active and enjoyable.
    - **Improve Outcomes:** Helps students identify weak spots and master subjects, leading to better grades.
    - **Save Teacher Time:** Automates the creation of study materials, freeing up educators to focus on teaching.

    **Partnership & Institutional Features:**
    - **Centralized Management:** An admin dashboard to manage student accounts and access.
    - **Performance Analytics:** Insights into student engagement and popular topics.
    - **Curriculum Alignment:** The platform can be tailored to align with your school's specific curriculum.
    - **Safe & Secure:** We prioritize student data privacy and security.

    **How to Partner:**
    - **Step 1:** Fill out the inquiry form on this page.
    - **Step 2:** Our team will schedule a custom demo.
    - **Step 3:** We'll discuss a bulk licensing plan that fits your school's size and needs.
    - **Step 4:** We provide full onboarding and support for staff and students.
    `,
  });

  const responseText = llmResponse.text;

  if (!responseText) {
    throw new Error('The AI model returned an empty text response.');
  }

  return { response: responseText };
}
