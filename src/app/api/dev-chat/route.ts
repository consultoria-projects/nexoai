import { NextRequest, NextResponse } from 'next/server';
import { clientRequirementsFlow } from '@/backend/ai/flows/client-requirements.flow';
import { generateBudgetFlow } from '@/backend/ai/flows/budget/generate-budget.flow';
import { buildBudgetNarrative } from '@/backend/budget/domain/budget-narrative-builder';
import { DetailedFormValues } from '@/components/budget-request/schema';

/**
 * Dev Chat API Endpoint
 * 
 * This endpoint allows the CLI tool to interact with the AI flows.
 * Only available in development mode.
 */

export async function POST(request: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { action, message, history, requirements } = body;

        if (action === 'message') {
            // Process chat message
            const result = await clientRequirementsFlow({
                userMessage: message,
                history: history || [],
                currentRequirements: requirements || {},
            });

            return NextResponse.json(result);

        } else if (action === 'generate') {
            // Generate budget
            const narrative = buildBudgetNarrative(requirements as DetailedFormValues);
            const result = await generateBudgetFlow({ userRequest: narrative });

            return NextResponse.json(result);

        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('[Dev Chat API] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
