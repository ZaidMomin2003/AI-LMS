import { config } from 'dotenv';
config();

import '@/ai/flows/generate-study-notes.ts';
import '@/ai/flows/generate-flashcards.ts';
import '@/ai/flows/generate-quiz-questions.ts';
import '@/ai/flows/wisdom-gpt-flow.ts';
import '@/ai/flows/generate-roadmap-flow.ts';
import '@/ai/flows/capture-the-answer-flow.ts';
import '@/ai/flows/explain-text-flow.ts';
