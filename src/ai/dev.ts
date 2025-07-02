import { config } from 'dotenv';
config();

import '@/ai/flows/generate-study-materials.ts';
import '@/ai/flows/generate-quiz-questions.ts';
import '@/ai/flows/summarize-study-notes.ts';