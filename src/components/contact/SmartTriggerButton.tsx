'use client';

import { useWidgetContext } from '@/context/budget-widget-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface SmartTriggerButtonProps {
    label: string;
    className?: string;
}

export function SmartTriggerButton({ label, className }: SmartTriggerButtonProps) {
    const { openWidget } = useWidgetContext();

    return (
        <Button
            onClick={() => openWidget()}
            className={cn("group", className)}
            size="lg"
        >
            {label}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
    );
}
