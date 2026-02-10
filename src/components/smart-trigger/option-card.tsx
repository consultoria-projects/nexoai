'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OptionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    badge?: string;
    onClick: () => void;
    theme: 'gold' | 'blue' | 'emerald' | 'violet' | 'amber';
    delay?: number;
}

const themes = {
    gold: {
        border: 'border-[#faeab1] dark:border-[#faeab1]/30',
        bg: 'bg-[#fdfbf6] dark:bg-[#faeab1]/5',
        hoverBg: 'hover:bg-[#faeab1]/20 dark:hover:bg-[#faeab1]/10',
        hoverBorder: 'hover:border-[#e8c42f] dark:hover:border-[#e8c42f]/50',
        iconBg: 'bg-[#faeab1] dark:bg-[#faeab1]/20',
        iconColor: 'text-[#d4af37] dark:text-[#ebc653]',
        badgeBg: 'bg-[#faeab1] dark:bg-[#faeab1]/20',
        badgeColor: 'text-[#d4af37] dark:text-[#ebc653]',
        hoverText: 'group-hover:text-[#d4af37] dark:group-hover:text-[#ebc653]'
    },
    blue: {
        border: 'border-blue-100 dark:border-blue-900',
        bg: 'bg-blue-50/10 dark:bg-blue-900/10',
        hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
        hoverBorder: 'hover:border-blue-200 dark:hover:border-blue-700',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        badgeBg: 'bg-blue-100 dark:bg-blue-900/30',
        badgeColor: 'text-blue-700 dark:text-blue-300',
        hoverText: 'group-hover:text-blue-700 dark:group-hover:text-blue-400'
    },
    emerald: {
        border: 'border-emerald-100 dark:border-emerald-900',
        bg: 'bg-emerald-50/10 dark:bg-emerald-900/10',
        hoverBg: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
        hoverBorder: 'hover:border-emerald-200 dark:hover:border-emerald-700',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-900/30',
        badgeColor: 'text-emerald-700 dark:text-emerald-300',
        hoverText: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-400'
    },
    violet: {
        border: 'border-violet-100 dark:border-violet-900',
        bg: 'bg-violet-50/10 dark:bg-violet-900/10',
        hoverBg: 'hover:bg-violet-50 dark:hover:bg-violet-900/20',
        hoverBorder: 'hover:border-violet-200 dark:hover:border-violet-700',
        iconBg: 'bg-violet-100 dark:bg-violet-900/30',
        iconColor: 'text-violet-600 dark:text-violet-400',
        badgeBg: 'bg-violet-100 dark:bg-violet-900/30',
        badgeColor: 'text-violet-700 dark:text-violet-300',
        hoverText: 'group-hover:text-violet-700 dark:group-hover:text-violet-400'
    },
    amber: {
        border: 'border-amber-100 dark:border-amber-900',
        bg: 'bg-amber-50/10 dark:bg-amber-900/10',
        hoverBg: 'hover:bg-amber-50 dark:hover:bg-amber-900/20',
        hoverBorder: 'hover:border-amber-200 dark:hover:border-amber-700',
        iconBg: 'bg-amber-100 dark:bg-amber-900/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        badgeBg: 'bg-amber-100 dark:bg-amber-900/30',
        badgeColor: 'text-amber-700 dark:text-amber-300',
        hoverText: 'group-hover:text-amber-700 dark:group-hover:text-amber-400'
    }
};

export function OptionCard({ title, description, icon: Icon, badge, onClick, theme, delay = 0 }: OptionCardProps) {
    const t = themes[theme];

    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            onClick={onClick}
            className={cn(
                "group relative flex items-start gap-4 p-5 rounded-2xl border transition-all text-left shadow-sm w-full dark:shadow-none",
                t.border,
                t.bg,
                t.hoverBg,
                t.hoverBorder
            )}
        >
            {badge && (
                <div className={cn(
                    "absolute top-4 right-4 text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-md transition-colors",
                    t.badgeBg,
                    t.badgeColor
                )}>
                    {badge}
                </div>
            )}

            <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                t.iconBg,
                t.iconColor
            )}>
                <Icon className="w-6 h-6 stroke-[1.5]" />
            </div>

            <div className="flex-1">
                <h3 className={cn(
                    "text-lg font-bold mb-1 text-gray-900 dark:text-white transition-colors",
                    t.hoverText
                )}>
                    {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.button>
    );
}
