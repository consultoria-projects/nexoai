'use server';

import { FirestoreLeadRepository } from '@/backend/lead/infrastructure/firestore-lead-repository';

export async function getLeadPdfConfigAction(leadId: string) {
    if (!leadId || leadId === 'unassigned') {
        return null;
    }

    try {
        const repository = new FirestoreLeadRepository();
        const lead = await repository.findById(leadId);

        if (!lead) return null;

        let pdfMetadata: any = lead.pdfMetadata || {};
        
        // Pre-fill the client fields, not the issuing company's fields
        if (!pdfMetadata.clientName && lead.profile?.companyName) {
            pdfMetadata.clientName = lead.profile.companyName;
        } else if (!pdfMetadata.clientName && lead.personalInfo?.name) {
            pdfMetadata.clientName = lead.personalInfo.name;
        }

        return Object.keys(pdfMetadata).length > 0 ? pdfMetadata : null;
    } catch (error) {
        console.error("Error fetching PDF config for lead:", error);
        return null;
    }
}
