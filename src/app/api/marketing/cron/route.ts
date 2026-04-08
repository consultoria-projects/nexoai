import { NextResponse } from 'next/server';
import { FirebaseEnrollmentRepository } from '@/backend/marketing/infrastructure/persistence/firebase.enrollment.repository';
import { GoogleCloudTasksAdapter } from '@/backend/marketing/infrastructure/queue/google-cloud-tasks.adapter';
import { TriggerSequencesUseCase } from '@/backend/marketing/application/trigger-sequences.usecase';

// Previene caché estática y permite que el Cron funcione cada vez
export const dynamic = 'force-dynamic';

/**
 * EP: GET /api/marketing/cron
 * Acción: Escanea Base de Datos (Búsqueda veloz) y encola tareas (Veloz).
 * Esto nunca dará Timeout en Vercel, da igual si hay 1 o 10.000 emails programados.
 */
export async function GET() {
    try {
        console.log("🤖 [MÁQUINA DIGITAL] Cron API disparado de forma ultrarrápida.");
        
        const enrollmentRepo = new FirebaseEnrollmentRepository();
        const taskQueue = new GoogleCloudTasksAdapter();
        
        const triggerUseCase = new TriggerSequencesUseCase(enrollmentRepo, taskQueue);

        // Disparamos la rápida inserción a GCP Tasks.
        const pushed = await triggerUseCase.execute();

        return NextResponse.json({
            success: true,
            pushed_count: pushed,
            message: `Despachador Cron ejecutado en tiempo récord. ${pushed} secuencias pasadas de forma asíncrona a Cola GCP o Worker Interno.`
        });

    } catch(err: any) {
        console.error("❌ Error Crítico Cron:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
