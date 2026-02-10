'use server';

import { VerifyLeadAccess } from '@/backend/lead/application/verify-lead-access';
import { FirestoreLeadRepository } from '@/backend/lead/infrastructure/firestore-lead-repository';

export async function verifyLeadOtpAction(leadId: string, otpCode: string) {
    try {
        const leadRepo = new FirestoreLeadRepository();
        const useCase = new VerifyLeadAccess(leadRepo);

        const result = await useCase.execute(leadId, otpCode);
        return result; // { success: boolean, error?: string }
    } catch (error: any) {
        console.error('Error verifying OTP:', error);
        return { success: false, error: 'Internal server error' };
    }
}
