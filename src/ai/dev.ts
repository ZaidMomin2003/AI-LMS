import { config } from 'dotenv';
config();

import '@/ai/flows/generate-study-notes.ts';
import '@/ai/flows/generate-flashcards.ts';
import '@/ai/flows/generate-quiz-questions.ts';
import '@/ai/flows/sage-maker-flow.ts';
