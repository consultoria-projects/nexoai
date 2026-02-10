import { Card, CardContent } from '@/components/ui/card';
import { BudgetCostBreakdown } from '@/backend/budget/domain/budget';

interface BudgetEconomicSummaryProps {
    costBreakdown: BudgetCostBreakdown;
}

export const BudgetEconomicSummary = ({ costBreakdown }: BudgetEconomicSummaryProps) => {
    return (
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-white/5 backdrop-blur dark:border dark:border-white/10">
            <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-slate-800 dark:text-white border-b dark:border-white/10 pb-2">Resumen Económico</h3>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-white/70">
                        <span>PEM</span>
                        <span className="font-mono">{costBreakdown.materialExecutionPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>

                    <div className="flex justify-between text-sm text-slate-500 dark:text-white/50 pl-2">
                        <span>GG (13%)</span>
                        <span className="font-mono">{costBreakdown.overheadExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>

                    <div className="flex justify-between text-sm text-slate-500 dark:text-white/50 pl-2">
                        <span>BI (6%)</span>
                        <span className="font-mono">{costBreakdown.industrialBenefit.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                </div>

                <div className="border-t dark:border-white/10 pt-2 space-y-2">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-white/80">
                        <span>Base Imponible</span>
                        <span>{(costBreakdown.materialExecutionPrice + costBreakdown.overheadExpenses + costBreakdown.industrialBenefit).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-white/60">
                        <span>IVA (21%)</span>
                        <span className="font-mono">{costBreakdown.tax.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                </div>

                <div className="border-t-2 border-primary/10 dark:border-amber-500/20 pt-4 flex justify-between items-end">
                    <span className="font-bold text-lg text-primary dark:text-amber-400">Total</span>
                    <span className="font-bold text-2xl text-primary dark:text-amber-400">{costBreakdown.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                </div>
            </CardContent>
        </Card>
    );
};
