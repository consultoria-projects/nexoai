'use server';

import { clientRequirementsFlow } from '@/backend/ai/private-core/flows/client-requirements.flow';
import { BudgetRequirement } from '@/backend/budget/domain/budget-requirements';
export async function processAdminMessageAction(
    conversationId: string,
    message: string,
    history: any[],
    currentRequirements: Partial<BudgetRequirement>
) {
    try {
        // ===============================================
        // ADMIN FLOW: Bypasses lead checks and rate limits
        // ===============================================

        const result = await clientRequirementsFlow({
            userMessage: message,
            history: history,
            currentRequirements: currentRequirements,
        });

        return { success: true, data: result };
    } catch (error) {
        console.error("Error processing admin message:", error);
        return { success: false, error: "Failed to process message" };
    }
}
