'use client';

import { useState, useEffect } from 'react';
import { useWidgetContext } from '@/context/budget-widget-context';
import { AgendaBooking } from '@/components/budget-widget/agenda-booking';
import { saveLeadFeedbackAction } from '@/actions/lead/save-lead-feedback.action';
import { getLeadAction } from '@/actions/lead/get-lead.action';
import { CheckCircle2, Clock, Sparkles, Loader2, EuroIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function WizardSuccessPage() {
    const { leadId } = useWidgetContext();
    const { toast } = useToast();
    const t = useTranslations('budgetRequest.successPage');

    const [leadName, setLeadName] = useState<string | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    const [selectedPricing, setSelectedPricing] = useState<string | null>(null);
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [frictionText, setFrictionText] = useState('');
    const [customBudget, setCustomBudget] = useState('');
    const [showCustomBudget, setShowCustomBudget] = useState(false);

    useEffect(() => {
        if (!leadId) {
            setIsLoadingUser(false);
            return;
        }
        getLeadAction(leadId).then((res) => {
            if (res.success && res.data?.name) {
                // Extracts first name
                setLeadName(res.data.name.split(' ')[0]);
                if (res.data.hasFeedback) setFeedbackSent(true);
            }
            setIsLoadingUser(false);
        });
    }, [leadId]);

    const pricingOptions = [
        {
            value: '<7k',
            label: t('pricingOptions.tier0'),
            desc: t('pricingOptions.tier0Desc'),
        },
        {
            value: '7k-15k',
            label: t('pricingOptions.tier1'),
            desc: t('pricingOptions.tier1Desc'),
        },
        {
            value: '15k-40k',
            label: t('pricingOptions.tier2'),
            desc: t('pricingOptions.tier2Desc'),
        },
        {
            value: '40k-120k',
            label: t('pricingOptions.tier3'),
            desc: t('pricingOptions.tier3Desc'),
        },
        {
            value: '+120k',
            label: t('pricingOptions.tier4'),
            desc: t('pricingOptions.tier4Desc'),
        },
        {
            value: 'custom',
            label: t('pricingOptions.custom'),
            desc: t('pricingOptions.customDesc'),
        },
    ];

    const handlePricingSelect = async (val: string) => {
        setSelectedPricing(val);

        if (val === 'custom') {
            setShowCustomBudget(true);
            return;
        }

        if (!leadId) {
            // Mock success if testing directly without Context
            setFeedbackSent(true);
            toast({ description: t('surveyThanks') });
            return;
        }

        setSubmittingFeedback(true);
        const result = await saveLeadFeedbackAction(leadId, { willingToPay: val });
        setSubmittingFeedback(false);

        if (result.success) {
            setFeedbackSent(true);
            toast({ description: t('surveyThanks') });
        } else {
            toast({ variant: 'destructive', description: 'Error guardando respuesta.' });
        }
    };

    const handleCustomBudgetSubmit = async () => {
        if (!leadId) {
            setFeedbackSent(true);
            toast({ description: t('surveyThanks') });
            return;
        }
        setSubmittingFeedback(true);
        const result = await saveLeadFeedbackAction(leadId, {
            willingToPay: 'custom',
            customBudget: customBudget || 'No indicado',
        });
        setSubmittingFeedback(false);
        if (result.success) {
            setFeedbackSent(true);
            toast({ description: t('surveyThanks') });
        }
    };

    const handleFrictionSubmit = async () => {
        if (!leadId || !frictionText.trim()) return;
        setSubmittingFeedback(true);
        await saveLeadFeedbackAction(leadId, { friction: frictionText });
        setSubmittingFeedback(false);
        setFrictionText('');
        toast({ description: t('surveyThanks') });
    };

    const titleStr = leadName ? `¡Listo, ${leadName}!` : t('title');

    return (
        <div className="flex flex-col lg:flex-row min-h-[100dvh] w-full bg-background overflow-hidden relative pt-16 lg:pt-0">

            {/* Background elements to unify the look */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            {/* ─── Left Side: Success & Survey ─── */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-start lg:justify-center p-6 lg:p-12 xl:p-20 z-10 custom-scrollbar overflow-y-auto">

                <div className="w-full max-w-lg mx-auto flex flex-col items-center lg:items-start text-center lg:text-left">
                    {/* Hero */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
                        <div className="mx-auto lg:mx-0 h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-2xl shadow-primary/20 mb-8 relative border border-border/20">
                            <CheckCircle2 className="h-10 w-10 text-white relative z-10" />
                            <div className="absolute inset-0 rounded-2xl bg-white animate-ping opacity-20 duration-1000" />
                        </div>

                        {isLoadingUser ? (
                            <div className="h-12 w-64 bg-muted animate-pulse rounded-lg mb-4 mx-auto lg:mx-0" />
                        ) : (
                            <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-foreground mb-4 tracking-tight drop-shadow-sm">
                                {titleStr}
                            </h1>
                        )}

                        <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto lg:mx-0">
                            {t('description')}
                        </p>
                    </div>

                    {/* Survey Card */}
                    <div className="w-full bg-secondary/30 backdrop-blur-xl border border-border/30 rounded-3xl p-6 lg:p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none">
                            <Sparkles className="w-40 h-40 text-primary rotate-12" />
                        </div>

                        <AnimatePresence mode="wait">

                            {/* Step 1 — pricing options */}
                            {!feedbackSent && !showCustomBudget && (
                                <motion.div key="pricing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                            <EuroIcon className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="font-bold text-xl text-foreground tracking-tight">{t('surveyTitle')}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{t('surveyQuestion')}</p>

                                    <div className="space-y-3">
                                        {pricingOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => handlePricingSelect(opt.value)}
                                                disabled={submittingFeedback}
                                                className={`w-full flex items-center justify-between p-4 bg-background/50 hover:bg-background border rounded-2xl transition-all text-left outline-none ${selectedPricing === opt.value ? 'border-primary shadow-[0_0_15px_rgba(232,196,47,0.15)] bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                                            >
                                                <div>
                                                    <p className="font-semibold text-sm text-foreground">{opt.label}</p>
                                                    <p className="text-xs text-muted-foreground mt-1 opacity-80">{opt.desc}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-4 flex items-center justify-center transition-all ${selectedPricing === opt.value ? 'border-primary bg-primary' : 'border-border/50'}`}>
                                                    {selectedPricing === opt.value && <div className="w-2 h-2 rounded-full bg-black" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {submittingFeedback && (
                                        <div className="flex justify-center mt-6"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 1b — custom budget (only if "unknown" selected) */}
                            {!feedbackSent && showCustomBudget && (
                                <motion.div key="custom" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="relative z-10 space-y-5">
                                    <h3 className="font-bold text-xl text-foreground tracking-tight">{t('customBudgetTitle')}</h3>
                                    <p className="text-sm text-muted-foreground">{t('customBudgetQuestion')}</p>
                                    <input
                                        type="text"
                                        value={customBudget}
                                        onChange={(e) => setCustomBudget(e.target.value)}
                                        placeholder={t('customBudgetPlaceholder')}
                                        className="w-full px-5 py-4 bg-background/80 border border-border/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all focus:bg-background"
                                        autoFocus
                                    />
                                    <div className="flex gap-3 pt-2">
                                        <Button variant="ghost" className="flex-1 rounded-xl hover:bg-secondary" onClick={() => { setShowCustomBudget(false); setSelectedPricing(null); }}>
                                            {t('customBudgetBack')}
                                        </Button>
                                        <Button className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" onClick={handleCustomBudgetSubmit} disabled={submittingFeedback || !customBudget.trim()}>
                                            {submittingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : t('customBudgetSubmit')}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2 — thanks + friction */}
                            {feedbackSent && (
                                <motion.div key="thanks" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 space-y-6">
                                    <div className="p-5 bg-primary/10 border border-primary/20 text-primary rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2 shadow-inner">
                                        <CheckCircle2 className="w-5 h-5" />
                                        {t('surveyThanks')}
                                    </div>
                                    <div className="pt-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">{t('frictionLabel')}</label>
                                        <textarea
                                            value={frictionText}
                                            onChange={(e) => setFrictionText(e.target.value)}
                                            placeholder={t('frictionPlaceholder')}
                                            className="w-full bg-background/50 border border-border/30 rounded-2xl p-4 text-sm min-h-[100px] resize-none focus:ring-2 focus:ring-primary/50 mb-4 text-foreground placeholder:text-muted-foreground/50 transition-all focus:bg-background"
                                        />
                                        <Button variant="outline" className="w-full rounded-xl border-border/30 hover:bg-secondary hover:text-foreground" onClick={handleFrictionSubmit} disabled={!frictionText.trim() || submittingFeedback}>
                                            {submittingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : t('frictionSubmit')}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* ROI Badge */}
                    <div className="w-full mt-8 animate-in fade-in duration-1000 delay-300">
                        <p className="text-sm font-medium text-center text-muted-foreground/80 bg-background/30 backdrop-blur-md py-3 px-6 rounded-full border border-border/20 inline-flex items-center gap-2 justify-center w-full">
                            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                            {t('roiPrefix')} <span className="font-bold line-through mx-1 opacity-50 px-1 bg-secondary/50 rounded">{t('roiStrikethrough')}</span> <span className="text-primary font-bold">{t('roiSuffix')}</span>
                        </p>
                    </div>
                </div>

            </div>

            {/* ─── Right Side: Agenda ─── */}
            <div className="w-full lg:w-1/2 bg-secondary/40 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-border/30 overflow-y-auto relative flex items-start lg:items-center justify-center p-0 lg:p-8 pb-20 lg:pb-8 z-10 custom-scrollbar">

                {/* Refined Agenda Container */}
                <div className="w-full max-w-[540px] bg-background lg:bg-white/80 dark:lg:bg-zinc-900/80 lg:backdrop-blur-xl lg:rounded-3xl shadow-none lg:shadow-2xl border-none lg:border lg:border-border/30 overflow-hidden flex flex-col min-h-full lg:min-h-[auto]">

                    {/* FOMO header (Integrated beautifully) */}
                    <div className="bg-gradient-to-r from-primary/20 to-transparent border-b border-primary/20 px-6 py-5 lg:py-6 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary leading-none">{t('fomoStep')}</span>
                            </div>
                            <h2 className="text-lg lg:text-xl font-bold text-foreground tracking-tight leading-tight">{t('fomoTitle')}</h2>
                        </div>
                        <div className="hidden sm:block">
                            <div className="bg-secondary/80 dark:bg-black/40 border border-primary/30 px-3 py-1.5 rounded-full text-xs font-semibold text-primary/90 whitespace-nowrap shadow-inner">
                                {t('fomoBadge')}
                            </div>
                        </div>
                    </div>

                    <div className="p-0 sm:p-2 lg:p-4 flex-1">
                        <AgendaBooking />
                    </div>
                </div>
            </div>
        </div>
    );
}
