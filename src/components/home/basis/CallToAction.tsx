'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useWidgetContext } from '@/context/budget-widget-context';

export function CallToAction() {
    const t = useTranslations('home.basis.cta');
    const { openWidget } = useWidgetContext();

    return (
        <section className="py-24 relative overflow-hidden bg-primary/5">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full px-2 md:w-[80vw] md:px-4 max-w-none mx-auto relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-display font-bold mb-6"
                        dangerouslySetInnerHTML={{ __html: t.raw('title') }}
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground mb-10 leading-relaxed"
                    >
                        {t('description')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <button
                            onClick={() => openWidget()}
                            className="inline-flex items-center justify-center gap-2 px-8 py-5 text-lg font-medium text-primary-foreground bg-primary rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 w-full sm:w-auto shadow-xl shadow-primary/20"
                        >
                            <span>{t('btnPrimary')}</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                            {t.raw('features').map((feature: string, idx: number) => (
                                <span key={idx} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> {feature}</span>
                            ))}
                        </div>

                        <p
                            className="mt-4 text-sm bg-secondary/30 px-4 py-2 rounded-full border border-border"
                            dangerouslySetInnerHTML={{ __html: t.raw('note').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
