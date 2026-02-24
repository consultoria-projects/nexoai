'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Box, CheckCircle2, Cpu, LineChart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useWidgetContext } from '@/context/budget-widget-context';

const staggerContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 }
    }
};

const fadeSlideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
};

export function Benefits() {
    const t = useTranslations('home.basis.benefits');
    const { openWidget } = useWidgetContext();

    const benefits = [
        {
            icon: Box,
            title: t('items.0.title'),
            description: t('items.0.description'),
            features: t.raw('items.0.features'),
            cta: t('items.0.cta'),
        },
        {
            icon: Cpu,
            title: t('items.1.title'),
            description: t('items.1.description'),
            features: t.raw('items.1.features'),
            cta: t('items.1.cta'),
        },
        {
            icon: LineChart,
            title: t('items.2.title'),
            description: t('items.2.description'),
            features: t.raw('items.2.features'),
            cta: t('items.2.cta'),
        }
    ];

    return (
        <section className="py-24 bg-card relative">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />

            <div className="w-full px-4 md:w-[80vw] md:px-0 mx-auto relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <motion.h2
                        variants={fadeSlideUp}
                        className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground"
                        dangerouslySetInnerHTML={{ __html: t.raw('title') }}
                    />
                    <motion.p variants={fadeSlideUp} className="text-xl text-muted-foreground">
                        {t('description')}
                    </motion.p>
                </motion.div>

                <div className="space-y-24">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={staggerContainer}
                            className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Visual Side */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: index % 2 === 0 ? -60 : 60, scale: 0.95 },
                                    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } }
                                }}
                                className="flex-1 w-full"
                            >
                                <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-background to-secondary/30 border border-border p-2 relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
                                    <video
                                        src={index === 0 ? "/videos/dashboard_projects.mp4" : index === 1 ? "/videos/dashboard_projects_id.mp4" : "/videos/dashboard_expenses.mp4"}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover rounded-xl relative z-10 shadow-lg border border-border/50"
                                    />
                                </div>
                            </motion.div>

                            {/* Content Side */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: index % 2 === 0 ? 60 : -60 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.1 } }
                                }}
                                className="flex-1 space-y-6"
                            >
                                <motion.div variants={fadeSlideUp} className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 mb-4">
                                    <benefit.icon className="w-6 h-6 text-primary" />
                                </motion.div>
                                <motion.h3 variants={fadeSlideUp} className="text-3xl font-bold">{benefit.title}</motion.h3>
                                <motion.p variants={fadeSlideUp} className="text-lg text-muted-foreground leading-relaxed">
                                    {benefit.description}
                                </motion.p>

                                <motion.ul variants={staggerContainer} className="space-y-4 pt-4">
                                    {benefit.features.map((feature: string, fIndex: number) => (
                                        <motion.li key={fIndex} variants={fadeSlideUp} className="flex flex-col gap-1">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                <span className="font-medium">{feature}</span>
                                            </div>
                                        </motion.li>
                                    ))}
                                </motion.ul>

                                <motion.div variants={fadeSlideUp} className="pt-6">
                                    <button
                                        onClick={() => openWidget()}
                                        className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
                                    >
                                        {benefit.cta} <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
