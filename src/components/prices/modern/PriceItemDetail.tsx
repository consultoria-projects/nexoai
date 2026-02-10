'use client';

import { PriceBookItem, PriceBookComponent } from "@/backend/price-book/domain/price-book-item";
import { Separator } from "@/components/ui/separator";

interface BreakdownItem {
    code: string;
    description?: string;
    quantity: number;
    unit?: string;
    price: number;
}

export function PriceItemDetail({ item }: { item: PriceBookItem }) {

    // Helper to calculate totals
    const calculateTotal = (comp: BreakdownItem) => {
        if (comp.unit === '%') {
            return (comp.price || 0) * ((comp.quantity || 0) / 100);
        }
        return (comp.quantity || 0) * (comp.price || 0);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                    <span>{item.code}</span>
                    <span>•</span>
                    <span>{item.chapter} / {item.section}</span>
                </div>

                <h2 className="text-4xl font-light tracking-tight text-foreground flex items-baseline">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(item.priceTotal)}
                    <span className="text-lg text-muted-foreground ml-2 font-normal">/ {item.unit}</span>
                </h2>

                <p className="text-foreground/80 leading-relaxed pt-2 text-sm">
                    {item.description}
                </p>
            </div>

            <Separator className="bg-border" />

            <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase">Cost Breakdown</h3>

                <div className="space-y-1">
                    <div className="grid grid-cols-12 text-[10px] text-muted-foreground uppercase tracking-wider pb-2 border-b border-border px-2 font-medium">
                        <div className="col-span-2">Code</div>
                        <div className="col-span-6">Description</div>
                        <div className="col-span-2 text-right">Qty</div>
                        <div className="col-span-1 text-right">Price</div>
                        <div className="col-span-1 text-right">Total</div>
                    </div>

                    {item.breakdown && item.breakdown.length > 0 ? (
                        item.breakdown.map((comp: PriceBookComponent, idx: number) => {
                            const total = calculateTotal(comp as BreakdownItem);

                            return (
                                <div key={idx} className="grid grid-cols-12 text-sm py-2 px-2 hover:bg-muted/50 rounded-md transition-colors items-center border-b border-transparent hover:border-border">
                                    <div className="col-span-2 font-mono text-primary text-xs">{comp.code}</div>
                                    <div className="col-span-6 text-foreground/80 text-xs truncate pr-4" title={comp.description}>
                                        {comp.description}
                                    </div>
                                    <div className="col-span-2 text-right text-muted-foreground font-mono text-xs">
                                        {comp.quantity?.toFixed(3)} {comp.unit}
                                    </div>
                                    <div className="col-span-1 text-right text-muted-foreground font-mono text-xs">
                                        {comp.price?.toFixed(2)}
                                    </div>
                                    <div className="col-span-1 text-right text-foreground font-mono text-xs font-medium">
                                        {total.toFixed(2)}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-muted-foreground text-xs italic py-4 text-center">No detailed breakdown available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
