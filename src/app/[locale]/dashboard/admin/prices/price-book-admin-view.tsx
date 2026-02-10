'use client';

import { PriceBookDashboard } from "@/components/prices/modern/PriceBookDashboard";

export function PriceBookAdminView({ locale }: { locale: string }) {
    return (
        <div className="w-full h-full">
            {/* PriceBookDashboard handles its own container and height */}
            <PriceBookDashboard />
        </div>
    );
}
