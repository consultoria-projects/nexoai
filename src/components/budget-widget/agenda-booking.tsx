'use client';

import { useState, useEffect } from 'react';
import { getAvailableSlotsAction, createBookingFromLeadAction } from '@/actions/agenda/booking.action';
import { CalendarDays, Clock, CheckCircle2, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { useWidgetContext } from '@/context/budget-widget-context';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ALL_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '16:00', '16:30', '17:00', '17:30'
];

function generateCalendarDays(year: number, month: number): (number | null)[] {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Monday start
    const days: (number | null)[] = Array(offset).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
}

export function AgendaBooking() {
    const { leadId, closeWidget } = useWidgetContext();
    const today = new Date();
    const t = useTranslations('budgetRequest.agenda');

    // We store the full Date object's string "YYYY-MM-DD" in selectedDate for the API
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [availableSlots, setAvailableSlots] = useState<Record<string, { startTime: string; endTime: string; isAvailable: boolean }[]>>({});
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calendarDays = generateCalendarDays(today.getFullYear(), today.getMonth());

    // Fallbacks just in case the JSON is missing arrays
    const monthNames = t.raw('months') || ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dayNames = t.raw('days') || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const getSelectedDateString = (day: number) => {
        const d = new Date(today.getFullYear(), today.getMonth(), day);
        // Ensure YYYY-MM-DD format in local timezone to match expected API format
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dt = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${dt}`;
    };

    useEffect(() => {
        async function loadSlots() {
            setLoading(true);
            const start = new Date(today.getFullYear(), today.getMonth(), 1);
            const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of month
            try {
                const result = await getAvailableSlotsAction(start.toISOString(), end.toISOString());
                setAvailableSlots(result);
            } catch { }
            setLoading(false);
        }
        loadSlots();
    }, []);

    const handleSubmit = async () => {
        if (!selectedDay || !selectedSlot || !leadId) {
            setError(t('errors.missingData') || 'Faltan datos para la reserva.');
            return;
        }
        setSubmitting(true);
        setError(null);

        const dateStr = getSelectedDateString(selectedDay);

        const result = await createBookingFromLeadAction({
            date: dateStr,
            timeSlot: selectedSlot,
            leadId: leadId
        });

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error ?? (t('errors.unknown') || 'Error desconocido'));
        }
        setSubmitting(false);
    };

    const slotsForDate = selectedDay ? (availableSlots[getSelectedDateString(selectedDay)] ?? ALL_SLOTS.map(s => ({ startTime: s, endTime: '', isAvailable: true }))) : [];

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center space-y-6 px-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <div>
                    <h2 className="text-3xl font-display font-bold text-foreground">{t('success.title') || '¡Sesión Confirmada!'}</h2>
                    <p className="text-muted-foreground mt-2 text-lg">
                        {t('success.datePrefix') || 'Nos vemos el'} <strong>{selectedDay} {t('success.of') || 'de'} {monthNames[today.getMonth()]}</strong> {t('success.timePrefix') || 'a las'} <strong>{selectedSlot}</strong>.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        {t('success.description') || 'Te hemos enviado una invitación al calendario con el enlace de la videollamada.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-2xl mx-auto flex-1 p-2">

            <div className="text-center space-y-2 mb-6 hidden lg:block">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                    <Calendar className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground">{t('title') || 'Elige tu horario'}</h2>
                <p className="text-muted-foreground text-sm">{t('subtitle') || 'Sesión de evaluación técnica con nuestros ingenieros.'}</p>
            </div>

            <div className="flex flex-col flex-1">
                {/* Calendar Side */}
                <div className="p-2 sm:p-4">
                    <h3 className="text-base sm:text-lg font-bold font-display mb-4 flex items-center justify-center gap-2 text-foreground">
                        <Calendar className="w-5 h-5 text-primary" />
                        {monthNames[today.getMonth()]} {today.getFullYear()}
                    </h3>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((d: string) => (
                            <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1 sm:py-2">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {calendarDays.map((day, i) => {
                            if (day === null) return <div key={`empty-${i}`} />;
                            const isPast = day < today.getDate() && today.getMonth() === new Date().getMonth();
                            const isWeekend = new Date(today.getFullYear(), today.getMonth(), day).getDay() === 0 || new Date(today.getFullYear(), today.getMonth(), day).getDay() === 6;
                            const isDisabled = isPast || isWeekend;
                            const isSelected = selectedDay === day;
                            const isToday = day === today.getDate();

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => { setSelectedDay(day); setSelectedSlot(null); }}
                                    className={`
                                        w-full aspect-square rounded-xl text-sm font-medium transition-all flex items-center justify-center
                                        ${isDisabled ? 'text-muted-foreground/30 cursor-not-allowed' : 'hover:bg-primary/20 cursor-pointer text-foreground/80'}
                                        ${isSelected ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(232,196,47,0.3)] scale-110 font-bold z-10' : ''}
                                        ${isToday && !isSelected ? 'border-2 border-primary/40 text-primary font-bold' : ''}
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Slots Side */}
                <div className="p-2 sm:p-4 mt-2 h-44">
                    <h4 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {t('availableTime') || 'Horarios Disponibles'}
                    </h4>

                    {!selectedDay ? (
                        <div className="flex flex-col items-center justify-center text-muted-foreground/50 bg-secondary/50 rounded-2xl border border-dashed border-border/50 p-6 text-center h-full">
                            <CalendarDays className="w-6 h-6 mb-2 opacity-30 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{t('emptyState') || 'Selecciona un día en el calendario para ver las horas.'}</p>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-3 sm:grid-cols-4 gap-2 overflow-y-auto pr-1 h-full custom-scrollbar"
                        >
                            {slotsForDate.map(slot => (
                                <button
                                    key={slot.startTime}
                                    type="button"
                                    disabled={!slot.isAvailable}
                                    onClick={() => setSelectedSlot(slot.startTime)}
                                    className={`
                                        py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all
                                        ${!slot.isAvailable ? 'bg-secondary/50 text-muted-foreground/30 border-border/20 cursor-not-allowed line-through'
                                            : selectedSlot === slot.startTime
                                                ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(232,196,47,0.3)]'
                                                : 'bg-secondary/50 hover:bg-secondary border-border/50 hover:border-primary/50 text-foreground/80'
                                        }
                                    `}
                                >
                                    {slot.startTime}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-border/30 px-2 sm:px-4 pb-2">
                    {error && <p className="text-xs text-red-400 bg-red-400/10 rounded-lg p-2 mb-3 text-center">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedDay || !selectedSlot || submitting}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                    >
                        {submitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> {t('confirming') || 'Confirmando...'}</>
                        ) : (
                            <><span>{t('confirm') || 'Confirmar Reserva'}</span><ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
