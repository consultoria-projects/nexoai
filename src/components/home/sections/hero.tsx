'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TextReveal } from '@/components/ui/animated-section';

interface HeroProps {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
}

export function Hero({
    title,
    subtitle,
    description,
    ctaText,
    ctaLink,
    secondaryCtaText,
    secondaryCtaLink,
}: HeroProps) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    // Split title for styling if needed, or simpler display
    // Using a cleaner approach than dangerouslySetInnerHTML

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background Image with Parallax */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2666&auto=format&fit=crop)',
                    }}
                />
                <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
            </motion.div>

            {/* Content */}
            <div className="container-limited relative z-10 text-white text-center md:text-left">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-widest uppercase mb-6 text-primary-foreground">
                        {subtitle}
                    </span>

                    <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
                        {title}
                    </h1>

                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed font-light">
                        {description}
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center md:justify-start">
                        <Link href={ctaLink}>
                            <Button size="xl" className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-full px-8 h-14 text-lg">
                                {ctaText}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>

                        {secondaryCtaText && secondaryCtaLink && (
                            <Link href={secondaryCtaLink}>
                                <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full px-8 h-14 text-lg backdrop-blur-sm">
                                    <Play className="mr-2 w-5 h-5 fill-current" />
                                    {secondaryCtaText}
                                </Button>
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
            </motion.div>
        </section>
    );
}
