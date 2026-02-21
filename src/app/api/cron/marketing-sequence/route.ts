import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initFirebaseAdminApp } from '@/backend/shared/infrastructure/firebase/admin-app';
import { EmailSequenceRenderer } from '@/backend/marketing/application/email-sequence-renderer';
import { Lead } from '@/backend/lead/domain/lead';

export async function GET(request: Request) {
    try {
        // Simple security check to make sure this is called by Google Cloud Scheduler
        // We expect an Authorization header with a pre-shared secret
        const authHeader = request.headers.get('Authorization');
        const expectedSecret = process.env.CRON_SECRET;

        if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        initFirebaseAdminApp();
        const db = getFirestore();

        // Find leads that are actively in the pipeline (not finished or rejected)
        const leadsSnapshot = await db.collection('leads')
            .where('status', 'in', ['new', 'profiling', 'nurturing', 'budget_ready'])
            .get();

        const today = new Date();
        const emailsSent = [];

        for (const doc of leadsSnapshot.docs) {
            const leadData = doc.data();
            // Assuming createdAt is a Firestore Timestamp or a string Date
            const createdAtDate = leadData.createdAt?.toDate ? leadData.createdAt.toDate() : new Date(leadData.createdAt);

            if (!createdAtDate || isNaN(createdAtDate.getTime())) continue;

            // Calculate exact difference in days
            const diffTime = Math.abs(today.getTime() - createdAtDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            // Check if today matches any mail sequence day
            const renderedEmail = EmailSequenceRenderer.renderEmail(diffDays, leadData as Partial<Lead>);

            // Basic check to see if we already sent this day's email to this lead
            // (In a true prod system, we'd log the sending explicitly per lead)

            if (renderedEmail) {
                const targetEmail = leadData.personalInfo?.email;
                if (!targetEmail) continue;

                // Enqueue to Firebase Extension "mail" collection
                await db.collection('mail').add({
                    to: targetEmail,
                    message: {
                        subject: renderedEmail.subject,
                        html: renderedEmail.html,
                    },
                    // We can store metadata to avoid resending
                    metadata: {
                        leadId: doc.id,
                        sequenceDay: diffDays,
                        sequenceName: 'wizard-nurture'
                    }
                });

                emailsSent.push({
                    to: targetEmail,
                    day: diffDays
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Marketing sequence processed. Sent ${emailsSent.length} emails.`,
            processed: emailsSent
        });

    } catch (error: any) {
        console.error('Error processing marketing sequence:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
