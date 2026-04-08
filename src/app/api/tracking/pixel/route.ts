import { NextRequest, NextResponse } from 'next/server';
import { FirebaseEnrollmentRepository } from '@/backend/marketing/infrastructure/persistence/firebase.enrollment.repository';
import { initFirebaseAdminApp } from '@/backend/shared/infrastructure/firebase/admin-app';

// Pixel transparente PNG 1x1 base64
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

export async function GET(req: NextRequest) {
    try {
        initFirebaseAdminApp();
        const { searchParams } = new URL(req.url);
        const enrollmentId = searchParams.get('eid');

        if (enrollmentId) {
            const repo = new FirebaseEnrollmentRepository();
            const enrollment = await repo.findById(enrollmentId);
            
            if (enrollment) {
                enrollment.markAsOpened();
                await repo.save(enrollment);
                console.log(`[Tracking] Email ABIERTO por el prospecto. Enrollment actualizado: ${enrollmentId}`);
            }
        }
    } catch (e) {
        console.error("[Tracking] Error de Píxel:", e);
    }

    // Siempre devolvemos la imagen 1x1 para que el gestor de correos no detecte error
    return new NextResponse(pixel, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
        }
    });
}
