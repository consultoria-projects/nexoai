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
    const { openWidget, setInitialPrompt } = useWidgetContext();
    const [input, setInput] = useState('');
    const [step, setStep] = useState<'IDLE' | 'LOADING' | 'BLURRED' | 'SUCCESS'>('IDLE');
    const [email, setEmail] = useState('');

    const handleGenerate = () => {
        if (!input.trim()) return;
        setStep('LOADING');
        // Simulate AI generation time then open the real modal
        setTimeout(() => {
            setInitialPrompt(input);
            openWidget('chat');
            setStep('IDLE');
            // Do NOT clear input here so they see what they typed behind the blur if they dismiss it
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
            <div className="w-full px-4 md:w-[80vw] md:px-0 mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{t('title')}</h2>
                </div>

                {/* The Wizard Container */}
                <div className="border border-border rounded-2xl bg-card shadow-2xl overflow-hidden relative max-w-4xl mx-auto flex flex-col h-[500px]">

                    {/* Chat Header */}
                    <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/30">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Basis AI</h3>
                            <p className="text-xs text-muted-foreground">Asistente Técnico</p>
                        </div>
                    </div>

                    {/* Chat Content Area */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-black/20">
                        <AnimatePresence mode="popLayout">
                            {/* Initial AI Message */}
                            <motion.div
                                key="ai-hello"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="flex items-start gap-4"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div className="bg-white dark:bg-zinc-900 border border-border p-4 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]">
                                    <p className="text-sm">
                                        ¡Hola! Soy B<span className="text-primary text-[1.05em] font-medium">a</span>s<span className="text-primary text-[1.05em] font-medium">i</span>s. ¿Qué proyecto necesitas presupuestar hoy?
                                    </p>
                                </div>
                            </motion.div>

                            {/* User Examples (Only show if input is empty and not loading) */}
                            {step === 'IDLE' && input.length === 0 && (
                                <motion.div
                                    key="examples"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col gap-2 ml-12"
                                >
                                    <button onClick={loadExampleKitchen} className="text-xs bg-white dark:bg-zinc-900 hover:bg-primary/5 transition-colors px-4 py-2 rounded-xl border border-border text-left w-fit shadow-sm text-foreground/80">{t('examples.kitchen')}</button>
                                    <button onClick={loadExampleRoof} className="text-xs bg-white dark:bg-zinc-900 hover:bg-primary/5 transition-colors px-4 py-2 rounded-xl border border-border text-left w-fit shadow-sm text-foreground/80">{t('examples.roof')}</button>
                                </motion.div>
                            )}

                            {/* User Message (When generated) */}
                            {step === 'LOADING' && (
                                <motion.div
                                    key="user-msg"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-4 justify-end"
                                >
                                    <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%]">
                                        <p className="text-sm whitespace-pre-wrap">{input}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* AI Typing Indicator */}
                            {step === 'LOADING' && (
                                <motion.div
                                    key="ai-typing"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900 border border-border p-4 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%] flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="text-xs text-muted-foreground ml-2">{t('loadingTitle')}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Chat Input Area (Only visible in IDLE) */}
                    <AnimatePresence>
                        {step === 'IDLE' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="p-4 border-t border-border bg-background">
                                <div className="relative flex items-end gap-2 bg-muted/50 border border-border rounded-xl p-2 focus-within:ring-1 focus-within:ring-primary/50 transition-shadow">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={t('placeholder')}
                                        className="w-full max-h-32 min-h-[44px] bg-transparent border-0 focus:ring-0 text-sm resize-none placeholder:text-muted-foreground py-3 px-2 focus:outline-none"
                                        rows={1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleGenerate();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleGenerate}
                                        disabled={!input.trim()}
                                        className="h-10 w-10 shrink-0 md:h-11 md:w-auto md:px-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        <span className="hidden md:inline">{t('generateBtn')}</span>
                                        <Send className="w-4 h-4 ml-0 md:ml-1" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
