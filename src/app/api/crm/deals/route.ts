import { NextResponse } from 'next/server';
import { FirebaseDealRepository } from '@/backend/crm/infrastructure/persistence/firebase.deal.repository';
import { adminFirestore } from '@/backend/shared/infrastructure/firebase/admin-app';

export async function GET() {
    try {
        const repository = new FirebaseDealRepository();
        const deals = await repository.findAll();
        
        const db = adminFirestore;
        // Cargar nombres de los leads reales para la UI del Kanban (Simulamos un JOIN)
        const dealsDTO = await Promise.all(deals.map(async (d) => {
            let assignedName = null;
            let company = null;
            let web = null;
            
            try {
                // Buscamos el nombre del Lead (Real o Test)
                const leadsCollection = process.env.NEXT_PUBLIC_USE_TEST_DB === 'true' ? 'test_leads' : 'marketing_leads';
                const leadDoc = await db.collection(leadsCollection).doc(d.leadId).get();
                if (leadDoc.exists) {
                    const lData = leadDoc.data();
                    assignedName = lData?.name || lData?.email || d.leadId;
                    company = lData?.profile?.companyName || lData?.companyName || 'Empresa';
                    web = lData?.personalInfo?.web || null;
                }
            } catch(e) {
                // Ignorar silentes si el lead original fue borrado
            }

            return {
                id: d.id,
                leadId: d.leadId,
                stage: d.stage,
                estimatedValue: d.estimatedValue,
                assignedName: assignedName,
                company: company,
                web: web,
                meetUrl: d.metadata?.meetUrl || null
            };
        }));

        return NextResponse.json({ deals: dealsDTO });
    } catch (error: any) {
        console.error("Error fetching deals", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
