'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Send, Lock } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CaptureWizardLeadUseCase } from '@/application/marketing/capture_wizard_lead_use_case';
import { useWidgetContext } from '@/context/budget-widget-context';

export function InteractiveWizard() {
    const t = useTranslations('home.basis.wizard');
    const { openWidget } = useWidgetContext();
    const [input, setInput] = useState('');
    const [step, setStep] = useState<'IDLE' | 'LOADING' | 'BLURRED' | 'SUCCESS'>('IDLE');
    const [email, setEmail] = useState('');

    const handleGenerate = () => {
        if (!input.trim()) return;
        setStep('LOADING');
        // Simulate AI generation time then open the real modal
        setTimeout(() => {
            openWidget();
            setStep('IDLE');
            setInput('');
        }, 2800);
    };

    const captureLead = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        // Simulate Server Action 
        setStep('SUCCESS');
        // Here we would call a server action that invokes the CaptureWizardLeadUseCase
    };

    const loadExampleKitchen = () => setInput('Reforma integral de cocina 12m2. Demolición, fontanería nueva, falso techo y alicatado porcelánico.');
    const loadExampleRoof = () => setInput('Impermeabilización de cubierta plana de 150m2 con tela asfáltica doble y pintura de caucho.');

    return (
        <section id="wizard" className="py-24 relative bg-background">
            <div className="w-full px-2 md:w-[80vw] md:px-4 max-w-none mx-auto max-w-5xl">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{t('title')}</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                {/* The Wizard Container */}
                <div className="border border-border rounded-2xl bg-card shadow-2xl overflow-hidden relative">

                    {/* Input Area (Only visible when IDLE) */}
                    <AnimatePresence mode="wait">
                        {step === 'IDLE' && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="p-8 md:p-12"
                            >
                                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                                    <button onClick={loadExampleKitchen} className="text-xs bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-colors px-3 py-1 rounded-full whitespace-nowrap border border-border">{t('examples.kitchen')}</button>
                                    <button onClick={loadExampleRoof} className="text-xs bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-colors px-3 py-1 rounded-full whitespace-nowrap border border-border">{t('examples.roof')}</button>
                                </div>

                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t('placeholder')}
                                    className="w-full h-32 bg-transparent border-0 focus:ring-0 text-xl resize-none placeholder:text-muted-foreground/50 p-0"
                                />

                                <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
                                    <span className="text-sm text-muted-foreground flex items-center gap-1"><Sparkles className="w-4 h-4 text-primary" /> {t('analyze')}</span>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={!input.trim()}
                                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {t('generateBtn')} <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Loading State */}
                        {step === 'LOADING' && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="p-16 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]"
                            >
                                <div className="relative w-16 h-16">
                                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">{t('loadingTitle')}</h3>
                                    <p className="text-muted-foreground">{t('loadingDesc')}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Blurred Lead Wall State */}
                        {step === 'BLURRED' && (
                            <motion.div
                                key="blurred"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="relative p-8 md:p-12 min-h-[500px]"
                            >
                                <div className="flex justify-between items-start mb-8 border-b border-border pb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold">{t('proposalTitle')}</h3>
                                        <p className="text-muted-foreground mt-1">{t('proposalDesc')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">{t('estimatedBudget')}</p>
                                        <p className="text-3xl font-bold text-primary">5.240,00 €</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between py-2"><span className="font-semibold">01. Demoliciones y Actuaciones Previas</span><span>430,00 €</span></div>
                                    <div className="flex justify-between py-2"><span className="font-semibold">02. Albañilería y Revestimientos</span><span>1.850,00 €</span></div>

                                    {/* The Blurred Part */}
                                    <div className="relative mt-4">
                                        <div className="blur-sm select-none opacity-50 space-y-4 pointer-events-none">
                                            <div className="flex justify-between py-2"><span className="font-semibold">03. Fontanería y Saneamiento</span><span>950,00 €</span></div>
                                            <div className="pl-4 text-sm"><p className="mb-1">- Tubería multicapa 16mm (24 ml)</p><p>- Bote sifónico y conexiones</p></div>
                                            <div className="flex justify-between py-2"><span className="font-semibold">04. Electricidad</span><span>710,00 €</span></div>
                                            <div className="pl-4 text-sm"><p className="mb-1">- Mecanismos Simon 82 (8 ud)</p></div>
                                        </div>

                                        {/* The Gated Form Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm -m-8 p-8 flex-col text-center">
                                            <div className="bg-background border border-border p-8 rounded-2xl max-w-md w-full shadow-2xl">
                                                <Lock className="w-8 h-8 mx-auto mb-4 text-primary" />
                                                <h4 className="text-xl font-bold mb-2">{t('readyTitle')}</h4>
                                                <p className="text-sm text-muted-foreground mb-6">{t('readyDesc')}</p>
                                                <form onSubmit={captureLead} className="flex flex-col gap-3">
                                                    <input
                                                        type="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder={t('emailPlaceholder')}
                                                        className="bg-muted px-4 py-3 rounded-lg border-none focus:ring-1 focus:ring-primary w-full outline-none"
                                                    />
                                                    <button type="submit" className="bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors">
                                                        {t('sendBtn')}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Success / Upsell State */}
                        {step === 'SUCCESS' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="p-10 md:p-16 text-center min-h-[400px] flex flex-col justify-center items-center"
                            >
                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">{t('successTitle')}</h3>
                                <p className="text-lg text-muted-foreground max-w-lg mb-8">
                                    {t.rich('successDesc', {
                                        strong: (chunks) => <strong>{chunks}</strong>
                                    })}
                                </p>

                                <div className="p-6 bg-muted/50 rounded-xl border border-border max-w-md w-full text-left mb-8">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">{t('upsellTitle')}</h4>
                                    <ul className="space-y-2 text-sm text-foreground/80">
                                        {t.raw('upsellFeatures').map((feature: string, idx: number) => (
                                            <li key={idx}>✓ {feature}</li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => {
                                        const el = document.getElementById('agenda-section');
                                        el?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
                                >
                                    {t('demoBtn')}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </section>
    );
}
