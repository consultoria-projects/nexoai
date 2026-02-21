'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Clock, MessageSquare, TrendingDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PainPoints() {
    const t = useTranslations('home.basis.painPoints');

    const painPoints = [
        {
            icon: TrendingDown,
            title: t('items.0.title'),
            description: t('items.0.description')
        },
        {
            icon: Clock,
            title: t('items.1.title'),
            description: t('items.1.description')
        },
        {
            icon: MessageSquare,
            title: t('items.2.title'),
            description: t('items.2.description')
        },
        {
            icon: AlertTriangle,
            title: t('items.3.title'),
            description: t('items.3.description')
        }
    ];

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="w-full px-2 md:w-[80vw] md:px-4 max-w-none mx-auto">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                        {t('titlePart1')}
                        <span className="text-primary text-glow-primary px-2">{t('titleHighlight')}</span>
                        <br />
                        {t('titlePart3')}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {t('description')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {painPoints.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-secondary/20 border border-border p-8 rounded-2xl flex gap-6 items-start hover:border-primary/50 transition-colors group"
                        >
                            <div className="p-3 bg-background rounded-lg border border-border group-hover:border-primary/50 transition-colors">
                                <point.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{point.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {point.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
