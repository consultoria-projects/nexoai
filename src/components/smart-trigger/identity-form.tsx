'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, ArrowRight, ShieldCheck, Mail, Phone, User } from 'lucide-react';
import { requestLeadOtpAction } from '@/actions/lead/request-lead-otp.action';
import { verifyLeadOtpAction } from '@/actions/lead/verify-lead-otp.action';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

const identitySchema = z.object({
    name: z.string().min(2, "El nombre es necesario"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(9, "Teléfono inválido"),
    countryCode: z.string().default('+34'),
});

type IdentityValues = z.infer<typeof identitySchema>;

interface IdentityFormProps {
    onVerified: (leadId: string, data: IdentityValues) => void;
    onBack?: () => void;
    intent: string; // e.g., 'chat', 'wizard'
    dictionary?: any;
}

const countryCodes = [
    { code: '+34', flag: '🇪🇸', country: 'ES' },
    { code: '+1', flag: '🇺🇸', country: 'US' },
    { code: '+44', flag: '🇬🇧', country: 'UK' },
    { code: '+33', flag: '🇫🇷', country: 'FR' },
    { code: '+49', flag: '🇩🇪', country: 'DE' },
    { code: '+39', flag: '🇮🇹', country: 'IT' },
    { code: '+351', flag: '🇵🇹', country: 'PT' },
];

export function IdentityForm({ onVerified, onBack, intent, dictionary }: IdentityFormProps) {
    const [step, setStep] = useState<'contact' | 'otp'>('contact');
    const [isLoading, setIsLoading] = useState(false);
    const [leadId, setLeadId] = useState<string | null>(null);
    const { toast } = useToast();

    // Use dictionary if available, otherwise fallback
    const t = dictionary?.trigger?.identity || {
        title: {
            contact: "Comenzar Proyecto",
            accessTo: "Acceder a",
            otp: "Verificación de Seguridad"
        },
        subtitle: {
            contact: "Tus datos están seguros. Solo los usaremos para gestionar tu proyecto.",
            otp: "Hemos enviado un código seguro a tu email."
        },
        buttons: {
            cancel: "Cancelar"
        },
        form: {
            name: "Nombre Completo",
            email: "Correo Electrónico",
            phone: "Teléfono Móvil",
            country: "País",
            submit: "Continuar",
            verifying: "Verificando...",
            back: "Volver / Corregir",
            placeholders: {
                name: "Tu nombre completo",
                email: "tu@email.com",
                phone: "600 000 000"
            }
        }
    };

    // Helper to get card title from dictionary
    const getCardTitle = (key: string) => {
        const cards = dictionary?.trigger?.cards;

        if (cards) {
            const map: Record<string, string> = {
                'chat': cards.chat?.title,
                'wizard': cards.wizard?.title,
                'new-build': cards.newBuild?.title,
                'reform': cards.reform?.title
            };
            return map[key] || key;
        }

        // Fallback if no dictionary
        const fallbackMap: Record<string, string> = {
            'chat': "Chat Arquitecto",
            'wizard': "Presupuesto Smart",
            'new-build': "Obra Nueva",
            'reform': "Presupuesto Rápido"
        };
        return fallbackMap[key] || key;
    };

    const form = useForm<IdentityValues>({
        resolver: zodResolver(identitySchema),
        defaultValues: { name: '', email: '', phone: '', countryCode: '+34' }
    });

    const onSubmitContact = async (data: IdentityValues) => {
        setIsLoading(true);
        try {
            const fullPhone = `${data.countryCode}${data.phone}`;
            const result = await requestLeadOtpAction(
                { name: data.name, email: data.email, phone: fullPhone },
                { contactMethod: 'email', language: 'es' }
            );

            if (result.success && result.leadId) {
                setLeadId(result.leadId);
                setStep('otp');
                toast({ title: "Código enviado", description: "Revisa tu bandeja de entrada." });
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Error de conexión." });
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifyOtp = async (otp: string) => {
        if (!leadId || otp.length < 6) return;
        setIsLoading(true);
        try {
            const result = await verifyLeadOtpAction(leadId, otp);
            if (result.success) {
                toast({ title: "Verificado", description: "Accediendo a la herramienta..." });
                onVerified(leadId, form.getValues());
            } else {
                toast({ variant: "destructive", title: "Código inválido", description: "Inténtalo de nuevo." });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Error al verificar." });
        } finally {
            setIsLoading(false);
        }
    };

    const displayIntent = getCardTitle(intent);

    return (
        <div className="w-full max-w-md mx-auto relative flex flex-col justify-center">
            <div className="bg-background rounded-3xl shadow-2xl overflow-hidden border border-border/40 relative">
                {/* Header Pattern/Icon */}
                <div className="p-6 pb-8 border-b border-border/40 relative bg-muted/10">
                    {onBack && step === 'contact' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
                            onClick={onBack}
                        >
                            {t.buttons?.cancel || "Cancelar"}
                        </Button>
                    )}

                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-background rounded-full shadow-sm flex items-center justify-center mb-4 text-primary ring-1 ring-border/50 text-glow-primary">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-foreground">
                            {step === 'contact' ? `${t.title.accessTo || 'Acceder a'} ${displayIntent}` : t.title.otp}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto leading-relaxed">
                            {step === 'contact' ? t.subtitle.contact : t.subtitle.otp}
                        </p>
                    </div>
                </div>

                <div className="p-6 pt-6 bg-background">
                    <AnimatePresence mode="wait">
                        {step === 'contact' ? (
                            <motion.div
                                key="contact-form"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                            >
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmitContact)} className="space-y-4">

                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.form.name}</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
                                                            <Input
                                                                placeholder={t.form.placeholders?.name || "Tu nombre completo"}
                                                                {...field}
                                                                className="pl-9 bg-muted/20 border-border/40 focus:bg-muted/40 transition-all h-11 text-foreground placeholder:text-muted-foreground/50 rounded-xl"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.form.email}</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
                                                            <Input
                                                                placeholder={t.form.placeholders?.email || "tu@email.com"}
                                                                {...field}
                                                                className="pl-9 bg-muted/20 border-border/40 focus:bg-muted/40 transition-all h-11 text-foreground placeholder:text-muted-foreground/50 rounded-xl"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-4 gap-2">
                                            <FormField
                                                control={form.control}
                                                name="countryCode"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-1">
                                                        <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">{t.form.country || "País"}</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-muted/20 border-border/40 px-2 h-11 text-foreground rounded-xl">
                                                                    <SelectValue placeholder="+34" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="bg-background border-border/40">
                                                                {countryCodes.map((c) => (
                                                                    <SelectItem key={c.code} value={c.code} className="text-foreground focus:bg-muted">
                                                                        <span className="flex items-center gap-2">
                                                                            <span>{c.flag}</span>
                                                                            <span className="text-xs text-muted-foreground">{c.code}</span>
                                                                        </span>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-3">
                                                        <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.form.phone}</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/70" />
                                                                <Input
                                                                    placeholder={t.form.placeholders?.phone || "600 000 000"}
                                                                    {...field}
                                                                    className="pl-9 bg-muted/20 border-border/40 focus:bg-muted/40 transition-all h-11 text-foreground placeholder:text-muted-foreground/50 rounded-xl"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full mt-4 bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg transition-all h-11 text-base font-medium rounded-xl text-glow-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                            {t.form.submit} <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </form>
                                </Form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col items-center space-y-8 py-4"
                            >
                                <InputOTP maxLength={6} onComplete={onVerifyOtp} disabled={isLoading}>
                                    <InputOTPGroup className="gap-2">
                                        {[0, 1, 2].map((i) => (
                                            <InputOTPSlot
                                                key={i}
                                                index={i}
                                                className="h-14 w-12 border-border/50 bg-muted/20 text-xl rounded-xl text-foreground font-display"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                    <div className="w-2" />
                                    <InputOTPGroup className="gap-2">
                                        {[3, 4, 5].map((i) => (
                                            <InputOTPSlot
                                                key={i}
                                                index={i}
                                                className="h-14 w-12 border-border/50 bg-muted/20 text-xl rounded-xl text-foreground font-display"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>

                                <div className="text-center text-sm min-h-[20px]">
                                    {isLoading && <span className="flex items-center justify-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4 text-primary" /> {t.form.verifying}</span>}
                                </div>

                                <Button variant="ghost" size="sm" onClick={() => setStep('contact')} className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl">
                                    {t.form.back}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Trust badge */}
            <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground/50 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Privacidad garantizada. No compartimos tus datos.
                </p>
            </div>
        </div>
    );
}
