import { getAllBudgetsAction } from '@/actions/budget/get-all-budgets.action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Sparkles,
    User,
    Calendar,
    Folder,
    ArrowRight,
    Search,
    Filter,
    ShieldCheck,
    Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

export default async function BudgetsListPage() {
    const budgets = await getAllBudgetsAction();

    // Helper to get source icon and label
    const getSourceInfo = (source?: string) => {
        switch (source) {
            case 'wizard':
                return { icon: Sparkles, label: 'Asistente IA', color: 'text-purple-600 bg-purple-100 dark:bg-purple-500/10 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
            case 'pdf_measurement':
                return { icon: FileText, label: 'Mediciones PDF', color: 'text-amber-600 bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
            default:
                return { icon: User, label: 'Manual', color: 'text-zinc-600 bg-zinc-100 dark:bg-zinc-500/10 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800' };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-zinc-900 to-black p-8 text-white shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Badge className="bg-white/10 text-blue-200 hover:bg-white/20 border-blue-500/30 backdrop-blur-md">
                            <Briefcase className="w-3 h-3 mr-1 text-blue-300" /> Gestión de Proyectos
                        </Badge>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight text-white">
                                Presupuestos y Obras
                            </h1>
                            <p className="text-zinc-400 max-w-xl mt-2 text-lg">
                                Centralice el control de sus propuestas. Supervise estados, orígenes y aprobaciones en tiempo real.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 hover:text-white bg-transparent backdrop-blur-sm hidden md:flex">
                            <Filter className="mr-2 h-4 w-4" />
                            Filtrar Vista
                        </Button>
                        <Link href="/dashboard/wizard">
                            <Button className="bg-white text-zinc-950 hover:bg-blue-50 font-semibold shadow-lg shadow-blue-900/20 transition-all duration-300 group">
                                <Sparkles className="mr-2 h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform" />
                                Nuevo con IA
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md group hover:-translate-y-1 transition-transform duration-300">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            Total Presupuestado
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                            {budgets.reduce((acc, b) => acc + (b.totalEstimated || 0), 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Volumen acumulado</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md group hover:-translate-y-1 transition-transform duration-300">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            Solicitudes Pendientes
                            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                            {budgets.filter(b => b.status === 'pending_review' || b.status === 'draft').length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Requieren acción</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md group hover:-translate-y-1 transition-transform duration-300">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            Tasa de Cierre
                            <Sparkles className="w-4 h-4 text-purple-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            --%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Conversión mensual</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-zinc-950/40 overflow-hidden bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-4 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            type="search"
                            placeholder="Buscar cliente, referencia..."
                            className="pl-9 bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                        />
                    </div>
                </div>

                <div className="relative overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-zinc-50/80 dark:bg-zinc-900/40 backdrop-blur-sm">
                            <TableRow className="hover:bg-transparent border-zinc-100 dark:border-zinc-800">
                                <TableHead className="w-[180px] font-semibold text-zinc-900 dark:text-zinc-100">Ref. & Fecha</TableHead>
                                <TableHead className="font-semibold text-zinc-900 dark:text-zinc-100">Cliente</TableHead>
                                <TableHead className="font-semibold text-zinc-900 dark:text-zinc-100">Origen</TableHead>
                                <TableHead className="font-semibold text-zinc-900 dark:text-zinc-100">Proyecto</TableHead>
                                <TableHead className="font-semibold text-zinc-900 dark:text-zinc-100">Estado</TableHead>
                                <TableHead className="text-right font-semibold text-zinc-900 dark:text-zinc-100">Importe</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {budgets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                                <Folder className="h-8 w-8 opacity-50" />
                                            </div>
                                            <p className="text-lg font-medium text-foreground">No hay presupuestos</p>
                                            <p className="text-sm">Genere uno nuevo para comenzar.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                budgets.map((budget) => {
                                    const sourceInfo = getSourceInfo(budget.source);
                                    const SourceIcon = sourceInfo.icon;

                                    return (
                                        <TableRow key={budget.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all border-zinc-50 dark:border-zinc-800/40">
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded w-fit group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
                                                        #{budget.id.substring(0, 8).toUpperCase()}
                                                    </span>
                                                    <div className="flex items-center text-xs text-muted-foreground">
                                                        <Calendar className="mr-1.5 h-3 w-3" />
                                                        {format(budget.createdAt, "d MMM yyyy", { locale: es })}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{budget.clientData.name}</span>
                                                    <span className="text-xs text-muted-foreground">{budget.clientData.email || 'Sin contacto'}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline" className={`gap-1.5 py-1 px-2.5 font-medium border shadow-sm ${sourceInfo.color}`}>
                                                    <SourceIcon className="h-3.5 w-3.5" />
                                                    {sourceInfo.label}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col gap-2 max-w-[200px]">
                                                    <div className="flex items-center gap-1.5">
                                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 border-zinc-200 dark:border-zinc-700 font-bold tracking-wider bg-white dark:bg-zinc-800">
                                                            {budget.type === 'quick' ? 'RÁPIDO' :
                                                                budget.type === 'new_build' ? 'OBRA NUEVA' : 'REFORMA'}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground truncate font-medium" title={(budget.clientData as any).description}>
                                                        {(budget.clientData as any).description || '—'}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    className={
                                                        budget.status === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 shadow-md' :
                                                            budget.status === 'sent' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 shadow-md' :
                                                                budget.status === 'pending_review' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 shadow-md' :
                                                                    'bg-zinc-500 hover:bg-zinc-600'
                                                    }
                                                >
                                                    {budget.status === 'pending_review' ? 'Pendiente' :
                                                        budget.status === 'approved' ? 'Aprobado' :
                                                            budget.status === 'draft' ? 'Borrador' :
                                                                budget.status}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="font-mono font-bold text-foreground text-base">
                                                    {budget.totalEstimated.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                                </div>
                                                <div className="text-[10px] uppercase text-muted-foreground font-medium tracking-wide">
                                                    IVA incluido
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Link href={`/dashboard/admin/budgets/${budget.id}/edit`}>
                                                    <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all hover:scale-105">
                                                        <ArrowRight className="h-5 w-5" />
                                                        <span className="sr-only">Ver detalle</span>
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
