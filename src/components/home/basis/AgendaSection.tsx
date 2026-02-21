'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, ArrowRight, CheckCircle2, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { requestLeadOtpAction } from '@/actions/lead/request-lead-otp.action';
import { verifyLeadOtpAction } from '@/actions/lead/verify-lead-otp.action';
import { createBookingFromLeadAction } from '@/actions/agenda/booking.action';
import { ProfilingWizard } from '@/components/onboarding/profiling-wizard';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const timeSlots = [
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

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } }
};
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } }
};

export function AgendaSection() {
    const t = useTranslations('home.basis');

    const today = new Date();
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [currentStep, setCurrentStep] = useState<'details' | 'otp' | 'profiling' | 'success'>('details');
    const [leadId, setLeadId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    const fallbackAgenda = {
        badge: 'Demo Personalizada',
        titleHighlight: 'Gratuita',
        title: 'Reserva Tu Consulta ',
        description: '30 minutos con un especialista...',
        calendar: { months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], availableTime: 'Horarios Disponibles' },
        form: { title: 'Tus Datos', name: 'Nombre Completo', namePlaceholder: 'Juan Pérez', email: 'Email', emailPlaceholder: 'juan@empresa.com', phone: 'Teléfono', phoneOptional: '(opcional)', phonePlaceholder: '+34 600 000 000', submit: 'Continuar', loading: 'Cargando...', privacy: '🔒 Sin compromiso', summaryText: '30 min · Videollamada' },
        verification: { title: 'Verificación', subtitle: 'Hemos enviado un código', verifying: 'Verificando...' },
        success: { title: '¡Reunión Confirmada!', message: 'Te enviaremos un email' },
        errors: { process: 'Error', invalidCode: 'Código incorrecto', confirmation: 'Error confirmando' }
    };

    const agendaData = t.raw('agenda') || fallbackAgenda;

    const calendarDays = generateCalendarDays(today.getFullYear(), today.getMonth());
    const monthNames = agendaData.calendar?.months || fallbackAgenda.calendar.months;
    const dayNames = agendaData.calendar?.days || fallbackAgenda.calendar.days;

    const handleSubmitDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDay || !selectedSlot || !name || !email) return;
        setLoading(true);
        setError(null);
        try {
            const res = await requestLeadOtpAction(
                { name, email, phone },
                { contactMethod: 'email', language: 'es' }
            );
            if (res.success && res.leadId) {
                setLeadId(res.leadId);
                setCurrentStep('otp');
            } else {
                setError(res.error || agendaData.errors?.process);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (code: string) => {
        if (!leadId || code.length !== 6) return;
        setLoading(true);
        setError(null);
        try {
            const res = await verifyLeadOtpAction(leadId, code);
            if (res.success) {
                setCurrentStep('profiling');
            } else {
                setError(res.error || agendaData.errors?.invalidCode);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleProfilingComplete = async () => {
        if (!leadId || !selectedDay || !selectedSlot) return;
        setLoading(true);
        try {
            const dateObj = new Date(today.getFullYear(), today.getMonth(), selectedDay);
            const res = await createBookingFromLeadAction({
                leadId,
                date: dateObj.toISOString(),
                timeSlot: selectedSlot
            });
            if (res.success) {
                setCurrentStep('success');
            } else {
                setError(res.error || agendaData.errors?.confirmation);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="agenda-section" className="py-24 relative overflow-hidden bg-background">
            {/* Background decorations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] dark:opacity-[0.04]" />
            </div>

            <div className="w-full px-2 md:w-[80vw] md:px-4 max-w-none mx-auto relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={stagger}
                    className="text-center mb-16"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary mb-6">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-semibold uppercase tracking-wide">{agendaData.badge}</span>
                    </motion.div>
                    <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-bold mb-4">
                        {agendaData.title} <span className="text-primary">{agendaData.titleHighlight}</span>
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {agendaData.description}
                    </motion.p>
                </motion.div>

                {currentStep === 'details' && (
                    <motion.form
                        onSubmit={handleSubmitDetails}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                        className="max-w-5xl mx-auto bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">

                            {/* Calendar Side */}
                            <motion.div variants={fadeUp} className="p-8 md:p-10">
                                <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    {monthNames[today.getMonth()]} {today.getFullYear()}
                                </h3>

                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {dayNames.map((d: string) => (
                                        <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
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
                                                onClick={() => setSelectedDay(day)}
                                                className={`
                                                    w-full aspect-square rounded-xl text-sm font-medium transition-all flex items-center justify-center
                                                    ${isDisabled ? 'text-muted-foreground/30 cursor-not-allowed' : 'hover:bg-primary/10 cursor-pointer'}
                                                    ${isSelected ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110' : ''}
                                                    ${isToday && !isSelected ? 'border-2 border-primary/40 text-primary font-bold' : ''}
                                                `}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Time Slots */}
                                {selectedDay && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-8"
                                    >
                                        <h4 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> {agendaData.calendar?.availableTime}
                                        </h4>
                                        <div className="grid grid-cols-4 gap-2">
                                            {timeSlots.map(slot => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`
                                                        py-2.5 rounded-xl text-sm font-medium border transition-all
                                                        ${selectedSlot === slot
                                                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                                                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                                                        }
                                                    `}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Contact Form Side */}
                            <motion.div variants={fadeUp} className="p-8 md:p-10 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        {agendaData.form?.title}
                                    </h3>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-sm font-semibold text-muted-foreground mb-2 block">{agendaData.form?.name}</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    placeholder={agendaData.form?.namePlaceholder}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-secondary/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-muted-foreground mb-2 block">{agendaData.form?.email}</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder={agendaData.form?.emailPlaceholder}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-secondary/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-muted-foreground mb-2 block">{agendaData.form?.phone} <span className="text-muted-foreground/50">{agendaData.form?.phoneOptional}</span></label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={e => setPhone(e.target.value)}
                                                    placeholder={agendaData.form?.phonePlaceholder}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-secondary/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary & Submit */}
                                <div className="mt-8">
                                    {selectedDay && selectedSlot && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center gap-4"
                                        >
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><Calendar className="w-5 h-5" /></div>
                                            <div>
                                                <p className="font-bold text-sm">{selectedDay} {monthNames[today.getMonth()]} {today.getFullYear()}</p>
                                                <p className="text-xs text-muted-foreground">{selectedSlot} · {agendaData.form?.summaryText}</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={!selectedDay || !selectedSlot || !name || !email || loading}
                                        className="w-full py-4 px-8 bg-primary text-primary-foreground font-bold text-lg rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" /> {agendaData.form?.submit}</>}
                                    </button>
                                    <p className="text-center text-xs text-muted-foreground mt-3">
                                        {agendaData.form?.privacy}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.form>
                )}

                {currentStep === 'otp' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto text-center bg-card border border-border rounded-3xl p-10 shadow-2xl space-y-8"
                    >
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold font-display mb-2">{agendaData.verification?.title}</h3>
                            <p className="text-muted-foreground text-sm">
                                {agendaData.verification?.subtitle} <strong>{email}</strong>
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <InputOTP maxLength={6} value={otpCode} onChange={(val) => {
                                setOtpCode(val);
                                if (val.length === 6) handleVerifyOtp(val);
                            }} disabled={loading}>
                                <InputOTPGroup className="gap-2">
                                    <InputOTPSlot index={0} className="w-12 h-14 text-xl rounded-xl border-border bg-secondary/30" />
                                    <InputOTPSlot index={1} className="w-12 h-14 text-xl rounded-xl border-border bg-secondary/30" />
                                    <InputOTPSlot index={2} className="w-12 h-14 text-xl rounded-xl border-border bg-secondary/30" />
                                    <InputOTPSlot index={3} className="w-12 h-14 text-xl rounded-xl border-border bg-secondary/30" />
                                    <InputOTPSlot index={4} className="w-12 h-14 text-xl rounded-xl border-border bg-secondary/30" />
                                    <InputOTPSlot index={5} className="w-12 h-14 text-xl rounded-xl border-border bg-secondary/30" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}
                        {loading && <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {agendaData.verification?.verifying}</p>}
                    </motion.div>
                )}

                {currentStep === 'profiling' && leadId && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto bg-card border border-border rounded-3xl shadow-2xl p-6 md:p-12"
                    >
                        <ProfilingWizard
                            leadId={leadId}
                            intendedAction="agenda"
                            onComplete={handleProfilingComplete}
                        />
                        {loading && (
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-3xl z-50">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}
                        {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
                    </motion.div>
                )}

                {currentStep === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1, transition: { type: 'spring', damping: 15 } }}
                        className="max-w-lg mx-auto text-center bg-card border border-border rounded-3xl p-12 shadow-2xl"
                    >
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-3xl font-display font-bold mb-3">{agendaData.success?.title}</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {agendaData.success?.message} <strong className="text-foreground">{email}</strong>.
                        </p>
                        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 inline-flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="font-bold">{selectedDay} de {monthNames[today.getMonth()]} · {selectedSlot}</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
