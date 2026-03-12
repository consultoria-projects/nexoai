import { notFound } from 'next/navigation';
import { FirestoreAiTrainingRepository } from '@/backend/ai-training/infrastructure/firestore-ai-training-repository';
import { FirestoreLeadRepository } from '@/backend/lead/infrastructure/firestore-lead-repository';
import { BudgetEditorWrapper } from '@/components/budget-editor/BudgetEditorWrapper';
import { Budget } from '@/backend/budget/domain/budget';

interface DemoViewerPageProps {
    params: Promise<{
        traceId: string;
    }>;
}

export default async function DemoViewerPage({ params }: DemoViewerPageProps) {
    const { traceId } = await params;
    const cleanTraceId = decodeURIComponent(traceId);

    const aiTrainingRepo = new FirestoreAiTrainingRepository();
    let trace;

    try {
        trace = await aiTrainingRepo.findById(cleanTraceId);
    } catch (e) {
        console.error("Error fetching trace:", e);
    }

    if (!trace) {
        notFound();
    }

    const leadRepo = new FirestoreLeadRepository();
    const lead = await leadRepo.findById(trace.leadId);

    // Reconstruct a Budget surrogate object to feed into the BudgetEditorWrapper
    const baselineJson = trace.finalHumanJson || trace.baselineJson;

    // Fallbacks just in case the backend didn't construct the JSON perfectly
    const chapters = baselineJson.chapters || [];
    const costBreakdown = baselineJson.costBreakdown || {
        materialExecutionPrice: 0,
        overheadExpenses: 0,
        industrialBenefit: 0,
        tax: 0,
        globalAdjustment: 0,
        total: 0
    };
    const totalEstimated = baselineJson.totalEstimated || 0;
    const telemetry = baselineJson.telemetry || {};
    const config = baselineJson.config || undefined;

    const proxyBudget: Budget = JSON.parse(JSON.stringify({
        id: traceId, // The ID here is the traceId, so saves won't accidentally overwrite a real budget
        leadId: trace.leadId,
        clientSnapshot: lead?.personalInfo || { name: 'Demo User', email: '', phone: '' },
        specs: {
            interventionType: 'renovation',
            propertyType: 'flat',
            totalArea: 0,
            qualityLevel: 'medium'
        } as any,
        status: 'draft',
        createdAt: trace.createdAt || new Date(),
        updatedAt: new Date(),
        version: 1,
        type: 'renovation',
        chapters: chapters,
        costBreakdown: costBreakdown,
        totalEstimated: totalEstimated,
        telemetry: telemetry,
        config: config,
        source: 'wizard',
        // Inyectamos esto para la lógica de solo lectura del frontend
        demoPdfsDownloaded: lead?.demoPdfsDownloaded || 0
    }));

    return (
        <div className="h-screen w-full bg-background flex flex-col">
            <BudgetEditorWrapper budget={proxyBudget} isAdmin={false} />
        </div>
    );
}
