import { LeadRepository } from '../domain/lead-repository';
import { Lead, PersonalInfo, LeadPreferences, LeadVerification } from '../domain/lead';
import { getFirestore } from 'firebase-admin/firestore';
import { initFirebaseAdminApp } from '@/backend/shared/infrastructure/firebase/admin-app';

export class FirestoreLeadRepository implements LeadRepository {
    private db;

    constructor() {
        initFirebaseAdminApp();
        this.db = getFirestore();
    }

    private toDomain(doc: FirebaseFirestore.DocumentSnapshot): Lead {
        const data = doc.data();
        if (!data) throw new Error(`Lead not found for id ${doc.id}`);

        return new Lead(
            doc.id,
            data.personalInfo as PersonalInfo,
            data.preferences as LeadPreferences,
            {
                isVerified: data.verification?.isVerified || false,
                otpCode: data.verification?.otpCode,
                otpExpiresAt: data.verification?.otpExpiresAt?.toDate(),
                verifiedAt: data.verification?.verifiedAt?.toDate(),
                attempts: data.verification?.attempts || 0
            } as LeadVerification,
            data.createdAt?.toDate() || new Date(),
            data.updatedAt?.toDate() || new Date()
        );
    }

    private toPersistence(lead: Lead): any {
        return {
            personalInfo: lead.personalInfo,
            preferences: lead.preferences,
            verification: {
                isVerified: lead.verification.isVerified,
                otpCode: lead.verification.otpCode || null,
                otpExpiresAt: lead.verification.otpExpiresAt || null,
                verifiedAt: lead.verification.verifiedAt || null,
                attempts: lead.verification.attempts
            },
            createdAt: lead.createdAt,
            updatedAt: lead.updatedAt
        };
    }

    async save(lead: Lead): Promise<void> {
        await this.db.collection('leads').doc(lead.id).set(this.toPersistence(lead));
    }

    async findById(id: string): Promise<Lead | null> {
        const doc = await this.db.collection('leads').doc(id).get();
        if (!doc.exists) return null;
        return this.toDomain(doc);
    }

    async findByEmail(email: string): Promise<Lead | null> {
        const snapshot = await this.db.collection('leads')
            .where('personalInfo.email', '==', email)
            .limit(1)
            .get();

        if (snapshot.empty) return null;
        return this.toDomain(snapshot.docs[0]);
    }
}
