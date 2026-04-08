import { NextResponse } from 'next/server';
import { FirebaseDealRepository } from '@/backend/crm/infrastructure/persistence/firebase.deal.repository';
import { MoveLeadToStageUseCase } from '@/backend/crm/application/move-lead-to-stage.usecase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { leadId, newStage } = body;

        if (!leadId || !newStage) {
            return NextResponse.json({ error: 'Missing leadId or newStage' }, { status: 400 });
        }

        const repository = new FirebaseDealRepository();
        const useCase = new MoveLeadToStageUseCase(repository);

        await useCase.execute(leadId, newStage);

        return NextResponse.json({ success: true, message: `Lead moved to ${newStage}` });
    } catch (error: any) {
        console.error("Error moving lead stage", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
