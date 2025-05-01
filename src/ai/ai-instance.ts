
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
// No need to import firebase plugin here if deploying flows within Next.js environment

// Check if running in Firebase Functions environment (useful if deploying separately)
// const isFirebaseFunction = !!process.env.FUNCTION_TARGET || !!process.env.FUNCTION_SIGNATURE_TYPE;

const activePlugins = [
  googleAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
  }),
];

// Example conditional plugin addition (if needed for separate deployment)
// if (isFirebaseFunction) {
//   activePlugins.push(firebase()); // Ensure firebase() is correctly imported if used
// }

export const ai = genkit({
  plugins: activePlugins,
  logLevel: 'debug', // Optional: adjust log level
  enableTracingAndMetrics: true, // Optional: enable tracing
});
