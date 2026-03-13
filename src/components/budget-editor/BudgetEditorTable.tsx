'use client';

import React, { useState, useTransition } from 'react';
import { formatCurrency } from '@/lib/utils';
import {
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    GripVertical,
    MoreHorizontal,
    Package,
    Hammer,
    Sparkles,
    Search,
    ListTree,
    Trash2,
    Copy,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    FolderPlus,
    Loader2,
    Percent,
    Wand2
} from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { EditableBudgetLineItem } from "@/types/budget-editor";
import { EditableCell } from "./EditableCell";
import { sileo } from 'sileo';
import { generateBreakdownAction } from '@/actions/budget/smart-actions';
import { BudgetBreakdownSheet } from './BudgetBreakdownSheet';

interface BudgetEditorTableProps {
    items: EditableBudgetLineItem[];
    chapters: string[];
    onReorder: (newItems: EditableBudgetLineItem[]) => void;
    onUpdate: (id: string, changes: Partial<EditableBudgetLineItem>) => void;
    onRemove: (id: string) => void;
    onDuplicate: (id: string) => void;
    onAddChapter: (name: string) => void;
    onRemoveChapter: (name: string) => void;
    onRenameChapter: (oldName: string, newName: string) => void;
    onReorderChapters: (newOrder: string[]) => void;
    showGhostMode?: boolean;
    isExecutionOnly?: boolean;
    isAdmin?: boolean;
    applyMarkup?: (scope: 'global' | 'chapter' | 'item', percentage: number, targetId?: string) => void;
    isReadOnly?: boolean;
    leadId?: string;
}

const TableRowItem = ({ item, onUpdate, onRemove, onDuplicate, showGhostMode, isExecutionOnly, onOpenBreakdown, onOpenMarkup, isReadOnly, leadId }: {
    item: EditableBudgetLineItem;
    onUpdate: (id: string, changes: Partial<EditableBudgetLineItem>) => void;
    onRemove: (id: string) => void;
    onDuplicate: (id: string) => void;
    showGhostMode?: boolean;
    isExecutionOnly?: boolean;
    onOpenBreakdown: (item: EditableBudgetLineItem) => void;
    onOpenMarkup: (id: string) => void;
    isReadOnly?: boolean;
    leadId?: string;
}) => {
    const controls = useDragControls();
    const [isPending, startTransition] = useTransition();

    // Deviation Analysis
    const currentPrice = item.item?.unitPrice || 0;
    const originalPrice = item.originalState?.unitPrice || currentPrice;
    const deviation = originalPrice > 0 ? Math.abs((currentPrice - originalPrice) / originalPrice) : 0;
    const isDeviated = deviation > 0.2;

    // AI Candidates Inline State
    const [showInlineCandidates, setShowInlineCandidates] = useState(false);
    const hasCandidates = (item.item?.candidates?.length ?? 0) > 0;

    // Execution Only logic
    const variableCosts = isExecutionOnly && item.item?.breakdown
        ? item.item.breakdown
            .filter((comp: any) => comp.is_variable === true)
            .reduce((acc: number, comp: any) => {
                const cPrice = comp.unitPrice || comp.price || 0;
                const cQuantity = comp.quantity || comp.yield || 1;
                return acc + (comp.totalPrice || comp.total || (cPrice * cQuantity));
            }, 0)
        : 0;

    const actualTotal = item.item?.totalPrice || 0;
    const displayTotal = Number(Math.max(0, actualTotal - variableCosts).toFixed(2));
    const displayUnitPrice = Number(((item.item?.quantity || 1) > 0 ? displayTotal / item.item!.quantity : 0).toFixed(2));

    const handleTotalChange = (val: string | number) => {
        const newTotal = Number(val);
        const quantity = item.item?.quantity || 1;
        const newUnitPrice = newTotal / (quantity === 0 ? 1 : quantity);
        onUpdate(item.id, { item: { ...item.item!, unitPrice: newUnitPrice } });
    };

    const handleGenerateBreakdown = (forceShowCandidates: boolean = false) => {
        if (!item.originalTask) return;

        sileo.show({
            title: forceShowCandidates ? "Buscando similares..." : "Generando descompuesto...",
            description: "La IA está analizando la partida.",
            icon: <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
        });

        startTransition(async () => {
            const result = await generateBreakdownAction(item.originalTask!, leadId);
            if (result.success && result.items && result.items.length > 0) {
                if (forceShowCandidates && (result as any).candidates?.length > 0) {
                    sileo.info({ title: "Candidatos encontrados", description: "Revisa las opciones extraídas del catálogo." });
                    onUpdate(item.id, {
                        item: {
                            ...item.item!,
                            candidates: (result as any).candidates
                        }
                    });
                    setShowInlineCandidates(true);
                } else {
                    const match: any = result.items[0];

                    onUpdate(item.id, {
                        item: {
                            ...item.item!,
                            unitPrice: match.unitPrice,
                            description: match.description,
                            unit: match.unit || item.item?.unit || 'ud',
                            code: match.code,
                            totalPrice: match.unitPrice * (item.item?.quantity || 1),
                            breakdown: match.breakdown
                        },
                        isDirty: true
                    });
                    sileo.success({ title: "Descompuesto generado", description: `${result.items.length} elementos analizados.` });
                }
            } else if ((result as any).humanInTheLoop && (result as any).candidates?.length > 0) {
                // The AI rejected all, but we have candidates. Show them inline.
                sileo.info({ title: "Atención requerida", description: "La IA encontró opciones pero necesita tu decisión." });
                onUpdate(item.id, {
                    item: {
                        ...item.item!,
                        candidates: (result as any).candidates
                    }
                });
                setShowInlineCandidates(true);
            } else {
                sileo.error({ title: "Sin resultados", description: result.error || "No se pudo generar el descompuesto." });
            }
        });
    };

    const hasBreakdown = (item.item?.breakdown?.length ?? 0) > 0;

    return (
        <Reorder.Item
            value={item}
            id={item.id}
            as="div"
            dragListener={false}
            dragControls={controls}
            className="flex flex-col group relative hover:bg-slate-50 dark:hover:bg-white/5 hover:text-foreground transition-all duration-300 border-b border-slate-100 dark:border-white/5 data-[state=selected]:bg-slate-100 font-sans"
        >
            <div className={cn(
                "flex items-start w-full min-w-[800px]",
                hasBreakdown && "bg-gradient-to-r from-purple-500/5 via-transparent to-transparent dark:from-purple-500/10",
                isDeviated && "bg-amber-50/30 dark:bg-amber-900/10",
                isPending && "opacity-50 pointer-events-none scale-[0.99] blur-[1px]",
                item.item?.code === 'GENERIC-EXPLICIT' && "bg-amber-50/50 dark:bg-amber-900/20",
                showInlineCandidates && "border-b-0"
            )}>
            {/* Left AI Highlight Bar & Drag Handle */}
            <div className="w-[40px] shrink-0 p-2 text-center text-slate-300 relative">
                {hasBreakdown && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-purple-400 to-indigo-600 rounded-r-md opacity-80" />
                )}
                <div onPointerDown={(e) => controls.start(e)} className="cursor-grab active:cursor-grabbing flex justify-center mt-1.5 border-l-0">
                    <GripVertical className="w-4 h-4" />
                </div>
            </div>

            {/* Type Icon */}
            <div className="w-[50px] shrink-0 p-2 text-center pt-3">
                {isPending ? (
                    <div className="flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-purple-500" /></div>
                ) : (
                    item.type === 'MATERIAL' ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mx-auto">
                                        <Package className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Material</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-white/10 text-slate-500 flex items-center justify-center mx-auto">
                            <Hammer className="w-4 h-4" />
                        </div>
                    )
                )}
            </div>

            {/* Code & Description - TEXTAREA for wrapping */}
            <div className="flex-1 min-w-[300px] p-2">
                <div className="flex flex-col gap-1">
                    <Textarea
                        value={item.originalTask || ""}
                        onChange={(e) => onUpdate(item.id, { originalTask: e.target.value })}
                        disabled={isReadOnly}
                        className="min-h-[24px] resize-y p-0 border-none shadow-none focus-visible:ring-0 bg-transparent text-sm font-medium leading-relaxed overflow-hidden"
                        placeholder="Descripción de la partida..."
                        rows={1}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                        }}
                    />
                    <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                            "text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors",
                            item.item?.code === 'GENERIC-EXPLICIT'
                                ? "text-amber-700 bg-amber-100 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800/50 font-semibold"
                                : "text-slate-400 bg-slate-50 dark:bg-white/5"
                        )}>
                            {item.item?.code || "---"}
                        </span>
                        {/* Breakdown Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-5 px-2 text-[10px] font-semibold transition-all shadow-sm",
                                hasBreakdown
                                    ? "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 hover:from-purple-200 hover:to-indigo-200 dark:from-purple-900/30 dark:to-indigo-900/30 dark:text-purple-300 ring-1 ring-purple-500/20"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10"
                            )}
                            onClick={() => onOpenBreakdown(item)}
                        >
                            <ListTree className="w-3 h-3 mr-1" />
                            {hasBreakdown ? 'Ver Descompuesto IA' : 'Sin descompuesto'}
                            {hasBreakdown && <Sparkles className="w-3 h-3 ml-1 text-indigo-500 animate-pulse" />}
                        </Button>

                        {/* Search Similar Items Button */}
                        {!isReadOnly && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 px-2 text-[10px] font-semibold transition-all shadow-sm bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 border border-slate-100 dark:border-white/10 disabled:opacity-50 disabled:pointer-events-none"
                                onClick={() => handleGenerateBreakdown(true)}
                                disabled={isPending}
                            >
                                <Search className="w-3 h-3 mr-1" />
                                Buscar similares
                            </Button>
                        )}

                        {/* Show Pre-computed Candidates Button */}
                        {hasCandidates && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 px-2 text-[10px] font-semibold transition-all shadow-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 disabled:opacity-50 disabled:pointer-events-none"
                                onClick={() => setShowInlineCandidates(!showInlineCandidates)}
                                disabled={isReadOnly}
                            >
                                <Wand2 className="w-3 h-3 mr-1" />
                                {showInlineCandidates ? 'Ocultar similares' : 'Ver similares'}
                            </Button>
                        )}

                        {isDeviated && (
                            <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-1 rounded">
                                <AlertTriangle className="w-3 h-3" /> Desviación {Math.round(deviation * 100)}%
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Unit */}
            <div className="w-[80px] shrink-0 p-2 pt-3">
                <EditableCell
                    value={item.item?.unit || 'ud'}
                    onChange={(val) => onUpdate(item.id, { item: { ...item.item!, unit: val as string } })}
                    className="text-center text-xs font-medium text-slate-500 bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-zinc-900 w-full"
                />
            </div>

            {/* Quantity */}
            <div className="w-[100px] shrink-0 p-2 text-right pt-3">
                <EditableCell
                    value={item.item?.quantity || 0}
                    onChange={(val) => onUpdate(item.id, { item: { ...item.item!, quantity: Number(val) } })}
                    type="number"
                    className="text-right text-sm font-mono text-slate-700 dark:text-slate-200 bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-zinc-900 w-full pr-2"
                />
            </div>

            {/* Unit Price */}
            <div className="w-[120px] shrink-0 p-2 text-right pt-3">
                <div className="relative group/price">
                    <EditableCell
                        value={displayUnitPrice}
                        onChange={(val) => onUpdate(item.id, { item: { ...item.item!, unitPrice: Number(val) } })}
                        type="currency"
                        className={cn(
                            "text-right text-sm font-mono text-slate-700 dark:text-slate-200 bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-zinc-900 w-full",
                            item.item?.unitPrice === 0 && "text-red-500 font-bold"
                        )}
                    />
                    {showGhostMode && item.originalState && (
                        <div className="absolute -bottom-4 right-2 text-[10px] text-slate-400 line-through">
                            {item.originalState.unitPrice.toFixed(2)}€
                        </div>
                    )}
                </div>
            </div>

            {/* Total Price */}
            <div className="w-[120px] shrink-0 p-2 text-right font-bold text-slate-700 dark:text-white font-mono bg-slate-50/30 dark:bg-white/5 pt-3">
                <EditableCell
                    value={displayTotal}
                    onChange={handleTotalChange}
                    type="currency"
                    className="text-right bg-transparent border-transparent w-full"
                />
            </div>

            {/* Actions */}
            <div className="w-[50px] shrink-0 p-2 text-center pt-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-purple-200/50 dark:border-purple-900/50 shadow-2xl rounded-xl">
                        {!isReadOnly && (
                            <>
                                <DropdownMenuLabel className={cn(
                                    "flex items-center gap-2 text-xs uppercase tracking-widest font-bold mb-1",
                                    isReadOnly ? "text-slate-300 dark:text-slate-600" : "text-slate-400"
                                )}>
                                    <Sparkles className={cn("w-3.5 h-3.5", isReadOnly ? "text-purple-300 dark:text-purple-800" : "text-purple-500")} />
                                    Acciones Cógnitivas IA
                                </DropdownMenuLabel>
                                <DropdownMenuItem 
                                    onClick={(e) => {
                                        if (isReadOnly) {
                                            e.preventDefault();
                                            return;
                                        }
                                        handleGenerateBreakdown(false);
                                    }} 
                                    disabled={isReadOnly}
                                    className={cn(
                                        "text-sm font-medium focus:bg-purple-50 dark:focus:bg-purple-900/20 focus:text-purple-700 dark:focus:text-purple-300 rounded-lg px-3 py-2 transition-colors",
                                        isReadOnly ? "opacity-50 pointer-events-none" : "cursor-pointer"
                                    )}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="flex items-center gap-2"><Wand2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />Buscar Partida en Catálogo</span>
                                        <span className="text-[10px] text-slate-400 font-normal">Alinea con Catálogos Oficiales o presenta Opciones RAG</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}

                        <DropdownMenuItem className="cursor-pointer" onClick={() => onOpenBreakdown(item)}>
                            <Search className="w-4 h-4 mr-2" />
                            Ver Detalles
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={(e) => {
                                if (isReadOnly) {
                                    e.preventDefault();
                                    return;
                                }
                                onOpenMarkup(item.id);
                            }} 
                            disabled={isReadOnly}
                            className={isReadOnly ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                        >
                            <Percent className="w-4 h-4 mr-2 text-slate-500" />
                            Ajustar Precio a Partida
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                            onClick={(e) => {
                                if (isReadOnly) {
                                    e.preventDefault();
                                    return;
                                }
                                onDuplicate(item.id);
                            }} 
                            disabled={isReadOnly}
                            className={isReadOnly ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                            className={cn(
                                "text-red-600 focus:text-red-700 focus:bg-red-50",
                                isReadOnly ? "opacity-50 pointer-events-none" : "cursor-pointer"
                            )}
                            disabled={isReadOnly}
                            onClick={(e) => {
                                if (isReadOnly) {
                                    e.preventDefault();
                                    return;
                                }
                                onRemove(item.id);
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
            
            {/* Inline Candidates Row */}
            {showInlineCandidates && hasCandidates && (
                <div className="w-full min-w-[800px] bg-slate-50/80 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 relative shadow-inner flex">
                    <div className="p-0 bg-indigo-500/20 w-[40px] shrink-0"></div>
                    <div className="p-4 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Candidatos sugeridos por IA</h4>
                            <span className="text-xs text-slate-500 ml-2">Selecciona la opción idónea para sobreescribir esta partida. Mostrando top 3 opciones.</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {item.item?.candidates?.slice(0, 3).map((c: any) => (
                                <div key={c.code} className="flex flex-col border border-slate-200 dark:border-white/10 rounded-xl p-3 transition-all cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 bg-white dark:bg-black/20 shadow-sm hover:shadow-md" onClick={() => {
                                    onUpdate(item.id, {
                                        item: {
                                            ...item.item!,
                                            unitPrice: c.unitPrice,
                                            description: c.description,
                                            unit: c.unit || item.item?.unit || 'ud',
                                            code: c.code,
                                            totalPrice: c.unitPrice * (item.item?.quantity || 1),
                                            breakdown: c.breakdown
                                        },
                                        isDirty: true
                                    });
                                    setShowInlineCandidates(false);
                                    sileo.success({ title: "Partida Aplicada", description: `Se ha sobreescrito con la partida ${c.code}.` });
                                }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline" className="font-mono text-[10px] bg-slate-50 dark:bg-white/5">{c.code}</Badge>
                                        <span className="font-bold text-sm text-indigo-700 dark:text-indigo-400">{formatCurrency(c.unitPrice)}/{c.unit}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3" title={c.description}>{c.description}</p>
                                    <div className="mt-3 text-right">
                                        <Button size="sm" variant="ghost" className="h-6 text-[10px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/60 dark:text-indigo-300">Aplicar</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Reorder.Item>
    );
};

const ChapterSection = ({
    chapterName,
    items,
    onReorder,
    onUpdate,
    onRemove,
    onDuplicate,
    onRename,
    onDelete,
    showGhostMode,
    isExecutionOnly,
    onOpenBreakdown,
    onOpenMarkup,
    isReadOnly,
    leadId
}: any) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState(chapterName);

    const handleRenameSubmit = () => {
        if (nameDraft.trim() && nameDraft !== chapterName) {
            onRename(nameDraft.trim());
        }
        setIsEditingName(false);
    };

    const totalChapter = items.reduce((acc: number, i: any) => {
        let total = i.item?.totalPrice || 0;
        if (isExecutionOnly && i.item?.breakdown) {
            const vCost = i.item.breakdown
                .filter((comp: any) => comp.is_variable === true)
                .reduce((cAcc: number, comp: any) => {
                    const cPrice = comp.unitPrice || comp.price || 0;
                    const cQuantity = comp.quantity || comp.yield || 1;
                    return cAcc + (comp.totalPrice || comp.total || (cPrice * cQuantity));
                }, 0);
            total = Math.max(0, total - vCost);
        }
        return acc + total;
    }, 0);

    return (
        <>
            {/* Chapter Header */}
            <div className="border-t border-slate-200 dark:border-white/10 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border-b">
                <div className="flex items-center w-full min-w-[800px]">
                    {/* Left spacing to match Drag Handle + Type + Title offset */}
                    <div className="w-[40px] shrink-0 p-3"></div>
                    <div className="w-[50px] shrink-0 p-3"></div>
                            
                    {/* Chapter Title Container (Matches Descripción / Código) */}
                    <div className="flex-1 min-w-[300px] p-2 flex items-center justify-start gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-slate-400"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </Button>

                        {isEditingName ? (
                            <Input
                                autoFocus
                                value={nameDraft}
                                onChange={(e) => setNameDraft(e.target.value)}
                                onBlur={handleRenameSubmit}
                                onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                                className="h-7 w-64 font-bold text-lg bg-white"
                            />
                        ) : (
                            <div
                                className="font-bold text-lg text-slate-800 dark:text-white cursor-pointer hover:underline decoration-dashed underline-offset-4 flex items-center gap-3"
                                onClick={() => setIsEditingName(true)}
                            >
                                {chapterName}
                                <Badge variant="secondary" className="font-normal text-xs text-slate-500">
                                    {items.length} ítems
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Empty Unit / Quantity / Unit Price */}
                    <div className="w-[80px] shrink-0 p-2"></div>
                    <div className="w-[100px] shrink-0 p-2"></div>
                    <div className="w-[120px] shrink-0 p-2"></div>

                    {/* Total Price */}
                    <div className="w-[120px] shrink-0 p-2 text-right">
                        <span className="font-mono font-bold text-slate-800 dark:text-white">
                            {formatCurrency(totalChapter)}
                        </span>
                    </div>
                                
                    {/* Actions */}
                    <div className="w-[50px] shrink-0 p-2 text-center pt-2">
                        {!isReadOnly && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onOpenMarkup(chapterName)}>
                                    <Percent className="w-4 h-4 mr-2 text-slate-500" />
                                    Ajustar Precios de Capítulo
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsEditingName(true)}>Renombrar</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={onDelete}>Eliminar Capítulo</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>

            {/* Draggable Items */}
            {isExpanded && (
                <Reorder.Group
                    as="div"
                    axis="y"
                    values={items}
                    onReorder={onReorder}
                    className="flex flex-col"
                >
                    {items.map((item: any) => (
                        <TableRowItem
                            key={item.id}
                            item={item}
                            onUpdate={onUpdate}
                            onRemove={onRemove}
                            onDuplicate={onDuplicate}
                            showGhostMode={showGhostMode}
                            isExecutionOnly={isExecutionOnly}
                            onOpenBreakdown={onOpenBreakdown}
                            onOpenMarkup={onOpenMarkup}
                            isReadOnly={isReadOnly}
                            leadId={leadId}
                        />
                    ))}
                    {items.length === 0 && (
                        <div className="text-center py-8 text-slate-400 border-dashed border-b w-full">
                            Arrastra partidas aquí o añade nuevas desde la biblioteca
                        </div>
                    )}
                </Reorder.Group>
            )}
        </>
    );
};

export function BudgetEditorTable({
    items,
    chapters,
    onReorder,
    onUpdate,
    onRemove,
    onDuplicate,
    onAddChapter,
    onRemoveChapter,
    onRenameChapter,
    onReorderChapters,
    showGhostMode,
    isExecutionOnly,
    isAdmin,
    applyMarkup,
    isReadOnly,
    leadId
}: BudgetEditorTableProps) {
    const [breakdownItem, setBreakdownItem] = useState<EditableBudgetLineItem | null>(null);
    const [breakdownOpen, setBreakdownOpen] = useState(false);

    // Markup Dialog State
    const [markupState, setMarkupState] = useState<{ open: boolean; scope: 'global' | 'chapter' | 'item'; targetId?: string; percentage: number }>({ open: false, scope: 'global', percentage: 0 });

    const handleOpenBreakdown = (item: EditableBudgetLineItem) => {
        setBreakdownItem(item);
        setBreakdownOpen(true);
    };

    return (
        <div className="w-full bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden auto-cols-auto overflow-x-auto">
            <div className="flex flex-col min-w-[800px]">
                {/* Header Grid */}
                <div className="flex bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-sm font-medium text-slate-500">
                    <div className="w-[40px] shrink-0 p-3"></div>
                    <div className="w-[50px] shrink-0 text-center p-3">Tipo</div>
                    <div className="flex-1 min-w-[300px] p-3">Descripción / Código</div>
                    <div className="w-[80px] shrink-0 text-center p-3">Ud</div>
                    <div className="w-[100px] shrink-0 text-right p-3">Cant.</div>
                    <div className="w-[120px] shrink-0 text-right p-3">Precio</div>
                    <div className="w-[120px] shrink-0 text-right p-3">Total</div>
                    <div className="w-[50px] shrink-0 p-3"></div>
                </div>

                {chapters.map((chapterName) => (
                    <ChapterSection
                        key={chapterName}
                        chapterName={chapterName}
                        items={items.filter(i => i.chapter === chapterName)}
                        onReorder={onReorder}
                        onUpdate={onUpdate}
                        onRemove={onRemove}
                        onDuplicate={onDuplicate}
                        onRename={(newName: string) => onRenameChapter(chapterName, newName)}
                        onDelete={() => onRemoveChapter(chapterName)}
                        showGhostMode={showGhostMode}
                        isExecutionOnly={isExecutionOnly}
                        onOpenBreakdown={handleOpenBreakdown}
                        onOpenMarkup={(chapterName: string) => setMarkupState({ open: true, scope: 'chapter', targetId: chapterName, percentage: 0 })}
                        isReadOnly={isReadOnly}
                        leadId={leadId}
                    />
                ))}
            </div>

            {!isReadOnly && (
                <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-4">
                    <Button
                        variant="outline"
                        className="border-dashed"
                        onClick={() => onAddChapter(`Capítulo ${chapters.length + 1}`)}
                    >
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Nuevo Capítulo
                    </Button>
                </div>
            )}

            <BudgetBreakdownSheet
                item={breakdownItem}
                open={breakdownOpen}
                onOpenChange={setBreakdownOpen}
                onUpdate={onUpdate}
                isAdmin={isAdmin}
            />

            {/* Markup Adjustment Dialog */}
            <Dialog open={markupState.open} onOpenChange={(open) => setMarkupState({ ...markupState, open })}>
                <DialogContent className="max-w-md bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle>Ajustar Precios ({markupState.scope === 'global' ? 'Presupuesto Completo' : markupState.scope === 'chapter' ? 'Capítulo' : 'Partida'})</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-sm text-slate-500">
                            Añade un porcentaje positivo para incrementar los precios o negativo para hacer un descuento automatizado.
                        </p>
                        <div className="relative">
                            <Input
                                type="number"
                                autoFocus
                                value={Number.isNaN(markupState.percentage) ? '' : markupState.percentage}
                                onChange={(e) => setMarkupState({ ...markupState, percentage: Number(e.target.value) })}
                                className="pr-8"
                            />
                            <span className="absolute right-3 top-2.5 text-slate-400 font-medium">%</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMarkupState({ ...markupState, open: false })}>Cancelar</Button>
                        <Button onClick={() => {
                            if (applyMarkup) applyMarkup(markupState.scope, markupState.percentage, markupState.targetId);
                            setMarkupState({ ...markupState, open: false });
                        }}>Aplicar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
