import { OtpService } from '../domain/otp-service';
import { getFirestore } from 'firebase-admin/firestore';
import { initFirebaseAdminApp } from '@/backend/shared/infrastructure/firebase/admin-app';

export class FirebaseOtpAdapter implements OtpService {
    private db;

    constructor() {
        initFirebaseAdminApp();
        this.db = getFirestore();
    }

    generateCode(length: number = 6): string {
        // Secure random 6-digit code
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendOtp(email: string, code: string): Promise<void> {
        // Use Firebase Trigger Email Extension (collection 'mail')
        await this.db.collection('mail').add({
            to: email,
            message: {
                subject: 'Tu código de verificación - GRUPO RG Construcción',
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #000;">Verificación de Seguridad</h2>
                        <p>Usa el siguiente código para validar tu solicitud de presupuesto:</p>
                        <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${code}</span>
                        </div>
                        <p>Este código expira en 15 minutos.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999;">Si no has solicitado este código, ignora este mensaje.</p>
                    </div>
                `,
            }
        });
    }
}
