'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const SmartBudgetTrigger = dynamic(
    () => import('@/components/budget-widget/smart-trigger').then(mod => mod.SmartBudgetTrigger),
    { ssr: false }
);

const SmartBudgetModal = dynamic(
    () => import('@/components/budget-widget/budget-modal').then(mod => mod.SmartBudgetModal),
    { ssr: false }
);

export function SmartBudgetWrapper({ dictionary }: { dictionary?: any }) {
    const pathname = usePathname();
    const isDemoViewer = pathname?.includes('/demo/viewer');

    return (
        <>
            {!isDemoViewer && <SmartBudgetTrigger dictionary={dictionary} />}
            <SmartBudgetModal dictionary={dictionary} />
        </>
    );
}
