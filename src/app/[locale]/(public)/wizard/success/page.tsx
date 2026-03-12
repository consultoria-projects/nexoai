'use client';

import { useState, useEffect } from 'react';
import { useWidgetContext } from '@/context/budget-widget-context';
import { AgendaBooking } from '@/components/budget-widget/agenda-booking';
import { getLeadAction } from '@/actions/lead/get-lead.action';
import { CheckCircle2, Clock, ArrowLeft, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';

export default function WizardSuccessPage() {
    const { leadId: contextLeadId } = useWidgetContext();
    const searchParams = useSearchParams();
    const leadId = searchParams.get('leadId') || contextLeadId;
    
    const t = useTranslations('budgetRequest.successPage');
    const tAgenda = useTranslations('budgetRequest.agenda');
    const router = useRouter();

    const [leadName, setLeadName] = useState<string | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        if (!leadId) {
            setIsLoadingUser(false);
            return;
        }
        getLeadAction(leadId).then((res) => {
            if (res.success && res.data?.name) {
                // Extracts first name
                setLeadName(res.data.name.split(' ')[0]);
            }
            setIsLoadingUser(false);
        });
    }, [leadId]);

    const titleStr = leadName ? `¡Listo, ${leadName}!` : t('title');

    const scrollToAgenda = () => {
        document.getElementById('agenda-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-[100dvh] w-full bg-background relative overflow-y-auto overflow-x-hidden selection:bg-primary/30 custom-scrollbar pt-16 lg:pt-0">
            {/* ─── Premium Ambient Background ─── */}
            <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute top-[30%] left-[30%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-10000" />
            </div>

            <div className="relative z-10 container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center">
                
                {/* ─── HERO SECTION ─── */}
                <div className="w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-4 lg:mt-8 mb-16">
                    <div className="relative mb-8 group">
                        <div className="absolute inset-0 rounded-[2rem] bg-primary/20 blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse" />
                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-[2rem] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30 border border-white/20 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                            <CheckCircle2 className="h-12 w-12 sm:h-14 sm:w-14 text-white drop-shadow-md" />
                        </div>
                    </div>

                    {isLoadingUser ? (
                        <div className="h-16 w-64 md:w-80 bg-muted/50 animate-pulse rounded-2xl mb-6" />
                    ) : (
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 mb-6 tracking-tight drop-shadow-sm leading-tight pb-2">
                            {titleStr}
                        </h1>
                    )}

                    <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-3xl font-light">
                        {t('description')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center w-full mt-8">
                        <Button 
                            className="w-full sm:w-auto h-14 px-14 rounded-full text-base font-medium shadow-none hover:-translate-y-0.5 transition-all duration-300 bg-primary text-primary-foreground relative overflow-hidden group"
                            onClick={scrollToAgenda}
                        >
                            <span className="relative z-10 flex items-center pr-2">
                                <Rocket className="mr-2 h-4 w-4 opacity-70" />
                                {t('fomoStep')}
                            </span>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full sm:w-auto h-14 px-10 rounded-full text-base shadow-none hover:bg-secondary/50 border-border/30 font-medium transition-all duration-300 hover:-translate-y-0.5 bg-transparent"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 text-muted-foreground opacity-70" />
                            {t('returnButton')}
                        </Button>
                    </div>
                </div>

                {/* ─── CHALLENGER ROI BANNER ─── */}
                <div className="w-full max-w-4xl mt-10 mb-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    <div className="bg-gradient-to-br from-secondary/50 via-background/80 to-secondary/30 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-colors duration-500">
                        {/* Shimmer effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[50px] pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none" />
                        
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div className="inline-flex px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-widest border border-primary/20 shadow-sm">
                                    {t('fomoBadge')}
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
                                    {t('fomoTitle')}
                                </h3>
                            </div>
                            
                            <div className="w-full h-px md:w-px md:h-32 bg-border/50" />
                            
                            <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
                                <div className="flex flex-col items-center justify-center mb-4">
                                    <Clock className="w-8 h-8 text-primary mb-3" />
                                    <span className="text-xl sm:text-2xl font-medium text-muted-foreground">{t('roiPrefix')}</span>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-2">
                                    <span className="text-3xl sm:text-4xl font-extrabold text-muted-foreground/30 line-through decoration-primary/40 decoration-[3px] sm:decoration-[4px]">
                                        {t('roiStrikethrough')}
                                    </span>
                                    <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 drop-shadow-sm">
                                        {t('roiSuffix')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── AGENDA SECTION ─── */}
                <div id="agenda-section" className="w-full max-w-[800px] scroll-mt-24 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                    <div className="bg-background/90 dark:bg-zinc-950/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-border/40 overflow-hidden flex flex-col relative ring-1 ring-white/10 transition-all duration-300 hover:shadow-primary/5 hover:border-border/60">
                        
                        {/* Soft glow behind agenda */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                        <div className="bg-gradient-to-b from-secondary/50 to-transparent px-6 py-10 sm:px-10 sm:py-12 flex flex-col items-center text-center relative z-10 border-b border-border/30">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20 shadow-inner">
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                                {t('fomoStep')}
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-4">
                                {tAgenda('title')}
                            </h2>
                            <p className="text-muted-foreground text-lg sm:text-xl mb-0 max-w-2xl font-light">
                                {tAgenda('subtitle')}
                            </p>
                        </div>

                        <div className="p-4 sm:p-8 lg:p-10 flex-1 relative z-10 bg-background/50">
                            <div className="bg-white/50 dark:bg-black/20 rounded-[2rem] p-2 sm:p-4 border border-border/30 shadow-inner">
                                <AgendaBooking />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-24 w-full" />
            </div>
        </div>
    );
}
