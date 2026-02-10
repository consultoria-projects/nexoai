'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    DollarSign,
    Settings,
    Search,
    ChevronRight,
    LogOut,
    Sparkles,
    Briefcase,
    MessageSquare,
    FileUp
} from 'lucide-react';
import Image from 'next/image';
import { UserNav } from '@/components/auth/user-nav';
import { ModeToggle } from '@/components/mode-toggle';

interface ModernSidebarProps {
    t: any;
    className?: string;
}

export function ModernSidebar({ t, className }: ModernSidebarProps) {
    const pathname = usePathname();

    const navGroups = [
        {
            label: 'Management',
            items: [
                { href: '/dashboard', label: t.dashboard.nav.dashboard, icon: LayoutDashboard },
                { href: '/dashboard/admin/messages', label: 'Mensajes', icon: MessageSquare },
                { href: '/dashboard/admin/budgets', label: t.dashboard.nav.myBudgets, icon: FileText },
                { href: '/dashboard/wizard', label: 'AI Budget Wizard', icon: Sparkles },
                { href: '/dashboard/measurements', label: 'Procesar Mediciones', icon: FileUp },
            ]
        },
        {
            label: 'Library',
            items: [
                { href: '/dashboard/admin/prices', label: t.dashboard.nav.priceBook, icon: Briefcase },
                { href: '/dashboard/seo-generator', label: t.dashboard.nav.seoGenerator, icon: Search },
            ]
        },
        {
            label: 'Configuration',
            items: [
                { href: '/dashboard/settings/pricing', label: t.dashboard.nav.quickPricing, icon: DollarSign },
                { href: '/dashboard/settings/financial', label: t.dashboard.nav.financial, icon: DollarSign },
                { href: '/dashboard/settings', label: t.dashboard.nav.settings, icon: Settings },
            ]
        }
    ];

    return (
        <aside className={cn("w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col p-4", className)}>
            {/* Logo Area */}
            <div className="h-16 flex items-center px-2 mb-6">
                <div className="relative w-32 h-10">
                    <Image
                        src="/images/logo.avif"
                        alt="GRUPO RG Logo"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-8 overflow-y-auto scrollbar-hide">
                {navGroups.map((group, idx) => (
                    <div key={idx} className="space-y-2">
                        <h3 className="px-2 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                            {group.label}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href as any}
                                        className={cn(
                                            "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden",
                                            isActive
                                                ? "text-primary bg-primary/10"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-active-pill"
                                                className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                        <span>{item.label}</span>
                                        {isActive && <ChevronRight className="h-3 w-3 ml-auto text-primary/50" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer with Mode Toggle & User */}
            <div className="mt-auto border-t border-sidebar-border pt-4 space-y-4">

                <div className="flex items-center justify-between px-2">
                    <span className="text-xs text-muted-foreground">Theme</span>
                    <ModeToggle />
                </div>

                <div className="bg-sidebar-accent/50 p-3 rounded-xl flex items-center gap-3 border border-sidebar-border hover:border-sidebar-ring/50 transition-colors cursor-pointer group">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-medium text-white">
                        U
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sidebar-foreground truncate group-hover:text-primary transition-colors">Usuario</p>
                        <p className="text-xs text-muted-foreground truncate">Admin</p>
                    </div>
                    <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </div>
            </div>
        </aside>
    );
}
