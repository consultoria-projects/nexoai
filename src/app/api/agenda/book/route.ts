import { NextResponse } from 'next/server';
import { CreateBookingUseCase } from '@/backend/agenda/application/create-booking.usecase';
import { FirestoreBookingRepository } from '@/backend/agenda/infrastructure/firestore-booking-repository';
import { FirestoreAvailabilityRepository } from '@/backend/agenda/infrastructure/firestore-availability-repository';
import { EventDispatcher } from '@/backend/shared/events/event-dispatcher';
import { GoogleCalendarService } from '@/backend/shared/infrastructure/google/google-calendar.service';

// Event Listeners Mappings
import { MoveDealStageUseCase } from '@/backend/crm/application/move-deal-stage.usecase';
import { FirebaseDealRepository } from '@/backend/crm/infrastructure/persistence/firebase.deal.repository';
import { NotifyAdminOnBookingUseCase } from '@/backend/crm/application/notify-admin-on-booking.usecase';

import { HandleBookingConfirmedUseCase } from '@/backend/marketing/application/handle-booking-confirmed.usecase';
import { FirebaseEnrollmentRepository } from '@/backend/marketing/infrastructure/persistence/firebase.enrollment.repository';
import { FirebaseEmailProvider } from '@/backend/marketing/infrastructure/messaging/firebase-email.provider';
import { EnrollLeadInSequenceUseCase } from '@/backend/marketing/application/enroll-lead-in-sequence.usecase';
import { FirebaseSequenceRepository } from '@/backend/marketing/infrastructure/persistence/firebase.sequence.repository';
import { FirestoreLeadRepository } from '@/backend/lead/infrastructure/firestore-lead-repository';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const bookingRepo = new FirestoreBookingRepository();
        const availabilityRepo = new FirestoreAvailabilityRepository();
        const eventBus = EventDispatcher.getInstance();
        const googleCalendarService = new GoogleCalendarService();

        // --- Wiring Listeners (Side-Effects) ---
        
        // Listener CRM: Move Deal
        const dealRepo = new FirebaseDealRepository();
        const moveDealStage = new MoveDealStageUseCase(dealRepo);
        eventBus.register('BookingConfirmedEvent', moveDealStage);

        // Listener Admin: Alert Sales Team
        const emailProvider = new FirebaseEmailProvider();
        const notifyAdmin = new NotifyAdminOnBookingUseCase(emailProvider);
        eventBus.register('BookingConfirmedEvent', notifyAdmin);

        // Listener Marketing: Cancel Nurturing + Start Reminders
        const sequenceRepo = new FirebaseSequenceRepository();
        const enrollmentRepo = new FirebaseEnrollmentRepository();
        const leadRepo = new FirestoreLeadRepository();
        const enrollUseCase = new EnrollLeadInSequenceUseCase(sequenceRepo, enrollmentRepo);
        const handleBookingConfirmed = new HandleBookingConfirmedUseCase(enrollmentRepo, enrollUseCase);
        eventBus.register('BookingConfirmedEvent', handleBookingConfirmed);

        // Uso del Caso de Uso Principal
        const createBookingUseCase = new CreateBookingUseCase(bookingRepo, availabilityRepo, eventBus, googleCalendarService);

        const newBooking = await createBookingUseCase.execute({
            name: body.name,
            email: body.email,
            phone: body.phone,
            dateISO: body.dateISO,
            timeSlot: body.timeSlot,
            leadId: body.leadId // Opcional, si viene del embudo autenticado
        });

        // Respuesta Exitosa FrontEnd
        return NextResponse.json({
            success: true,
            message: 'Booking successfully confirmed and CRM states updated.',
            data: newBooking
        });

    } catch (error: any) {
        console.error('[Agenda Endpoint Error]', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
