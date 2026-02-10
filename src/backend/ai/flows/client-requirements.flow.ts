import { z } from 'genkit';
import { ai, gemini25Flash } from '@/backend/ai/config/genkit.config';
import { BudgetRequirement } from '@/backend/budget/domain/budget-requirements';

// Define the input schema for the flow
const ClientRequirementsInput = z.object({
    userMessage: z.string(),
    history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.array(z.object({ text: z.string() }))
    })).optional(),
    currentRequirements: z.custom<Partial<BudgetRequirement>>().optional(),
});

// Define the output schema
const ClientRequirementsOutput = z.object({
    response: z.string(),
    updatedRequirements: z.custom<Partial<BudgetRequirement>>(),
    nextQuestion: z.string().optional(),
    isComplete: z.boolean(),
});

export const clientRequirementsFlow = ai.defineFlow(
    {
        name: 'clientRequirementsFlow',
        inputSchema: ClientRequirementsInput,
        outputSchema: ClientRequirementsOutput,
    },
    async (input) => {
        const { userMessage, history = [], currentRequirements = {} } = input;

        // 1. Analysis Step: Extract requirements and determine next steps
        const analysisPrompt = `
      You are "Conserje", an expert Quantity Surveyor (Aparejador) and Architect for PriceCloud.
      Your goal is to gather PRECISE technical requirements for a renovation budget.
      
      Current Requirements State: ${JSON.stringify(currentRequirements, null, 2)}
      
      User's latest message: "${userMessage}"
      Conversation History: ${JSON.stringify(history)}
      
      BEHAVIOR GUIDELINES:
      - Do NOT be satisfied with vague answers like "reformar baño" or "cambiar suelo".
      - PROACTIVELY ask for:
         * Dimensions (approx m2) if missing.
         * Specific Materials (e.g., "Parket AC4 or AC5?", "Porcelain or Ceramic tiles?").
         * Scope details (e.g., "Demolish partitions?", "New electrical panel?", "False ceilings?").
      - Maintain a professional, helpful, but inquisitive persona.
      - If the user asks for a budget, explain you need these details first to be accurate.
      
      Task:
      1. Analyze the user's message and history.
      2. Extract new inputs mapping to the schema:
         - propertyType (residential, commercial, office)
         - projectScope (integral, partial)
         - totalAreaM2 (number)
         - numberOfRooms (number, bedrooms)
         - numberOfBathrooms (number)
         - qualityLevel (basic, medium, premium)
         - targetBudget (string, e.g. "50k", "approx 50000")
         - urgency (string, e.g. "ASAP", "next month")
         - partialScope (array strings: bathroom, kitchen, painting, electricity, plumbing, etc.)
         - Specific details: 'floorType' (parquet/tile/microcement), 'paintWalls' (bool), 'demolishPartitions' (bool), etc.
      3. Update 'detectedNeeds' with granular items (e.g., "Demolición de 70m2 tabiques", "Suelo Parquet Roble AC5").
      4. Determine if we have enough info for a ROUGH DRAFT.
         We need AT LEAST: Property Type, Scope, Area, Room/Bath Counts, Quality Level.
      5. Generate a response:
         - Acknowledge what was understood (briefly).
         - Ask the NEXT most important MISSING technical question.
         
      CRITICAL OUTPUT INSTRUCTIONS:
      - Return ONLY valid JSON.
      - Do NOT use control characters (e.g. \\b, \\t, backspace) inside the JSON strings.
      - Keep the 'response' field concise (under 50 words) to avoid generation loops.
      - Ensure 'missingFields' is always an array, even if empty.
    `;

        const extractionSchema = z.object({
            updatedRequirements: z.custom<Partial<BudgetRequirement>>().optional().default({}),
            response: z.string(),
            nextQuestion: z.string().optional(),
            missingFields: z.array(z.string()).optional().default([]), // Make optional to prevent crash
            isComplete: z.boolean().optional().default(false),
        });

        const llmResponse = await ai.generate({
            model: gemini25Flash,
            prompt: analysisPrompt,
            output: { schema: extractionSchema },
            config: {
                temperature: 0.3,
                maxOutputTokens: 8192
            },
        });

        const result = llmResponse.output;

        if (!result) {
            throw new Error("Failed to generate analysis");
        }

        // Merge the extracted requirements with the previous ones (simple merge for now)
        // In a real app, you might want deeper merging logic
        const updatedReqs = result.updatedRequirements || {}; // Defensive check
        const mergedRequirements = {
            ...currentRequirements,
            ...updatedReqs,
            // Ensure specific fields are preserved if not overwritten
            detectedNeeds: [
                ...(currentRequirements.detectedNeeds || []),
                ...(updatedReqs.detectedNeeds || [])
            ]
        };

        return {
            response: result.response,
            updatedRequirements: mergedRequirements,
            nextQuestion: result.nextQuestion,
            isComplete: result.isComplete
        };
    }
);
