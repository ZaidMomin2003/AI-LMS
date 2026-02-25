import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
  console.log(
    '================================================================================',
    '\nUnable to find GEMINI_API_KEY. Calling AI functions will fail.',
    '\nCreate a file named .env in the project root and add your key:',
    '\nGEMINI_API_KEY=<your key>',
    '\nGet a key at https://makersuite.google.com/app/apikey',
    '\n================================================================================'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || 'YOUR_API_KEY',
    }),
  ],
  model: 'googleai/gemini-2.5-flash-lite',
});
