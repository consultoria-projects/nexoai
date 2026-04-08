import { adminFirestore } from '@/backend/shared/infrastructure/firebase/admin-app';

export interface GenerationEvent {
    type: string;
    data: any;
    timestamp: number;
}

export async function emitGenerationEvent(id: string, type: string, data: any): Promise<void> {
    try {
        const eventsRef = adminFirestore.collection('pipeline_telemetry').doc(id).collection('events');
        await eventsRef.add({
            job_id: id,
            type: type,
            data: data,
            timestamp: new Date().getTime(),
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000) // TTL for auto-cleanup
        });
    } catch (error) {
        console.error('Error emitting telemetry event:', error);
    }
}

export async function clearGenerationEvents(id: string): Promise<void> {
    try {
        const eventsRef = adminFirestore.collection('pipeline_telemetry').doc(id).collection('events');
        const docs = await eventsRef.get();
        const batch = adminFirestore.batch();
        docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } catch (error) {
        console.error('Error clearing telemetry events:', error);
    }
}
