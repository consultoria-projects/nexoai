'use client';

import { useState, useEffect } from 'react';
import { getAvailableSlotsAction, createBookingFromLeadAction } from '@/actions/agenda/booking.action';
import { CalendarDays, Clock, CheckCircle2, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { useWidgetContext } from '@/context/budget-widget-context';

const ALL_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '16:00', '16:30', '17:00', '17:30'
];

export function AgendaBooking() {
    const { leadId, closeWidget } = useWidgetContext();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<Record<string, { startTime: string; endTime: string; isAvailable: boolean }[]>>({});
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    }).filter(d => d.getDay() !== 0 && d.getDay() !== 6);

    useEffect(() => {
        async function loadSlots() {
            setLoading(true);
            const start = new Date();
            const end = new Date();
            end.setDate(end.getDate() + 14);
            try {
                const result = await getAvailableSlotsAction(start.toISOString(), end.toISOString());
                setAvailableSlots(result);
            } catch { }
            setLoading(false);
        }
        loadSlots();
    }, []);

    const handleSubmit = async () => {
        if (!selectedDate || !selectedSlot || !leadId) {
            setError('Faltan datos para la reserva.');
            return;
        }
        setSubmitting(true);
        setError(null);

        // We pass the leadId. The action will need to fetch the lead to get the name/email/phone.
        // Wait, the action signature is: { name, email, phone, date, timeSlot, leadId }
        // Let's create a wrapper or adapt the usage. If we don't have name/email here, we can fetch it or just pass placeholders.
        // Let's modify the action or just call a new action that takes leadId. For now, pass placeholders and the action will link it to the Lead.

        const result = await createBookingFromLeadAction({
            date: selectedDate,
            timeSlot: selectedSlot,
            leadId: leadId
        });

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error ?? 'Error desconocido');
        }
        setSubmitting(false);
    };

    const slotsForDate = selectedDate ? (availableSlots[selectedDate] ?? ALL_SLOTS.map(s => ({ startTime: s, endTime: '', isAvailable: true }))) : [];

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center space-y-6 px-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <div>
                    <h2 className="text-3xl font-display font-bold text-foreground">¡Sesión Confirmada!</h2>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Nos vemos el <strong>{selectedDate}</strong> a las <strong>{selectedSlot}</strong>.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Te hemos enviado una invitación al calendario con el enlace de la videollamada.
                    </p>
                </div>
                <button
                    onClick={closeWidget}
                    className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors w-full max-w-xs"
                >
                    Volver a Inicio
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-h-[550px] animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-2xl mx-auto px-4 pt-8">
            <div className="text-center space-y-2 mb-8">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <Calendar className="w-7 h-7" />
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold">Elige tu horario</h2>
                <p className="text-muted-foreground">Sesión de evaluación técnica con nuestros ingenieros.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {/* Dates */}
                <div className="space-y-4 h-full">
                    <h3 className="font-semibold flex items-center gap-2 text-sm"><CalendarDays className="w-4 h-4 text-primary" /> 1. Cuándo</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {days.map(d => {
                            const key = d.toISOString().split('T')[0];
                            return (
                                <button key={key} onClick={() => { setSelectedDate(key); setSelectedSlot(null); }}
                                    className={`px-3 py-3 rounded-xl text-sm font-medium transition-all border flex flex-col items-center gap-1 ${selectedDate === key ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-card border-border hover:border-primary/50 hover:bg-secondary/20'}`}>
                                    <span className="text-xs uppercase tracking-wider opacity-80">{d.toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                                    <span className="text-lg font-bold">{d.getDate()}</span>
                                    <span className="text-xs opacity-80">{d.toLocaleDateString('es-ES', { month: 'short' })}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Slots */}
                <div className="space-y-4 h-full flex flex-col">
                    <h3 className="font-semibold flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-primary" /> 2. A qué hora</h3>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {!selectedDate ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/10 rounded-2xl border border-dashed border-border p-6 text-center">
                                <CalendarDays className="w-8 h-8 mb-3 opacity-20" />
                                <p className="text-sm">Selecciona una fecha a la izquierda para ver los horarios disponibles.</p>
                            </div>
                        ) : loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {slotsForDate.map(slot => (
                                    <button key={slot.startTime} disabled={!slot.isAvailable}
                                        onClick={() => setSelectedSlot(slot.startTime)}
                                        className={`px-3 py-3 rounded-xl text-sm font-medium transition-all border ${!slot.isAvailable ? 'bg-secondary/10 text-muted-foreground/40 border-border cursor-not-allowed line-through' : selectedSlot === slot.startTime ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-card border-border hover:border-primary/50 hover:bg-secondary/20'}`}>
                                        {slot.startTime}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border mt-auto">
                {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-lg p-3 mb-4 text-center font-medium">{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={!selectedDate || !selectedSlot || submitting}
                    className="w-full h-14 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                    {submitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Confirmando...</>
                    ) : (
                        <><span>Confirmar Reserva</span><ArrowRight className="w-5 h-5" /></>
                    )}
                </button>
            </div>
        </div>
    );
}
