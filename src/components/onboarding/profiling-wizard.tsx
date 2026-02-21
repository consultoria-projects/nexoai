'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileData, completeProfileAction } from '@/actions/lead/complete-profile.action';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type WizardAction = 'agenda' | 'tool';

interface ProfilingWizardProps {
    leadId: string;
    onComplete: (action: WizardAction) => void;
    intendedAction: WizardAction;
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
        scale: 0.95
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
        }
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 100 : -100,
        opacity: 0,
        scale: 0.95,
        transition: {
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
        }
    })
};

export function ProfilingWizard({ leadId, onComplete, intendedAction }: ProfilingWizardProps) {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations('home');
    const p = t.raw('basis.profiling');

    const [data, setData] = useState<Partial<ProfileData>>({
        biggestPain: [],
        simultaneousProjects: undefined,
        role: undefined,
        annualSurveyorSpend: undefined,
        weeklyManualHours: undefined,
        companyName: '',
        companySize: undefined,
        currentStack: []
    });

    const nextStep = () => {
        setDirection(1);
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (step > 1) {
            setDirection(-1);
            setStep(prev => prev - 1);
        }
    };

    const handleSelect = (field: keyof ProfileData, value: any, autoAdvance = false) => {
        if (field === 'biggestPain' || field === 'currentStack') {
            setData(prev => {
                const arr = (prev[field] as string[]) || [];
                const updated = arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value];
                return { ...prev, [field]: updated };
            });
            return;
        }

        setData(prev => ({ ...prev, [field]: value }));

        // Slight delay before auto-advancing if requested and we have all required fields for this step
        if (autoAdvance) {
            setTimeout(() => {
                if (step === 2 && (data.simultaneousProjects || field === 'simultaneousProjects') && (data.role || field === 'role')) nextStep();
                else if (step === 3 && (data.annualSurveyorSpend || field === 'annualSurveyorSpend') && (data.weeklyManualHours || field === 'weeklyManualHours')) nextStep();
            }, 300);
        }
    };

    const handleSubmit = async () => {
        // Prepare final validation
        if (!data.biggestPain?.length || !data.simultaneousProjects || !data.role ||
            !data.annualSurveyorSpend || !data.weeklyManualHours ||
            !data.companyName || !data.companySize || !data.currentStack?.length) {
            setError(p.common.errorCompleting);
            return;
        }

        setSubmitting(true);
        setError(null);

        const result = await completeProfileAction(leadId, data as ProfileData);

        if (result.success) {
            onComplete(intendedAction);
        } else {
            setError(result.error ?? p.common.unknownError);
            setSubmitting(false);
        }
    };

    // Calculate progression
    const getProgression = () => {
        switch (step) {
            case 1: return 25;
            case 2: return 50;
            case 3: return 75;
            case 4: return 100;
            default: return 0;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col h-full min-h-[500px] justify-between">
            {/* Header & Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {step > 1 ? (
                        <button onClick={prevStep} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="w-9" />
                    )}
                    <div className="text-sm font-medium text-muted-foreground">{p.common.stepIndicator} {step} {p.common.of} 4</div>
                    <div className="w-9" />
                </div>
                <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgression()}%` }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="relative flex-1 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait" custom={direction}>

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="w-full space-y-6"
                        >
                            <div className="text-center space-y-2 mb-8">
                                <h2 className="text-2xl md:text-3xl font-display font-bold">{p.step1.title}</h2>
                                <p className="text-muted-foreground">{p.step1.subtitle}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { value: 'budgeting', label: p.step1.options.budgeting, icon: '📋' },
                                    { value: 'cost-control', label: p.step1.options.costControl, icon: '📊' },
                                    { value: 'certifications', label: p.step1.options.certifications, icon: '🏗️' }
                                ].map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSelect('biggestPain', option.value)}
                                        className={`p-4 md:p-5 flex items-center gap-4 border rounded-2xl transition-all text-left ${data.biggestPain?.includes(option.value as any) ? 'bg-primary/10 border-primary shadow-[0_0_0_1px_rgba(var(--primary),0.5)]' : 'bg-card border-border hover:border-primary/50 hover:bg-secondary/20'}`}
                                    >
                                        <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl ${data.biggestPain?.includes(option.value as any) ? 'bg-primary/20' : 'bg-secondary/50'}`}>
                                            {option.icon}
                                        </div>
                                        <span className="font-medium text-base md:text-lg">{option.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={nextStep}
                                    disabled={!data.biggestPain?.length}
                                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                                >
                                    {p.common.next} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="w-full space-y-8"
                        >
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">{p.step2.title1}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[
                                        { value: '1-3', label: p.step2.options1['1-3'].label, desc: p.step2.options1['1-3'].desc },
                                        { value: '4-10', label: p.step2.options1['4-10'].label, desc: p.step2.options1['4-10'].desc },
                                        { value: '10+', label: p.step2.options1['10+'].label, desc: p.step2.options1['10+'].desc }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSelect('simultaneousProjects', option.value, !!data.role)}
                                            className={`p-4 border rounded-2xl transition-all text-center flex flex-col items-center justify-center gap-1 ${data.simultaneousProjects === option.value ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:border-primary/50'}`}
                                        >
                                            <span className="font-semibold text-lg">{option.label}</span>
                                            <span className="text-xs text-muted-foreground">{option.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">{p.step2.title2}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { value: 'owner', label: p.step2.options2.owner },
                                        { value: 'project-manager', label: p.step2.options2.projectManager },
                                        { value: 'admin', label: p.step2.options2.admin },
                                        { value: 'surveyor', label: p.step2.options2.surveyor }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSelect('role', option.value, !!data.simultaneousProjects)}
                                            className={`py-3 px-2 border rounded-xl transition-all text-center font-medium text-sm ${data.role === option.value ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:border-primary/50'}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={nextStep}
                                    disabled={!data.simultaneousProjects || !data.role}
                                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                                >
                                    {p.common.next} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="w-full space-y-8"
                        >
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">{p.step3.title1}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: '<10k', label: p.step3.options1['<10k'] },
                                        { value: '10-30k', label: p.step3.options1['10-30k'] },
                                        { value: '30-60k', label: p.step3.options1['30-60k'] },
                                        { value: '60k+', label: p.step3.options1['60k+'] }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSelect('annualSurveyorSpend', option.value, !!data.weeklyManualHours)}
                                            className={`py-3 px-4 border rounded-xl transition-all text-center font-medium ${data.annualSurveyorSpend === option.value ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:border-primary/50'}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">{p.step3.title2}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: '<5h', label: p.step3.options2['<5h'] },
                                        { value: '5-15h', label: p.step3.options2['5-15h'] },
                                        { value: '15-30h', label: p.step3.options2['15-30h'] },
                                        { value: '30h+', label: p.step3.options2['30h+'] }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSelect('weeklyManualHours', option.value, !!data.annualSurveyorSpend)}
                                            className={`py-3 px-4 border rounded-xl transition-all text-center font-medium ${data.weeklyManualHours === option.value ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:border-primary/50'}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={nextStep}
                                    disabled={!data.annualSurveyorSpend || !data.weeklyManualHours}
                                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                                >
                                    {p.common.next} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="w-full space-y-8"
                        >
                            <div className="text-center space-y-2 mb-6">
                                <h2 className="text-2xl md:text-3xl font-display font-bold">{p.step4.title}</h2>
                                <p className="text-muted-foreground">{p.step4.subtitle}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">{p.step4.companyNameLabel}</label>
                                    <input
                                        type="text"
                                        value={data.companyName}
                                        onChange={(e) => handleSelect('companyName', e.target.value)}
                                        placeholder={p.step4.companyNamePlaceholder}
                                        className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold">{p.step4.companySizeLabel}</h3>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                        {[
                                            { value: 'solo', label: p.step4.companySizeOptions.solo },
                                            { value: '2-5', label: p.step4.companySizeOptions['2-5'] },
                                            { value: '6-15', label: p.step4.companySizeOptions['6-15'] },
                                            { value: '16-50', label: p.step4.companySizeOptions['16-50'] },
                                            { value: '50+', label: p.step4.companySizeOptions['50+'] }
                                        ].map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSelect('companySize', option.value)}
                                                className={`py-2 px-2 border rounded-lg transition-all text-center text-sm font-medium ${data.companySize === option.value ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:border-primary/50'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold">{p.step4.stackLabel}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {[
                                            { value: 'excel', label: p.step4.stackOptions.excel },
                                            { value: 'presto', label: p.step4.stackOptions.presto },
                                            { value: 'other-erp', label: p.step4.stackOptions.otherErp }
                                        ].map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSelect('currentStack', option.value)}
                                                className={`py-3 px-2 border rounded-xl transition-all text-center font-medium text-sm ${data.currentStack?.includes(option.value as any) ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:border-primary/50'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium text-center">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !data.companyName || !data.companySize || !data.currentStack?.length}
                                    className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors w-full md:w-auto justify-center"
                                >
                                    {submitting ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Finalizando...</>
                                    ) : (
                                        <>{intendedAction === 'agenda' ? 'Siguiente: Fecha y Hora' : 'Siguiente: Ver Demo'} <ArrowRight className="w-5 h-5" /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
