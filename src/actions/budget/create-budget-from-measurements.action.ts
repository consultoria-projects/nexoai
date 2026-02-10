'use server';

import { BudgetService } from '@/backend/budget/application/budget-service';
import { BudgetRepositoryFirestore } from '@/backend/budget/infrastructure/budget-repository-firestore';
import { PricingOutput } from '@/backend/ai/flows/measurements/measurement-pricing.flow';
import { BudgetLineItem, BudgetCostBreakdown } from '@/backend/budget/domain/budget';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

const budgetRepository = new BudgetRepositoryFirestore();
const budgetService = new BudgetService(budgetRepository);

export async function createBudgetFromMeasurementsAction(
    pricingOutput: PricingOutput,
    fileName: string,
    pageCount?: number
) {
    try {
        // Map extracted items to BudgetLineItem
        const lineItems: BudgetLineItem[] = pricingOutput.items.map((item, index) => ({
            id: crypto.randomUUID(),
            order: index + 1,
            originalTask: item.description,
            found: !item.isEstimate, // If estimated, it wasn't strictly "found" in price book? Or maybe it was found in PDF?
            // "found" in BudgetLineItem context usually means found in Price Book search. 
            // Here, let's map it to !isEstimate (so if it matched a price book item, found=true)

            item: {
                code: item.priceBookCode || item.code || `GENERATED-${index}`,
                description: item.description,
                unit: item.unit,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
            },
            chapter: item.chapter || 'General',
            // Store original values for ghost mode / comparison
            originalState: {
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                description: item.description,
                unit: item.unit,
            },
            note: item.isEstimate
                ? '⚠️ Precio estimado por IA (No se encontró coincidencia exacta en Base de Precios)'
                : `Coincidencia: ${Math.round(item.matchConfidence)}%`
        }));

        // Map summary to CostBreakdown
        const costBreakdown: BudgetCostBreakdown = {
            materialExecutionPrice: pricingOutput.summary.subtotal,
            overheadExpenses: pricingOutput.summary.overheadExpenses,
            industrialBenefit: pricingOutput.summary.industrialBenefit,
            tax: pricingOutput.summary.iva,
            globalAdjustment: 0,
            total: pricingOutput.summary.total,
        };

        // Create Budget
        const newBudget = await budgetService.createNewBudget({
            type: 'renovation', // Default to renovation for PDF uploads usually
            status: 'draft',    // Start as draft so admin can review
            version: 1,
            updatedAt: new Date(),
            userId: 'admin',    // Assigned to admin for now

            clientData: {
                name: pricingOutput.clientName || 'Cliente (Desde PDF)',
                email: '', // Unknown
                phone: '',
                address: '',
                projectScope: 'integral',
                propertyType: 'residential',
                description: `Presupuesto extraído de: ${fileName}`,
            },

            lineItems,
            costBreakdown,
            totalEstimated: pricingOutput.summary.total,

            // Metadata
            source: 'pdf_measurement',
            pricingMetadata: {
                uploadedFileName: fileName,
                ...(pageCount !== undefined && { pageCount }),
                extractionConfidence: (pricingOutput.summary.matchedItems / pricingOutput.summary.totalItems) * 100
            }
        });

        revalidatePath('/dashboard/admin/budgets');
        return { success: true, budgetId: newBudget.id };

    } catch (error) {
        console.error("Error creating budget from measurements:", error);
        return { success: false, error: "Failed to persist budget" };
    }
}
