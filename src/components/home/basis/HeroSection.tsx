'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Activity, Play, Pause } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useWidgetContext } from '@/context/budget-widget-context';

export function HeroSection() {
    const t = useTranslations('home.basis.hero');
    const { openWidget } = useWidgetContext();

    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const DEMO_VIDEO_URL = 'https://firebasestorage.googleapis.com/v0/b/local-digital-eye.firebasestorage.app/o/basis%2Fbasis.mp4?alt=media&token=f08e27b5-9331-43e5-8f22-fa4802cf287c';

    // Scroll-driven parallax for the video container
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    const videoScale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
    const videoOpacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);
    const videoY = useTransform(scrollYProgress, [0, 0.5], [80, 0]);

    // IntersectionObserver to auto-play video when it scrolls into view
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
            {/* Background Graphic Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-shadow" />
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] dark:opacity-[0.05]" />
            </div>

            <div className="w-full px-2 md:w-[80vw] md:px-6 max-w-none relative z-10 mx-auto mt-20">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

                    {/* Eyebrow Label */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary mb-8"
                    >
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="text-sm font-semibold tracking-wide uppercase">{t('eyebrow')}</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground mb-6"
                    >
                        {t('titlePart1')} <span className="text-primary relative whitespace-nowrap">
                            {t('titlePart2')}
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
                            </svg>
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
                    >
                        {t('description')}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
                    >
                        <button
                            onClick={() => openWidget()}
                            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-primary-foreground bg-primary rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 w-full sm:w-auto shadow-lg shadow-primary/25"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            <span>{t('ctaPrimary')}</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>

                        <button
                            onClick={() => {
                                const el = document.getElementById('agenda-section');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center justify-center gap-1 px-8 py-4 text-base font-medium text-foreground bg-transparent border border-border rounded-lg hover:bg-secondary/10 transition-colors w-full sm:w-auto"
                        >
                            {t('ctaSecondary')}
                            <ChevronRight className="w-4 h-4 opacity-50" />
                        </button>
                    </motion.div>

                    {/* Scroll-Driven Video Embed */}
                    <motion.div
                        style={{ scale: videoScale, opacity: videoOpacity, y: videoY }}
                        className="w-full max-w-5xl mx-auto mt-16 rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10 relative group cursor-pointer"
                        onClick={() => {
                            if (!isPlaying && videoRef.current) {
                                // First click: switch to demo video
                                videoRef.current.src = DEMO_VIDEO_URL;
                                videoRef.current.muted = false;
                                videoRef.current.loop = false;
                                videoRef.current.play().catch(() => { });
                                setIsPlaying(true);
                                setIsPaused(false);
                            } else if (isPlaying && videoRef.current) {
                                // Subsequent clicks: toggle pause/play
                                if (isPaused) {
                                    videoRef.current.play().catch(() => { });
                                    setIsPaused(false);
                                } else {
                                    videoRef.current.pause();
                                    setIsPaused(true);
                                }
                            }
                        }}
                    >
                        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
                        <video
                            ref={videoRef}
                            src="/videos/hero.mp4"
                            loop
                            muted
                            playsInline
                            className="w-full aspect-video object-cover relative z-10"
                        />

                        {/* Initial Play Overlay */}
                        <AnimatePresence>
                            {!isPlaying && (
                                <motion.div
                                    key="play-overlay"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 1.3, transition: { duration: 0.4 } }}
                                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-2xl transition-colors group-hover:bg-black/30"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 dark:bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-black/30 group-hover:shadow-primary/30 transition-shadow"
                                    >
                                        <Play className="w-8 h-8 md:w-10 md:h-10 text-primary fill-primary ml-1" />
                                    </motion.div>
                                    <motion.div
                                        className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/40"
                                        animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Pause/Play Overlay (while demo is active) */}
                        <AnimatePresence>
                            {isPlaying && isPaused && (
                                <motion.div
                                    key="pause-overlay"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[1px] rounded-2xl"
                                >
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-xl"
                                    >
                                        <Play className="w-7 h-7 md:w-8 md:h-8 text-primary fill-primary ml-0.5" />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                </div>
            </div>

            {/* Bottom fade out to next section */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
        </section>
    );
}
