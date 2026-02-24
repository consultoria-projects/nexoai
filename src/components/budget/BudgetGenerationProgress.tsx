'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileSearch,
    Search,
    Calculator,
    CheckCircle2,
    Loader2,
    Package,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useWidgetContext } from '@/context/budget-widget-context';

export type GenerationStep =
    | 'idle'
    | 'extracting'
    | 'searching'
    | 'calculating'
    | 'complete'
    | 'error';

interface GenerationProgress {
    step: GenerationStep;
    extractedItems?: number;
    matchedItems?: number;
    currentItem?: string;
    error?: string;
}

interface BudgetGenerationProgressProps {
    progress: GenerationProgress;
    className?: string;
}

const steps = [
    { id: 'extracting', label: 'Extrayendo partidas', icon: FileSearch },
    { id: 'searching', label: 'Buscando en Price Book', icon: Search },
    { id: 'calculating', label: 'Calculando precios', icon: Calculator },
    { id: 'complete', label: 'Presupuesto listo', icon: CheckCircle2 },
];

function getStepIndex(step: GenerationStep): number {
    const idx = steps.findIndex(s => s.id === step);
    return idx === -1 ? 0 : idx;
}

export function BudgetGenerationProgress({ progress, className }: BudgetGenerationProgressProps) {
    const t = useTranslations('budgetRequest.demoProgress');
    const { leadId } = useWidgetContext();
    const { step, extractedItems, matchedItems, currentItem, error } = progress;
    const currentStepIndex = getStepIndex(step);

    // Track recently resolved items for inline display
    const [recentItems, setRecentItems] = React.useState<any[]>([]);
    const eventSourceRef = React.useRef<EventSource | null>(null);
    const processedEvents = React.useRef<Set<number>>(new Set());

    React.useEffect(() => {
        if (!leadId || step === 'idle' || step === 'complete' || step === 'error') return;

        // Close existing connection if any
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const url = `/api/budget/stream?leadId=${leadId}`;
        const es = new EventSource(url);
        eventSourceRef.current = es;

        es.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                if (processedEvents.current.has(parsed.timestamp)) return;
                processedEvents.current.add(parsed.timestamp);

                if (parsed.type === 'item_resolved') {
                    setRecentItems(prev => {
                        // Keep only the last 3 items to avoid overwhelming the UI
                        const newItems = [parsed.data, ...prev].slice(0, 3);
                        return newItems;
                    });
                }
            } catch (e) {
                // Ignore parse errors from heartbeats
            }
        };

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [leadId, step]);

    // Helper for formatting currency inline
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);
    };

    if (step === 'idle') return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5 p-5",
                "backdrop-blur-sm shadow-lg shadow-primary/10",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-blue-600 shadow-lg shadow-primary/30">
                    <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-foreground dark:text-white">
                        {t('generating')}
                    </h4>
                    <p className="text-xs text-muted-foreground dark:text-white/50">
                        {step === 'complete' ? t('completed') : t('wait')}
                    </p>
                </div>
            </div>

            {/* Step Progress */}
            <div className="space-y-3 mb-5">
                {steps.map((s, idx) => {
                    const Icon = s.icon;
                    const isActive = s.id === step;
                    const isComplete = idx < currentStepIndex || step === 'complete';
                    const isPending = idx > currentStepIndex && step !== 'complete';

                    return (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300",
                                isActive && "bg-primary/10 ring-1 ring-primary/30",
                                isComplete && "opacity-100",
                                isPending && "opacity-40"
                            )}
                        >
                            <div className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                                isComplete && "bg-green-500/20 text-green-500",
                                isActive && "bg-primary/20 text-primary",
                                isPending && "bg-muted/30 text-muted-foreground"
                            )}>
                                {isActive && step !== 'complete' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : isComplete ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    <Icon className="h-4 w-4" />
                                )}
                            </div>
                            <span className={cn(
                                "text-sm font-medium",
                                isActive && "text-primary dark:text-primary-foreground",
                                isComplete && "text-green-600 dark:text-green-400",
                                isPending && "text-muted-foreground"
                            )}>
                                {t(`steps.${s.id}`)}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Live Stats */}
            <AnimatePresence mode="wait">
                {(extractedItems || matchedItems || currentItem) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-primary/10 pt-4 space-y-2"
                    >
                        {extractedItems && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-muted-foreground dark:text-white/60">
                                    <Package className="h-4 w-4" />
                                    {t('extracted')}
                                </span>
                                <span className="font-mono font-semibold text-primary dark:text-primary-foreground">
                                    {extractedItems}
                                </span>
                            </div>
                        )}
                        {matchedItems !== undefined && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-muted-foreground dark:text-white/60">
                                    <Search className="h-4 w-4" />
                                    {t('matches')}
                                </span>
                                <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                                    {matchedItems} / {extractedItems || '?'}
                                </span>
                            </div>
                        )}
                        {currentItem && (
                            <div className="mt-2 p-2 rounded bg-muted/30 dark:bg-white/5">
                                <p className="text-xs text-muted-foreground dark:text-white/50 truncate">
                                    Procesando: <span className="text-foreground dark:text-white">{currentItem}</span>
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Inline Recent Items Display */}
            <AnimatePresence>
                {recentItems.length > 0 && step !== 'complete' && step !== 'error' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-2 border-t border-primary/10 pt-4"
                    >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Partidas Procesadas
                        </p>
                        {/* Show 2 on mobile, 3 on desktop */}
                        <div className="space-y-2">
                            <AnimatePresence mode="popLayout">
                                {recentItems.slice(0, 2).map((data, idx) => {
                                    const item = data.item;
                                    const isMaterial = data.type === 'MATERIAL';

                                    return (
                                        <motion.div
                                            key={`${item.code || item.sku}-${idx}`}
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                                            exit={{
                                                opacity: 0,
                                                x: idx === 0 ? -60 : 60,
                                                scale: 0.92,
                                            }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 24,
                                                mass: 0.8,
                                                exit: { duration: 0.2, ease: [0.4, 0, 1, 1] },
                                            }}
                                            layout
                                            className={cn(
                                                "p-3 rounded-xl border bg-background/50 dark:bg-zinc-900/50 backdrop-blur-sm",
                                                isMaterial ? "border-amber-200/50 dark:border-amber-900/30" : "border-blue-200/50 dark:border-blue-900/30",
                                                idx === 0 ? "ring-1 ring-primary/20 shadow-sm" : "opacity-70"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={cn(
                                                        "text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider",
                                                        isMaterial ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                                                    )}>
                                                        {isMaterial ? 'Material' : 'Partida'}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                                    {item.code || item.sku || 'N/A'}
                                                </span>
                                            </div>

                                            <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug mb-2">
                                                {item.description || item.name}
                                            </p>

                                            <div className="flex justify-between items-end border-t border-border/50 pt-2 mt-auto">
                                                <p className="text-[10px] text-muted-foreground">
                                                    {item.quantity} {item.unit} x {formatCurrency(item.unitPrice)}
                                                </p>
                                                <span className="text-xs font-bold text-foreground bg-primary/5 px-1.5 py-0.5 rounded">
                                                    {formatCurrency(item.totalPrice)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error State */}
            {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Success Animation */}
            {step === 'complete' && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex justify-center mt-4"
                >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm font-medium">{t('success')}</span>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
