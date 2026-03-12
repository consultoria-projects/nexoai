'use client';

import { useWidgetContext, BudgetMode } from '@/context/budget-widget-context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IdentityForm } from './identity-form';
import { ProfilingWizard, WizardAction } from '@/components/onboarding/profiling-wizard';
import { AnimatePresence, motion } from 'framer-motion';

export function SmartTriggerContainer({ dictionary, intent }: { dictionary?: any; intent?: BudgetMode }) {
    const { openWidget, setLeadId, closeWidget } = useWidgetContext();
    const [step, setStep] = useState<'identity' | 'profiling'>('identity');
    const [tempLeadId, setTempLeadId] = useState<string | null>(null);
    const [isCheckingProfile, setIsCheckingProfile] = useState(false);
    const router = useRouter();

    // We assume the intent is ALWAYS 'chat' for this specific container since we removed the options list, 
    // unless another valid tool intent is passed (like agenda, wizard, new-build, etc.)
    const effectiveMode = intent || 'chat';

    const handleVerified = async (leadId: string, data?: any) => {
        setTempLeadId(leadId);
        setIsCheckingProfile(true);

        try {
            const { getLeadByIdAction } = await import('@/actions/lead/dashboard.action');
            const lead = await getLeadByIdAction(leadId);

            if (lead && lead.profile && lead.profile.companyName && lead.profile.biggestPain && lead.profile.biggestPain.length > 0) {
                // If the user already generated a budget, redirect to the Editor
                if (lead.demoBudgetsGenerated > 0) {
                    const { getPublicDemoTraceByLeadIdAction } = await import('@/actions/lead/get-demo-trace.action');
                    const traceResult = await getPublicDemoTraceByLeadIdAction(leadId);
                    
                    if (traceResult.success && traceResult.traceId) {
                        setLeadId(leadId);
                        closeWidget();
                        router.push(`/es/demo/viewer/${traceResult.traceId}`);
                        return; // Stop flow and wait for redirect
                    }
                }

                // If user is already profiled and no budget, skip the profiling multistep form
                setLeadId(leadId);
                openWidget(effectiveMode);
            } else {
                // Enforce the profiling step for all new or incomplete leads after OTP
                setStep('profiling');
            }
        } catch (error) {
            console.error("Error checking lead profile", error);
            setStep('profiling'); // Fallback to profiling if error
        } finally {
            setIsCheckingProfile(false);
        }
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
        <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col w-full bg-background md:rounded-xl">
            <AnimatePresence mode="wait">
                {step === 'identity' ? (
                    <motion.div
                        key="identity-form"
                        initial={{ opacity: 0, x: 20, y: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: -20, y: 0 }}
                        className="w-full h-full min-h-0 flex flex-col pt-10 px-4"
                    >
                        <div className="w-full max-w-md mx-auto">
                            {isCheckingProfile ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin mb-4" />
                                    <p className="text-muted-foreground text-sm">Validando perfil...</p>
                                </div>
                            ) : (
                                <IdentityForm
                                    onVerified={handleVerified}
                                    onBack={handleBack}
                                    intent={effectiveMode}
                                    dictionary={dictionary}
                                />
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="profiling-wizard"
                        initial={{ opacity: 0, x: 0, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 0, y: -20 }}
                        className="w-full h-full min-h-0 flex flex-col pt-10 px-2 sm:px-4"
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
