import { LeadRepository } from '../domain/lead-repository';
import { Lead, PersonalInfo, LeadPreferences, LeadVerification, ClientProfile } from '../domain/lead';
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
            data.profile ? {
                biggestPain: data.profile.biggestPain,
                simultaneousProjects: data.profile.simultaneousProjects,
                currentStack: data.profile.currentStack,
                companyName: data.profile.companyName,
                companySize: data.profile.companySize,
                annualSurveyorSpend: data.profile.annualSurveyorSpend,
                weeklyManualHours: data.profile.weeklyManualHours,
                role: data.profile.role,
                feedback: data.profile.feedback,
                completedAt: data.profile.completedAt?.toDate()
            } as ClientProfile : null,
            data.createdAt?.toDate() || new Date(),
            data.updatedAt?.toDate() || new Date(),
            data.demoBudgetsGenerated || 0
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
            profile: lead.profile ? {
                biggestPain: lead.profile.biggestPain,
                simultaneousProjects: lead.profile.simultaneousProjects,
                currentStack: lead.profile.currentStack,
                companyName: lead.profile.companyName,
                companySize: lead.profile.companySize,
                annualSurveyorSpend: lead.profile.annualSurveyorSpend,
                weeklyManualHours: lead.profile.weeklyManualHours,
                role: lead.profile.role,
                feedback: lead.profile.feedback || null,
                completedAt: lead.profile.completedAt || null
            } : null,
            demoBudgetsGenerated: lead.demoBudgetsGenerated,
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

    async findAll(limit: number, offset: number): Promise<Lead[]> {
        let query = this.db.collection('leads')
            .orderBy('createdAt', 'desc')
            .limit(limit);

        if (offset > 0) {
            const offsetSnap = await this.db.collection('leads')
                .orderBy('createdAt', 'desc')
                .limit(offset)
                .get();

            if (!offsetSnap.empty) {
                const lastDoc = offsetSnap.docs[offsetSnap.docs.length - 1];
                query = query.startAfter(lastDoc);
            }
        }

        const snapshot = await query.get();
        return snapshot.docs.map(doc => this.toDomain(doc));
    }

    async countByStatus(): Promise<{ verified: number; unverified: number; profiled: number }> {
        const allDocs = await this.db.collection('leads').get();
        let verified = 0;
        let unverified = 0;
        let profiled = 0;

        for (const doc of allDocs.docs) {
            const data = doc.data();
            if (data.profile?.completedAt) {
                profiled++;
            } else if (data.verification?.isVerified) {
                verified++;
            } else {
                unverified++;
            }
        }

        return { verified, unverified, profiled };
    }
}
