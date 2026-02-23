'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, ChevronDown, Download, Building2, User, Loader2, UploadCloud, Receipt, Eye, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DemoBudgetDocument } from '@/components/pdf/DemoBudgetDocument';
import { cn } from '@/lib/utils';
import { Budget } from '@/backend/budget/domain/budget';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/logo';

interface DemoBudgetViewerProps {
    budgetData: Budget;
    onDownloadPdf: (customData: CustomPdfData) => Promise<void>;
    isGeneratingPdf: boolean;
}

export interface CustomPdfData {
    companyName: string;
    cif: string;
    address: string;
    clientName: string;
    logoFile: File | null;
}

export function DemoBudgetViewer({ budgetData, onDownloadPdf, isGeneratingPdf }: DemoBudgetViewerProps) {
    const t = useTranslations('budgetRequest.demoViewer');

    // Default open first chapter
    const defaultExpanded: Record<string, boolean> = {};
    if (budgetData.chapters.length > 0) {
        defaultExpanded[budgetData.chapters[0].id] = true;
    }

    const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(defaultExpanded);
    const [editableItems, setEditableItems] = useState<Record<string, { quantity: number; price: number }>>({});

    // UX Enhancements: Local state for mutation
    const [localChapters, setLocalChapters] = useState(budgetData.chapters);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editDescription, setEditDescription] = useState<string>('');

    // Customization Form State
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [cif, setCif] = useState('');
    const [address, setAddress] = useState('');
    const [clientName, setClientName] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);

    // Initialize editable items on mount
    useEffect(() => {
        const initial: Record<string, { quantity: number; price: number }> = {};
        budgetData.chapters.forEach(chapter => {
            chapter.items.forEach(item => {
                initial[item.id] = { quantity: item.quantity, price: item.unitPrice };
            });
        });
        setEditableItems(initial);
    }, [budgetData]);

    const toggleChapter = (id: string) => {
        setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleItemChange = (itemId: string, field: 'quantity' | 'price', value: string) => {
        const numValue = parseFloat(value) || 0;
        setEditableItems(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId] || { quantity: 0, price: 0 },
                [field]: value === '' ? 0 : numValue
            }
        }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogo(e.target.files[0]);
        }
    };

    const handleDeleteItem = (chapterId: string, itemId: string) => {
        setLocalChapters(prev => prev.map(ch => {
            if (ch.id === chapterId) {
                return { ...ch, items: ch.items.filter((i: any) => i.id !== itemId) };
            }
            return ch;
        }));
    };

    const handleStartEdit = (itemId: string, currentDesc: string) => {
        setEditingItemId(itemId);
        setEditDescription(currentDesc);
    };

    const handleSaveEdit = (chapterId: string, itemId: string) => {
        setLocalChapters(prev => prev.map(ch => {
            if (ch.id === chapterId) {
                return {
                    ...ch,
                    items: ch.items.map((i: any) => i.id === itemId ? { ...i, description: editDescription } : i)
                };
            }
            return ch;
        }));
        setEditingItemId(null);
    };

    const handleCancelEdit = () => {
        setEditingItemId(null);
        setEditDescription('');
    };

    const calculateTotals = () => {
        let executionMaterial = 0;
        localChapters.forEach(chapter => {
            chapter.items.forEach((item: any) => {
                const current = editableItems[item.id] || { quantity: item.quantity, price: item.unitPrice };
                executionMaterial += current.quantity * current.price;
            });
        });

        const overheadExpenses = executionMaterial * 0.13;
        const industrialBenefit = executionMaterial * 0.06;
        const subtotal = executionMaterial + overheadExpenses + industrialBenefit;
        const tax = subtotal * 0.21;
        const total = subtotal + tax;

        return { executionMaterial, subtotal, tax, total };
    };

    const totals = calculateTotals();

    const handleDownloadClick = async () => {
        setIsGeneratingLocal(true);
        try {
            const { pdf } = await import('@react-pdf/renderer');

            const pdfItems = localChapters.flatMap(chapter =>
                chapter.items.map((item: any) => {
                    const current = editableItems[item.id] || { quantity: item.quantity, price: item.unitPrice };
                    return {
                        chapter: chapter.name,
                        originalTask: item.description,
                        item: {
                            code: '',
                            description: item.description,
                            unitPrice: current.price,
                            quantity: current.quantity,
                            unit: item.unit || 'ud',
                            totalPrice: current.quantity * current.price,
                        }
                    };
                })
            );

            let logoUrl = undefined;
            if (logo) {
                logoUrl = URL.createObjectURL(logo);
            }

            const doc = (
                <DemoBudgetDocument
                    budgetNumber={`DEMO-${Math.floor(Math.random() * 10000)}`}
                    clientName={clientName || t('pdf.clientNamePlaceholder', { fallback: 'Cliente Demo' })}
                    clientEmail={companyName || 'Empresa de Demostración'}
                    clientAddress={address || ''}
                    items={pdfItems}
                    costBreakdown={{
                        materialExecutionPrice: totals.executionMaterial,
                        overheadExpenses: totals.executionMaterial * 0.13,
                        tax: totals.tax,
                        total: totals.total
                    }}
                    date={new Date().toLocaleDateString('es-ES')}
                    logoUrl={logoUrl}
                />
            );

            const asPdf = pdf(doc);
            const blob = await asPdf.toBlob();

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Presupuesto-${companyName.replace(/\s+/g, '-') || 'Demo'}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);
            if (logoUrl) URL.revokeObjectURL(logoUrl);

            onDownloadPdf({
                companyName,
                cif,
                address,
                clientName,
                logoFile: logo
            });

        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGeneratingLocal(false);
        }
    };

    return (
        <div className="w-full h-[85vh] md:h-[800px] flex flex-col lg:flex-row gap-6 p-2 md:p-6 pb-24 lg:pb-6 overflow-hidden bg-transparent text-zinc-300 font-sans relative">
            {/* Main Editor Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1 flex flex-col bg-[#050505] border border-white/5 shadow-2xl overflow-hidden rounded-2xl relative ring-1 ring-white/10"
            >
                {/* Header */}
                <div className="p-4 md:px-8 md:py-6 border-b border-white/5 bg-white/[0.01] backdrop-blur-xl flex justify-between items-center z-10 sticky top-0 relative">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8c42f] to-transparent opacity-40"></div>
                    <div>
                        <div className="mb-4">
                            <Logo className="h-6 flex items-center" width={80} height={24} />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-1 flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-[#e8c42f]" />
                            {t('title', { fallback: 'Borrador Interactivo' })}
                        </h2>
                        <p className="text-sm text-zinc-500 font-medium">
                            {t('description', { fallback: 'Edita unidades y precios. Los totales se actualizan en tiempo real.' })}
                        </p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">Total Proyecto</p>
                        <p className="text-2xl font-mono text-white tracking-tight">
                            €{totals.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
                    <div className="p-4 md:p-8 space-y-4">
                        {localChapters.map((chapter, index) => {
                            const isExpanded = expandedChapters[chapter.id];

                            // Calculate chapter total real-time
                            let chapterTotal = 0;
                            chapter.items.forEach((item: any) => {
                                const current = editableItems[item.id] || { quantity: item.quantity, price: item.unitPrice };
                                chapterTotal += current.quantity * current.price;
                            });

                            return (
                                <motion.div
                                    key={chapter.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border border-white/5 bg-[#0a0a0a] rounded-xl overflow-hidden shadow-sm transition-all focus-within:ring-1 focus-within:ring-white/10"
                                >
                                    <button
                                        onClick={() => toggleChapter(chapter.id)}
                                        className="w-full flex items-center justify-between p-5 md:px-6 hover:bg-[#e8c42f]/[0.02] transition-colors focus:outline-none"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-8 h-8 rounded bg-[#e8c42f]/10 border border-[#e8c42f]/20 flex items-center justify-center font-mono text-xs text-[#e8c42f] font-semibold">
                                                {(index + 1).toString().padStart(2, '0')}
                                            </div>
                                            <h3 className="font-medium text-white/90 text-sm tracking-wide uppercase">
                                                {chapter.name}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <span className="font-mono text-sm text-white/80 transition-all">
                                                    €{chapterTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-zinc-600"
                                            >
                                                <ChevronDown className="w-5 h-5" />
                                            </motion.div>
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                            >
                                                <div className="px-2 pb-2">
                                                    <div className="bg-black/40 rounded-lg border border-white/5 p-1 divide-y divide-white/5">
                                                        {chapter.items.map((item: any) => {
                                                            const current = editableItems[item.id] || { quantity: item.quantity, price: item.unitPrice };
                                                            const itemTotal = current.quantity * current.price;
                                                            const isEditingId = editingItemId === item.id;

                                                            return (
                                                                <div key={item.id} className="group/row flex flex-col xl:flex-row xl:items-start justify-between p-3 gap-4 hover:bg-white/[0.02] transition-colors rounded-md relative select-none">

                                                                    {/* Action Buttons (Hover) */}
                                                                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover/row:opacity-100 transition-opacity z-10 xl:static xl:opacity-100 xl:mt-2 xl:-mr-2 xl:self-start">
                                                                        {!isEditingId && (
                                                                            <button onClick={() => handleStartEdit(item.id, item.description)} className="p-1.5 text-zinc-500 hover:text-white bg-black/50 hover:bg-white/10 rounded-md transition-colors" title="Editar descripción">
                                                                                <Edit2 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        )}
                                                                        <button onClick={() => handleDeleteItem(chapter.id, item.id)} className="p-1.5 text-red-500/70 hover:text-red-400 bg-black/50 hover:bg-red-500/10 rounded-md transition-colors" title="Eliminar partida">
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>

                                                                    <div className="flex-1 pr-4 pt-1 xl:pt-0">
                                                                        {isEditingId ? (
                                                                            <div className="flex flex-col gap-2">
                                                                                <textarea
                                                                                    autoFocus
                                                                                    value={editDescription}
                                                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                                                    className="w-full min-h-[80px] bg-[#111] text-sm text-zinc-300 p-2 rounded-md border border-white/10 focus:border-[#e8c42f]/50 focus:ring-1 focus:ring-[#e8c42f]/50 resize-none"
                                                                                />
                                                                                <div className="flex items-center gap-2">
                                                                                    <button onClick={() => handleSaveEdit(chapter.id, item.id)} className="flex items-center gap-1 text-xs bg-[#e8c42f]/10 text-[#e8c42f] hover:bg-[#e8c42f]/20 px-2 py-1.5 rounded transition-colors">
                                                                                        <Check className="w-3 h-3" /> Guardar
                                                                                    </button>
                                                                                    <button onClick={handleCancelEdit} className="flex items-center gap-1 text-xs bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded transition-colors">
                                                                                        <X className="w-3 h-3" /> Cancelar
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-sm text-zinc-300 leading-relaxed font-light line-clamp-2 md:line-clamp-none transition-all pr-8 xl:pr-0">
                                                                                {item.description}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center justify-between w-full mt-3 xl:mt-0 xl:w-auto gap-2 xl:gap-3 shrink-0 self-end xl:self-start xl:pt-1">
                                                                        {/* Quantity Input */}
                                                                        <div className="relative flex flex-col gap-1 items-end">
                                                                            <span className="text-[10px] text-zinc-600 uppercase font-semibold tracking-wider">{t('table.units', { fallback: 'Cant.' })}</span>
                                                                            <div className="relative group/input">
                                                                                <Input
                                                                                    type="number"
                                                                                    inputMode="decimal"
                                                                                    min="0"
                                                                                    step="0.1"
                                                                                    className="w-20 h-9 bg-[#111111] border-white/10 text-right pr-8 font-mono text-sm focus:ring-1 focus:ring-[#e8c42f]/50 focus:border-[#e8c42f]/50 transition-colors"
                                                                                    value={current.quantity}
                                                                                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                                                                />
                                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono pointer-events-none">
                                                                                    {item.unit || 'u'}
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        <span className="text-zinc-700 font-light mt-4">×</span>

                                                                        {/* Price Input */}
                                                                        <div className="relative flex flex-col gap-1 items-end">
                                                                            <span className="text-[10px] text-zinc-600 uppercase font-semibold tracking-wider">{t('table.price', { fallback: 'Precio' })}</span>
                                                                            <div className="relative group/input">
                                                                                <Input
                                                                                    type="number"
                                                                                    inputMode="decimal"
                                                                                    min="0"
                                                                                    step="0.01"
                                                                                    className="w-24 h-9 bg-[#111111] border-white/10 text-right pr-6 font-mono text-sm focus:ring-1 focus:ring-[#e8c42f]/50 focus:border-[#e8c42f]/50 transition-colors"
                                                                                    value={current.price}
                                                                                    onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                                                                                />
                                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono pointer-events-none">
                                                                                    €
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        {/* Subtotal */}
                                                                        <div className="w-24 text-right flex flex-col gap-1 items-end ml-4">
                                                                            <span className="text-[10px] text-zinc-600 uppercase font-semibold tracking-wider">Subtotal</span>
                                                                            <span className="font-mono text-white/90 text-sm mt-[6px]">
                                                                                €{itemTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            {/* Sidebar Section (Desktop) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="hidden lg:flex w-full lg:w-[400px] flex-col gap-4 shrink-0"
            >
                {/* Customization Card */}
                <div className="bg-[#050505] border border-white/5 shadow-2xl overflow-hidden rounded-2xl ring-1 ring-white/10 p-6 flex-1 flex flex-col relative">
                    <div className="mb-6 relative z-10">
                        <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
                            <Eye className="w-4 h-4 text-zinc-400" />
                            {t('pdf.title', { fallback: 'Personalizar Documento' })}
                        </h3>
                        <p className="text-sm text-zinc-500 font-light leading-relaxed">
                            {t('pdf.description', { fallback: 'Añade tus datos corporativos. Los cálculos actualizados se incluirán en el documento final.' })}
                        </p>
                    </div>

                    <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                        {/* Summary Block */}
                        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="flex justify-between items-end">
                                <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{t('totals.pem', { fallback: 'P.E.M.' })}</span>
                                <span className="font-mono text-sm text-zinc-400">€{totals.executionMaterial.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{t('totals.tax', { fallback: 'IVA (21%)' })}</span>
                                <span className="font-mono text-sm text-zinc-400">€{totals.tax.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                            <div className="flex justify-between items-end">
                                <span className="text-sm text-zinc-300 font-semibold tracking-wide uppercase">{t('totals.total', { fallback: 'Total' })}</span>
                                <span className="font-mono text-xl text-[#e8c42f] tracking-tight font-medium">
                                    €{totals.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="companyName" className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">{t('pdf.companyName', { fallback: 'Empresa Emisora' })}</Label>
                                <Input
                                    id="companyName"
                                    placeholder="Nombre corporativo"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="bg-[#0a0a0a] border-white/10 focus:border-white/20 h-10 text-sm focus:ring-1 focus:ring-white/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cif" className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">{t('pdf.cif', { fallback: 'CIF / NIF' })}</Label>
                                    <Input
                                        id="cif"
                                        placeholder="Ej: B12345678"
                                        value={cif}
                                        onChange={(e) => setCif(e.target.value)}
                                        className="bg-[#0a0a0a] border-white/10 focus:border-white/20 h-10 text-sm focus:ring-1 focus:ring-white/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientName" className="text-xs text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {t('pdf.clientName', { fallback: 'Cliente' })}
                                    </Label>
                                    <Input
                                        id="clientName"
                                        placeholder="Para quién..."
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        className="bg-[#0a0a0a] border-white/10 focus:border-white/20 h-10 text-sm focus:ring-1 focus:ring-white/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">{t('pdf.address', { fallback: 'Dirección Comercial' })}</Label>
                                <Input
                                    id="address"
                                    placeholder="Calle Principal 123..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="bg-[#0a0a0a] border-white/10 focus:border-white/20 h-10 text-sm focus:ring-1 focus:ring-white/20"
                                />
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">{t('pdf.logo', { fallback: 'Logotipo (Opcional)' })}</Label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        id="logo-upload"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                    <div className="border border-dashed border-white/10 rounded-xl bg-[#0a0a0a] hover:bg-white/[0.02] hover:border-white/20 transition-all p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                                            <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-zinc-300 truncate">
                                                {logo ? logo.name : t('pdf.uploadHint', { fallback: 'Sube tu logo corporativo' })}
                                            </p>
                                            <p className="text-xs text-zinc-600">
                                                {logo ? 'Haz clic para cambiar' : 'PNG, JPG hasta 2MB'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="pt-6 mt-6 border-t border-white/10">
                        <Button
                            onClick={handleDownloadClick}
                            disabled={!companyName || !cif || !address || isGeneratingLocal || isGeneratingPdf}
                            className="w-full h-12 bg-[#e8c42f] text-black hover:bg-[#cdae25] disabled:bg-zinc-800 disabled:text-zinc-500 font-medium tracking-wide flex items-center gap-2 group transition-all rounded-lg"
                        >
                            {(isGeneratingLocal || isGeneratingPdf) ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                        <Loader2 className="w-4 h-4" />
                                    </motion.div>
                                    {t('pdf.generating', { fallback: 'Generando Documento...' })}
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 group-hover:-translate-y-[2px] transition-transform" />
                                    {t('pdf.button', { fallback: 'Descargar Documento Listo' })}
                                </>
                            )}
                        </Button>
                        <p className="text-[10px] text-center text-zinc-600 mt-3 font-medium uppercase tracking-widest">
                            Requiere completar los datos de empresa
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Sidebar Sheet */}
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                <SheetContent side="bottom" className="h-[90vh] p-0 bg-transparent border-none sm:max-w-none flex flex-col">
                    <VisuallyHidden.Root><SheetTitle>Opciones de Exportación</SheetTitle></VisuallyHidden.Root>
                    <div className="bg-[#050505] border border-white/5 shadow-2xl rounded-t-3xl ring-1 ring-white/10 p-6 flex-1 flex flex-col overflow-hidden relative">
                        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 shrink-0" />
                        <div className="mb-6 relative z-10 shrink-0">
                            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
                                <Eye className="w-4 h-4 text-zinc-400" />
                                {t('pdf.title', { fallback: 'Personalizar Documento' })}
                            </h3>
                            <p className="text-sm text-zinc-500 font-light leading-relaxed">
                                {t('pdf.description', { fallback: 'Añade tus datos corporativos. Los cálculos actualizados se incluirán en el documento final.' })}
                            </p>
                        </div>

                        <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                            {/* Summary Block */}
                            <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] space-y-3 relative overflow-hidden shrink-0">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{t('totals.pem', { fallback: 'P.E.M.' })}</span>
                                    <span className="font-mono text-sm text-zinc-400">€{totals.executionMaterial.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{t('totals.tax', { fallback: 'IVA (21%)' })}</span>
                                    <span className="font-mono text-sm text-zinc-400">€{totals.tax.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-zinc-300 font-semibold tracking-wide uppercase">{t('totals.total', { fallback: 'Total' })}</span>
                                    <span className="font-mono text-xl text-[#e8c42f] tracking-tight font-medium">
                                        €{totals.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* Form Fields Mobile */}
                            <div className="space-y-4 pt-2 pb-6 shrink-0">
                                <div className="space-y-2">
                                    <Label htmlFor="companyNameMobile" className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">{t('pdf.companyName', { fallback: 'Empresa Emisora' })}</Label>
                                    <Input
                                        id="companyNameMobile"
                                        placeholder="Nombre corporativo"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="bg-[#0a0a0a] border-white/10 focus:border-white/20 h-10 text-sm focus:ring-1 focus:ring-white/20"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cifMobile" className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">{t('pdf.cif', { fallback: 'CIF / NIF' })}</Label>
                                        <Input
                                            id="cifMobile"
                                            placeholder="Ej: B12345678"
                                            value={cif}
                                            onChange={(e) => setCif(e.target.value)}
                                            className="bg-[#0a0a0a] border-white/10 focus:border-white/20 h-10 text-sm focus:ring-1 focus:ring-white/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="clientNameMobile" className="text-xs text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {t('pdf.clientName', { fallback: 'Cliente' })}
                                        </Label>
                                        <Input
                                            id="clientNameMobile"
                                            placeholder="Para quién..."
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            className="bg-[#0a0a0a] border-white/10 focus:border-white/20 h-10 text-sm focus:ring-1 focus:ring-white/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="addressMobile" className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">{t('pdf.address', { fallback: 'Dirección Comercial' })}</Label>
                                    <Input
                                        id="addressMobile"
                                        placeholder="Calle Principal 123..."
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="bg-[#0a0a0a] border-white/10 focus:border-white/20 h-10 text-sm focus:ring-1 focus:ring-white/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="pt-4 mt-2 border-t border-white/10 shrink-0">
                            <Button
                                onClick={handleDownloadClick}
                                disabled={!companyName || !cif || !address || isGeneratingLocal || isGeneratingPdf}
                                className="w-full h-12 bg-[#e8c42f] text-black hover:bg-[#cdae25] disabled:bg-zinc-800 disabled:text-zinc-500 font-medium tracking-wide flex items-center gap-2 group transition-all rounded-lg"
                            >
                                {(isGeneratingLocal || isGeneratingPdf) ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {t('pdf.generating', { fallback: 'Generando Documento...' })}
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        {t('pdf.button', { fallback: 'Descargar Documento Listo' })}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Fixed Bottom Bar (Mobile) */}
            <div className="lg:hidden fixed bottom-6 left-4 right-4 bg-[#050505] border border-white/10 rounded-2xl p-4 z-50 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-between pointer-events-auto">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-0.5">Total Proyecto</p>
                    <p className="text-lg text-[#e8c42f] tracking-tight font-medium leading-none">
                        €{totals.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <Button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="h-10 bg-[#e8c42f] text-black hover:bg-[#cdae25] font-medium px-5 rounded-xl shadow-lg"
                >
                    Exportar
                </Button>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.2);
                }
                input[type='number']::-webkit-inner-spin-button, 
                input[type='number']::-webkit-outer-spin-button { 
                    -webkit-appearance: none; 
                    margin: 0; 
                }
            `}</style>
        </div>
    );
}
