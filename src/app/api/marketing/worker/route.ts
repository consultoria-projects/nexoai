import { NextRequest, NextResponse } from 'next/server';
import { FirebaseSequenceRepository } from '@/backend/marketing/infrastructure/persistence/firebase.sequence.repository';
import { FirebaseEnrollmentRepository } from '@/backend/marketing/infrastructure/persistence/firebase.enrollment.repository';
import { FirestoreLeadRepository } from '@/backend/lead/infrastructure/firestore-lead-repository';
import { FirebaseEmailProvider } from '@/backend/marketing/infrastructure/messaging/firebase-email.provider';
import { AIMessagingDecorator } from '@/backend/marketing/application/ai-messaging.decorator';
import { ProgressSequenceUseCase } from '@/backend/marketing/application/progress-sequence.usecase';

/**
 * EP: POST /api/marketing/worker
 * Acción: Recibe PUSH de Google Cloud Tasks (One-by-One). 
 * Realiza llamadas lentas a Gemini y Bases de datos de forma paralela y segura mediante Event Threads.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { enrollmentId } = body;

        if (!enrollmentId) {
            return NextResponse.json({ error: 'Falta payload enrollmentId desde GCP Tasks' }, { status: 400 });
        }

        console.log(`☁️ [Cloud Task Worker] Procesando AI para secuencias individuales... [Enrollment: ${enrollmentId}]`);
        
        const sequenceRepo = new FirebaseSequenceRepository();
        const enrollmentRepo = new FirebaseEnrollmentRepository();
        const leadRepo = new FirestoreLeadRepository();
        
        const baseEmailProvider = new FirebaseEmailProvider();
        const aiProvider = new AIMessagingDecorator(baseEmailProvider);

        const useCase = new ProgressSequenceUseCase(sequenceRepo, enrollmentRepo, leadRepo, aiProvider);

        // Toma todo el tiempo necesario (Inferencia IA de 1 Lead, Parsing Markdown, Firebase Collection Mail) sin bloquear otras solicitudes.
        await useCase.execute(enrollmentId);

        return NextResponse.json({ success: true, processed: enrollmentId });
        
    } catch(err: any) {
        console.error("❌ Error fatal GCP Task WebHook Worker:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
