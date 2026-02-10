'use client';

import { Button } from '@/components/ui/button';
import {
    Save,
    Undo2,
    Redo2,
    FileDown,
    Loader2,
    Check,
    ScanEye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BudgetDocument } from '@/components/pdf/BudgetDocument';
import { EditableBudgetLineItem } from '@/types/budget-editor';
import { BudgetCostBreakdown } from '@/backend/budget/domain/budget';
import React from 'react';

interface BudgetEditorToolbarProps {
    hasUnsavedChanges: boolean;
    isSaving: boolean;
    canUndo: boolean;
    canRedo: boolean;
    onSave: () => void;
    onUndo: () => void;
    onRedo: () => void;
    lastSavedAt?: Date;

    // Comparison Mode
    showGhostMode: boolean;
    onToggleGhostMode: () => void;

    // For PDF Generation
    clientName: string;
    items: EditableBudgetLineItem[];
    costBreakdown: BudgetCostBreakdown;
    budgetNumber: string;
}

export const BudgetEditorToolbar = ({
    hasUnsavedChanges,
    isSaving,
    canUndo,
    canRedo,
    onSave,
    onUndo,
    onRedo,
    lastSavedAt,
    showGhostMode,
    onToggleGhostMode,
    clientName,
    items,
    costBreakdown,
    budgetNumber
}: BudgetEditorToolbarProps) => {
    // Determine status text
    const statusText = isSaving ? 'Guardando...' :
        hasUnsavedChanges ? 'Cambios sin guardar' :
            lastSavedAt ? `Guardado ${lastSavedAt.toLocaleTimeString()}` : 'Listo';

    return (
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-border p-4 flex justify-between items-center supports-[backdrop-filter]:bg-background/60">

            {/* Left: History Actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                    title="Deshacer"
                >
                    <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                    title="Rehacer"
                >
                    <Redo2 className="w-4 h-4" />
                </Button>

                <div className="h-6 w-px bg-border mx-2" />

                <span className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-full transition-colors border",
                    hasUnsavedChanges
                        ? "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                        : "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                )}>
                    {statusText}
                </span>
            </div>

            {/* Right: Primary Actions */}
            <div className="flex items-center gap-3">
                <Button
                    variant={showGhostMode ? "secondary" : "ghost"}
                    size="sm"
                    onClick={onToggleGhostMode}
                    className={cn(
                        "gap-2 text-muted-foreground hover:text-foreground",
                        showGhostMode && "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
                    )}
                >
                    <ScanEye className="w-4 h-4" />
                    <span className="hidden sm:inline">Comparar</span>
                </Button>

                <div className="h-6 w-px bg-border mx-1" />

                <PDFDownloadLink
                    document={
                        <BudgetDocument
                            budgetNumber={budgetNumber}
                            clientName={clientName}
                            // Mock data for other required fields or passed via props
                            clientEmail=""
                            clientAddress=""
                            items={items}
                            costBreakdown={costBreakdown}
                            date={new Date().toLocaleDateString()}
                        />
                    }
                    fileName={`Presupuesto-${budgetNumber}.pdf`}
                    className="inline-flex"
                >
                    {({ loading }) => (
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                            <span className="hidden sm:inline">Exportar PDF</span>
                        </Button>
                    )}
                </PDFDownloadLink>

                <Button
                    onClick={onSave}
                    className={cn(
                        "gap-2 min-w-[120px] transition-all font-medium shadow-lg hover:shadow-xl",
                        hasUnsavedChanges
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-orange-500/20"
                            : "bg-primary text-primary-foreground shadow-primary/20",
                        isSaving && "opacity-80"
                    )}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : hasUnsavedChanges ? (
                        <Save className="w-4 h-4" />
                    ) : (
                        <Check className="w-4 h-4" />
                    )}
                    {isSaving ? 'Guardando' : 'Guardar'}
                </Button>
            </div>
        </div>
    );
};
