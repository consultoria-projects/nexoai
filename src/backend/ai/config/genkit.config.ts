
import { genkit } from 'genkit';
import { googleAI, geminiEmbedding001, gemini } from '@genkit-ai/googleai';

/**
 * Shared Genkit Instance Configuration.
 * Initializes Genkit with Google AI plugin and exports the AI instance and Embedding Model.
 */

// Initialize Genkit
export const ai = genkit({
    plugins: [
        googleAI(), // Automatically uses GOOGLE_GENAI_API_KEY from env
    ],
    promptDir: 'src/backend/ai/prompts', // Explicitly set prompt directory
});

// Export the Embedding Model Reference
export const embeddingModel = geminiEmbedding001;
// Use the model reference from the plugin
export const gemini25Flash = gemini('gemini-2.5-flash');
