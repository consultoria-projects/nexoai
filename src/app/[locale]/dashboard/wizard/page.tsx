import { BudgetWizardChat } from '@/components/budget/wizard/BudgetWizardChat';
import { getTranslations } from 'next-intl/server';

export default async function BudgetWizardPage() {
    const t = await getTranslations('Dashboard');

    return (
        <div className="flex h-full flex-col items-center justify-center p-4 md:p-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Asistente de Presupuestos</h1>
                <p className="text-muted-foreground">Describe tu proyecto y deja que la IA cree el presupuesto por ti.</p>
            </div>

            <BudgetWizardChat />
        </div>
    );
}
