'use client';

import { useWidgetContext } from '@/context/budget-widget-context';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollDirection } from '@/hooks/use-scroll-direction';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

const getTriggerConfig = (mode: string, t: any) => {
    const labels: Record<string, string> = t?.trigger?.modes || {};
    return {
        label: labels[mode] || '',
        icon: null,
        color: ''
    };
};


export function SmartBudgetTrigger({ dictionary }: { dictionary?: any }) {
    const { activeMode, openWidget, isOpen } = useWidgetContext();
    const pathname = usePathname();
    const tTranslations = useTranslations('home');

    // Fallback to dictionary for any other props if needed, but primarily use our new translations
    const ftFallback = { desktopTitle: "¿Hablar con Basis AI?", desktopSubtitle: "Automatiza tu presupuesto en segundos.", mobileTitle: "¿Hablar con Basis AI?", mobileSubtitle: "Cotiza tu obra en segundos." };
    const ft = tTranslations.raw('basis.floatingTrigger') || ftFallback;

    const config = getTriggerConfig('chat', dictionary || {}); // Force styling to chat mode
    // We override Icon and Color for the new brand feel
    const Icon = Sparkles;
    const color = "bg-primary";

    const scrollDirection = useScrollDirection();
    const isVisible = scrollDirection === 'up' || isOpen === false;

    // Don't show if already open or if we are in the dashboard
    if (isOpen || pathname?.includes('/dashboard')) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none"
                >
                    {/* Desktop Banner */}
                    <div className="hidden md:flex justify-end container-limited pointer-events-auto">
                        <div
                            onClick={() => openWidget('chat')} // <-- IMPORTANT: Opens chat directly
                            className={cn(
                                "cursor-pointer group flex items-center gap-4 bg-background border border-border/50 shadow-2xl rounded-full p-2 pl-6 pr-2 hover:scale-105 transition-all duration-300",
                                // "dark:bg-slate-900/90 backdrop-blur-md"
                            )}
                        >
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-foreground">{ft.desktopTitle}</span>
                                <span className="text-xs text-muted-foreground">{ft.desktopSubtitle}</span>
                            </div>
                            <Button size="icon" className={cn("h-12 w-12 rounded-full shadow-lg", color)}>
                                <Icon className="h-6 w-6 text-white" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile App Bar */}
                    <div className="md:hidden pointer-events-auto flex justify-center pb-2">
                        <div
                            onClick={() => openWidget('chat')} // <-- IMPORTANT: Opens chat directly
                            className={cn(
                                "mx-2 w-full max-w-sm cursor-pointer group flex items-center justify-between gap-3 bg-background border border-border/50 shadow-2xl rounded-full p-2 pl-5 pr-2 active:scale-95 transition-all duration-200",
                            )}
                        >
                            <div className="flex flex-col text-left">
                                <span className="font-bold text-sm text-foreground">{ft.mobileTitle}</span>
                                <span className="text-xs text-muted-foreground">{ft.mobileSubtitle}</span>
                            </div>
                            <Button size="icon" className={cn("h-11 w-11 shrink-0 rounded-full shadow-lg", color)}>
                                <Icon className="h-5 w-5 text-white" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
