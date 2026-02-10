/**
 * Measurement Pricing Flow
 * 
 * Takes extracted measurement items and finds matching prices using vector search.
 * Calculates totals and generates a priced budget.
 */

import { ai } from '@/backend/ai/config/genkit.config';
import { z } from 'zod';
import { MeasurementItem, MeasurementItemSchema, measurementExtractionFlow } from './measurement-extraction.flow';
import { RestApiVectorizerAdapter } from '@/backend/price-book/infrastructure/ai/rest-api-vectorizer.adapter';
import { FirestorePriceBookRepository } from '@/backend/price-book/infrastructure/firestore-price-book-repository';

// Schema for priced items
export const PricedMeasurementItemSchema = MeasurementItemSchema.extend({
    unitPrice: z.number().describe('Unit price from Price Book'),
    totalPrice: z.number().describe('Total price (quantity * unitPrice)'),
    priceBookCode: z.string().optional().describe('Matched Price Book item code'),
    matchConfidence: z.number().min(0).max(100).describe('Confidence of the match (0-100)'),
    isEstimate: z.boolean().describe('Whether price is an AI estimate vs matched'),
    // Ensure these are explicitly carried over
    page: z.number().optional(),
    chapter: z.string().optional(),
    section: z.string().optional(),
});

export type PricedMeasurementItem = z.infer<typeof PricedMeasurementItemSchema>;

const PricingOutputSchema = z.object({
    projectName: z.string().optional(),
    clientName: z.string().optional(),
    items: z.array(PricedMeasurementItemSchema),
    summary: z.object({
        totalItems: z.number(),
        matchedItems: z.number(),
        estimatedItems: z.number(),
        subtotal: z.number(),
        overheadExpenses: z.number().describe('13% Gastos Generales'),
        industrialBenefit: z.number().describe('6% Beneficio Industrial'),
        pemConGG: z.number().describe('PEM + GG + BI'),
        iva: z.number().describe('21% IVA'),
        total: z.number(),
    }),
});

export type PricingOutput = z.infer<typeof PricingOutputSchema>;


const vectorizer = new RestApiVectorizerAdapter();
const priceBookRepo = new FirestorePriceBookRepository();

async function findBestMatch(description: string): Promise<{
    unitPrice: number;
    priceBookCode: string;
    confidence: number;
    isEstimate: boolean;
} | null> {
    try {
        // Generate embedding for the description
        const embedding = await vectorizer.embedText(description);

        // Search price book
        const results = await priceBookRepo.searchByVector(embedding, 3);

        if (results.length > 0) {
            const best = results[0];
            // Calculate confidence based on semantic similarity (simplified)
            // In production, you'd compare embeddings properly
            const confidence = 85; // Placeholder - would be actual similarity score

            return {
                unitPrice: best.priceTotal,
                priceBookCode: best.code,
                confidence,
                isEstimate: false,
            };
        }

        return null;
    } catch (error) {
        console.error('[MeasurementPricing] Error finding match:', error);
        return null;
    }
}

export const measurementPricingFlow = ai.defineFlow(
    {
        name: 'measurementPricingFlow',
        inputSchema: z.object({
            pdfBase64: z.string().describe('Base64 encoded PDF'),
            mimeType: z.string().default('application/pdf'),
        }),
        outputSchema: PricingOutputSchema,
    },
    async ({ pdfBase64, mimeType }) => {
        console.log('[MeasurementPricing] Starting full pipeline...');

        // Step 1: Extract measurements
        const extraction = await measurementExtractionFlow({ pdfBase64, mimeType });
        console.log(`[MeasurementPricing] Extracted ${extraction.items.length} items`);

        // Step 2: Price each item using vector search
        const pricedItems: PricedMeasurementItem[] = [];
        let matchedCount = 0;

        for (const item of extraction.items) {
            const match = await findBestMatch(item.description);

            if (match) {
                matchedCount++;
                pricedItems.push({
                    ...item,
                    unitPrice: match.unitPrice,
                    totalPrice: match.unitPrice * item.quantity,
                    priceBookCode: match.priceBookCode,
                    matchConfidence: match.confidence,
                    isEstimate: false,
                    // Pass through context fields
                    page: item.page,
                    chapter: item.chapter,
                    section: item.section,
                });
            } else {
                // Fallback: estimate price based on unit and description length
                const estimatedPrice = estimateFallbackPrice(item);
                pricedItems.push({
                    ...item,
                    unitPrice: estimatedPrice,
                    totalPrice: estimatedPrice * item.quantity,
                    priceBookCode: undefined,
                    matchConfidence: 30, // Low confidence for estimates
                    isEstimate: true,
                    // Pass through context fields
                    page: item.page,
                    chapter: item.chapter,
                    section: item.section,
                });
            }
        }

        // Step 3: Calculate summary
        const subtotal = pricedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        const overheadExpenses = subtotal * 0.13;
        const industrialBenefit = subtotal * 0.06;
        const pemConGG = subtotal + overheadExpenses + industrialBenefit;
        const iva = pemConGG * 0.21;
        const total = pemConGG + iva;

        console.log(`[MeasurementPricing] Complete. ${matchedCount}/${pricedItems.length} matched. Total: €${total.toFixed(2)}`);

        return {
            projectName: extraction.projectName,
            clientName: extraction.clientName,
            items: pricedItems,
            summary: {
                totalItems: pricedItems.length,
                matchedItems: matchedCount,
                estimatedItems: pricedItems.length - matchedCount,
                subtotal,
                overheadExpenses,
                industrialBenefit,
                pemConGG,
                iva,
                total,
            },
        };
    }
);

function estimateFallbackPrice(item: MeasurementItem): number {
    // Simple heuristic for fallback pricing based on unit type
    const unitPrices: Record<string, number> = {
        'm²': 25,
        'm2': 25,
        'm': 15,
        'ml': 15,
        'ud': 50,
        'u': 50,
        'kg': 2,
        'h': 35,
        'pa': 100,
    };

    const unit = item.unit.toLowerCase();
    return unitPrices[unit] || 30; // Default €30
}
