'use server';

import { FirestoreLeadRepository } from '@/backend/lead/infrastructure/firestore-lead-repository';
import { BudgetRepositoryFirestore } from '@/backend/budget/infrastructure/budget-repository-firestore';

export async function markDemoPdfDownloadedAction(leadId: string, budgetId?: string) {
    try {
        const leadRepo = new FirestoreLeadRepository();
        const lead = await leadRepo.findById(leadId);

        if (!lead) {
            return { success: false, error: 'Lead not found' };
        }

        // Increment the global counter to eventually freeze the Chat wizard
        lead.incrementDemoPdfs();
        await leadRepo.save(lead);

        // Track local budget lock decoupling (Limit read/write on the specific generated artifact)
        if (budgetId) {
            const budgetRepo = new BudgetRepositoryFirestore();
            const budget = await budgetRepo.findById(budgetId);
            if (budget) {
                budget.isPdfGenerated = true;
                await budgetRepo.save(budget);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error('Error marking demo PDF as downloaded:', error);
        return { success: false, error: 'Internal server error' };
    }
}
