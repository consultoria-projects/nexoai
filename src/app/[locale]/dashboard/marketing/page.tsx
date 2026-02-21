'use client';

import { useState } from 'react';
import { TrendingUp, BarChart3, Eye, MousePointerClick, Play, Users, Clock, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Tab = 'overview' | 'ab-tests' | 'events';

export default function MarketingDashboardPage() {
    const [tab, setTab] = useState<Tab>('overview');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                        <Badge className="bg-white/10 text-purple-200 hover:bg-white/20 border-purple-500/30 backdrop-blur-md mb-2">
                            <TrendingUp className="w-3 h-3 mr-1 text-purple-300" /> CRM
                        </Badge>
                        <h1 className="text-4xl font-bold font-headline tracking-tight">
                            Marketing <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200">Analytics</span>
                        </h1>
                        <p className="text-purple-100/80 max-w-xl text-lg">
                            Tracking del tráfico web, conversiones, tests A/B y comportamiento de usuario.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-1 bg-secondary/30 rounded-xl p-1 w-fit">
                {[
                    { key: 'overview' as Tab, label: 'Overview' },
                    { key: 'ab-tests' as Tab, label: 'Tests A/B' },
                    { key: 'events' as Tab, label: 'Eventos' },
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Sesiones', value: '—', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { label: 'Page Views', value: '—', icon: Eye, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                            { label: 'CTA Clicks', value: '—', icon: MousePointerClick, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                            { label: 'Video Plays', value: '—', icon: Play, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        ].map(stat => (
                            <div key={stat.label} className="bg-card border border-border rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/40" />
                                </div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-card border border-border rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-4 h-4 text-primary" />
                                <h3 className="font-semibold text-sm">Duración Media de Sesión</h3>
                            </div>
                            <p className="text-3xl font-bold">— s</p>
                            <p className="text-sm text-muted-foreground mt-1">Conecta el tracking para ver datos reales</p>
                        </div>
                        <div className="bg-card border border-border rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                <h3 className="font-semibold text-sm">Scroll Depth Medio</h3>
                            </div>
                            <p className="text-3xl font-bold">— %</p>
                            <p className="text-sm text-muted-foreground mt-1">Milestones: 25% / 50% / 75% / 100%</p>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-8 text-center">
                        <TrendingUp className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold mb-1">Tracking Activado</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            El hook <code className="px-1.5 py-0.5 bg-secondary rounded text-xs">useAnalytics()</code> está integrado en el layout raíz.
                            Los datos comenzarán a aparecer aquí conforme se registren sesiones.
                        </p>
                    </div>
                </div>
            )}

            {tab === 'ab-tests' && (
                <div className="bg-card border border-border rounded-2xl p-8 text-center">
                    <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-1">Tests A/B</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Aún no hay tests activos. Crea tu primer test para experimentar con headlines, CTAs y copy.
                    </p>
                </div>
            )}

            {tab === 'events' && (
                <div className="bg-card border border-border rounded-2xl p-8 text-center">
                    <MousePointerClick className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-1">Eventos Recientes</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Los eventos (VIDEO_PLAY, CTA_CLICK, SCROLL_DEPTH, etc.) aparecerán aquí una vez haya tráfico tracked.
                    </p>
                </div>
            )}
        </div>
    );
}
