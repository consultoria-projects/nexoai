'use client';

import React from 'react';
import { useBudgetEditor } from '@/hooks/use-budget-editor';
import { BudgetEditorGrid } from './BudgetEditorGrid';
import { BudgetEditorToolbar } from './BudgetEditorToolbar';
import { updateBudgetAction } from '@/actions/budget/update-budget.action';
import { Budget } from '@/backend/budget/domain/budget';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetRequestDetails } from './BudgetRequestDetails';
import { BudgetEconomicSummary } from './BudgetEconomicSummary';
import { BudgetLibrarySidebar } from './BudgetLibrarySidebar';
import { RenovationGallery } from '@/components/dream-renovator/RenovationGallery';
import { BudgetRequestViewer } from './BudgetRequestViewer';
import { Sparkles, FileText, User, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BudgetEditorWrapperProps {
    budget: Budget;
}

export const BudgetEditorWrapper = ({ budget }: BudgetEditorWrapperProps) => {
    // If it's a Quick Budget or New Build, we use the Viewer, not the full Editor
    if (budget.type === 'quick' || budget.type === 'new_build') {
        return <BudgetRequestViewer budget={budget} />;
    }

    const {
        state,
        updateItem,
        addItem,
        reorderItems,
        removeItem,
        duplicateItem,
        undo,
        redo,
        saveStart,
        saveSuccess,
        saveError,
        canUndo,
        canRedo,
        addChapter,
        removeChapter,
        renameChapter,
        reorderChapters
    } = useBudgetEditor(budget.lineItems);

    const { toast } = useToast();
    const [isGhostMode, setIsGhostMode] = React.useState(false);

    // Helper for source
    const getSourceInfo = (source?: string) => {
        switch (source) {
            case 'wizard':
                return { icon: Sparkles, label: 'Asistente IA', color: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-400' };
            case 'pdf_measurement':
                return { icon: FileText, label: 'Mediciones PDF', color: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400' };
            default:
                return { icon: User, label: 'Manual', color: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400' };
        }
    };

    const sourceInfo = getSourceInfo(budget.source);
    const SourceIcon = sourceInfo.icon;

    // Handle Save
    const handleSave = async () => {
        saveStart();
        try {
            const result = await updateBudgetAction(budget.id, {
                lineItems: state.items,
                costBreakdown: state.costBreakdown,
                totalEstimated: state.costBreakdown.total
            });

            if (result.success) {
                saveSuccess();
                toast({
                    title: "Presupuesto guardado",
                    description: "Los cambios se han guardado correctamente.",
                });
            } else {
                saveError();
                toast({
                    title: "Error al guardar",
                    description: result.error || "Ha ocurrido un error inesperado.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            saveError();
            toast({
                title: "Error de conexión",
                description: "No se pudo conectar con el servidor.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-transparent">
            <BudgetEditorToolbar
                hasUnsavedChanges={state.hasUnsavedChanges}
                isSaving={state.isSaving}
                canUndo={canUndo}
                canRedo={canRedo}
                onSave={handleSave}
                onUndo={undo}
                onRedo={redo}
                lastSavedAt={state.lastSavedAt}
                clientName={budget.clientData.name}
                items={state.items}
                costBreakdown={state.costBreakdown}
                budgetNumber={budget.id.substring(0, 8)}
                showGhostMode={isGhostMode}
                onToggleGhostMode={() => setIsGhostMode(!isGhostMode)}
            />

            <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 space-y-8 animate-in fade-in duration-500">

                {/* Header Info */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className={`gap-1.5 px-2.5 py-1 ${sourceInfo.color} font-medium tracking-wide`}>
                                <SourceIcon className="w-3.5 h-3.5" />
                                {sourceInfo.label}
                            </Badge>
                            <span className="text-xs font-mono text-muted-foreground">#{budget.id.substring(0, 8).toUpperCase()}</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-foreground">
                            {budget.clientData.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground pt-1">
                            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700/50">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                <span className="font-medium text-foreground">
                                    {(budget.clientData as any).projectScope === 'integral' ? 'Reforma Integral' : 'Reforma Parcial'}
                                </span>
                            </div>

                            <span className="text-muted-foreground/30">•</span>

                            <span className="capitalize flex items-center gap-1.5">
                                <Home className="w-4 h-4 text-muted-foreground" />
                                {(budget.clientData as any).propertyType === 'residential' ? 'Vivienda' : 'Local / Oficina'}
                            </span>

                            {budget.pricingMetadata?.uploadedFileName && (
                                <>
                                    <span className="text-muted-foreground/30">•</span>
                                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                        <FileText className="w-4 h-4" />
                                        <span className="underline decoration-blue-300 dark:decoration-blue-700 underline-offset-4">
                                            {budget.pricingMetadata.uploadedFileName}
                                        </span>
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">

                    {/* LEFT COLUMN: Main Content Area (Tabs) */}
                    <div className="min-w-0">
                        <Tabs defaultValue="editor" className="space-y-6">
                            <TabsList className="bg-white dark:bg-white/5 border dark:border-white/10 shadow-sm">
                                <TabsTrigger value="editor">Editor de Partidas</TabsTrigger>
                                <TabsTrigger value="details">Detalles Solicitud</TabsTrigger>
                                <TabsTrigger value="renovation" className="text-purple-600 data-[state=active]:text-purple-800 data-[state=active]:bg-purple-50">
                                    Dream Renovator ✨
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="editor" className="space-y-8">
                                <BudgetEditorGrid
                                    items={state.items}
                                    chapters={state.chapters}
                                    onReorder={reorderItems}
                                    onUpdate={updateItem}
                                    onRemove={removeItem}
                                    onDuplicate={duplicateItem}
                                    onAddChapter={addChapter}
                                    onRemoveChapter={removeChapter}
                                    onRenameChapter={renameChapter}
                                    onReorderChapters={reorderChapters}
                                    showGhostMode={isGhostMode}
                                />
                            </TabsContent>

                            <TabsContent value="details">
                                <BudgetRequestDetails data={budget.clientData as any} />
                            </TabsContent>

                            <TabsContent value="renovation">
                                <RenovationGallery budgetId={budget.id} renders={budget.renders} />
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Summary + Library) */}
                    <div className="sticky top-24">
                        <Tabs defaultValue="summary" className="w-full">
                            <TabsList className="w-full grid grid-cols-2 bg-white/50 dark:bg-white/5 mb-4 border dark:border-white/10 shadow-sm">
                                <TabsTrigger value="summary">Resumen</TabsTrigger>
                                <TabsTrigger value="library">Biblioteca</TabsTrigger>
                            </TabsList>
                            <TabsContent value="summary">
                                <BudgetEconomicSummary costBreakdown={state.costBreakdown} />
                            </TabsContent>
                            <TabsContent value="library">
                                <BudgetLibrarySidebar onAddItem={addItem} />
                            </TabsContent>
                        </Tabs>
                    </div>

                </div>
            </main>
        </div>
    );
};
