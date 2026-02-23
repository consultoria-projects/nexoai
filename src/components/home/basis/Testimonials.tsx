'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Testimonials() {
    const t = useTranslations('home.basis.testimonials');

    const stats = t.raw('stats');

    return (
        <section className="py-24 bg-background">
            <div className="w-full px-4 md:w-[80vw] md:px-0 mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{t('title')}</h2>
                <p className="text-xl text-muted-foreground mb-16">{t('description')}</p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative bg-secondary/10 border border-border p-10 md:p-16 rounded-3xl"
                >
                    <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/20 rotate-180" />

                    <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8 relative z-10">
                        &quot;{t('quote')}&quot;
                    </blockquote>

                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-muted rounded-full mb-4 border-2 border-primary/20 overflow-hidden">
                            {/* Avatar placeholder */}
                            <div className="w-full h-full bg-gradient-to-tr from-primary/20 to-secondary/50" />
                        </div>
                        <cite className="not-italic font-bold text-lg">{t('authorName')}</cite>
                        <span className="text-muted-foreground">{t('authorRole')}</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-border/50">
                        {stats.map((stat: { value: string, label: string }, idx: number) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
