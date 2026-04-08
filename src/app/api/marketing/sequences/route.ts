import { NextResponse } from 'next/server';
import { FirebaseSequenceRepository } from '@/backend/marketing/infrastructure/persistence/firebase.sequence.repository';

export async function GET() {
    try {
        const repository = new FirebaseSequenceRepository();
        // Return only active sequences to populate the marketing dashboard UI
        const sequences = await repository.findAllActive();
        
        return NextResponse.json({ sequences });
    } catch (error: any) {
        console.error("Error fetching sequences", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
