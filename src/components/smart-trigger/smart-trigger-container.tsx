'use client';

import { useWidgetContext, BudgetMode } from '@/context/budget-widget-context';
import { useState } from 'react';
import { IdentityForm } from './identity-form';
import { ProfilingWizard, WizardAction } from '@/components/onboarding/profiling-wizard';
import { AnimatePresence, motion } from 'framer-motion';

export function SmartTriggerContainer({ dictionary, intent }: { dictionary?: any; intent?: BudgetMode }) {
    const { openWidget, setLeadId, closeWidget } = useWidgetContext();
    const [step, setStep] = useState<'identity' | 'profiling'>('identity');
    const [tempLeadId, setTempLeadId] = useState<string | null>(null);

    // We assume the intent is ALWAYS 'chat' for this specific container since we removed the options list, 
    // unless another valid tool intent is passed (like agenda, wizard, new-build, etc.)
    const effectiveMode = intent || 'chat';

    const handleVerified = (leadId: string, data?: any) => {
        // Enforce the profiling step for all leads after OTP
        setTempLeadId(leadId);
        setStep('profiling');
    };

    const handleProfilingComplete = () => {
        if (tempLeadId) {
            setLeadId(tempLeadId);
            openWidget(effectiveMode);
        }
    };

    const handleBack = () => {
        closeWidget(); // The modal will close instead of going back to the option list
    };

    const intendedAction: WizardAction = effectiveMode === 'agenda' ? 'agenda' : 'tool';

    return (
        <div className="h-full min-h-[550px] relative overflow-y-auto flex flex-col w-full bg-background md:rounded-xl">
            <AnimatePresence mode="wait">
                {step === 'identity' ? (
                    <motion.div
                        key="identity-form"
                        initial={{ opacity: 0, x: 20, y: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: -20, y: 0 }}
                        className="w-full h-full flex flex-col pt-10 px-4"
                    >
                        <div className="w-full max-w-md mx-auto">
                            <IdentityForm
                                onVerified={handleVerified}
                                onBack={handleBack}
                                intent={effectiveMode}
                                dictionary={dictionary}
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="profiling-wizard"
                        initial={{ opacity: 0, x: 0, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 0, y: -20 }}
                        className="w-full h-full flex flex-col pt-10 px-2 sm:px-4"
                    >
                        {tempLeadId && (
                            <ProfilingWizard
                                leadId={tempLeadId}
                                onComplete={handleProfilingComplete}
                                intendedAction={intendedAction}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
