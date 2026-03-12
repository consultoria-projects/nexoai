import { NextResponse } from 'next/server';
import { generateBudgetFromSpecsAction } from '@/actions/budget/generate-budget-from-specs.action';

const scenarios = [
    {
        name: 'Obra_Nueva_Unifamiliar',
        specs: {
            interventionType: 'new_build',
            qualityLevel: 'high',
            totalArea: 150,
            originalRequest: 'Quiero construir un chalet de una planta de 150m2 útiles. Ojo, el terreno tiene bastante desnivel y es de roca calcárea muy dura, por lo que el acceso de maquinaria pesada será complejo. Necesito una cimentación adecuada, muros de termoarcilla, aislamiento térmico SATE en fachada, cubierta plana transitable y climatización por aerotermia con suelo radiante.',
        }
    },
    // Adding just the one we want to test first
];

export async function GET(request: Request) {
    const url = new URL(request.url);
    const scenarioIndex = parseInt(url.searchParams.get('index') || '0', 10);
    const scenario = scenarios[scenarioIndex];

    if (!scenario) {
        return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    try {
        console.log(`\n\n[API TEST] Running Scenario: ${scenario.name}`);
        const result: any = await generateBudgetFromSpecsAction(
            null,
            { specs: scenario.specs } as any,
            true
        );

        if (result.success && result.budgetId) {
            // We won't dump to FS here to keep it simple, just return the ID so we can inspect it in Firebase
            return NextResponse.json({
                success: true,
                scenario: scenario.name,
                budgetId: result.budgetId,
                message: "Budget generated successfully. Check Firestore for the detailed DAG and tasks."
            });
        }

        return NextResponse.json({ success: false, error: result.error || 'Unknown error during generation' }, { status: 500 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Exception' }, { status: 500 });
    }
}
