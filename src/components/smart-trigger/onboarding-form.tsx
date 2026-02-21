'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight, Loader2, Target } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OnboardingFormProps {
    onComplete: () => void;
    leadName?: string;
}

export function OnboardingForm({ onComplete, leadName = 'Arquitecto' }: OnboardingFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        defaultValues: {
            projectType: '',
            timeline: '',
            budget: ''
        }
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        // Simulate saving preferences to the lead profile
        await new Promise(resolve => setTimeout(resolve, 1200));
        setIsLoading(false);
        onComplete();
    };

    return (
        <div className="w-full max-w-md mx-auto relative h-full flex flex-col justify-center">
            <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 pb-8 border-b border-primary/10 relative">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-primary/20 rounded-full shadow-sm flex items-center justify-center mb-4 text-primary ring-1 ring-primary/30">
                            <Bot className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-foreground">
                            Hola, {leadName.split(' ')[0]}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto leading-relaxed">
                            Soy el agente de IA de Basis. Para darte cifras exactas, cuéntame un poco más.
                        </p>
                    </div>
                </div>

                <div className="p-6 pt-8 bg-white dark:bg-slate-950">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                <FormField
                                    control={form.control}
                                    name="projectType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo de Proyecto</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} required>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 bg-muted/50 border-none focus:ring-1 focus:ring-primary rounded-xl">
                                                        <SelectValue placeholder="Selecciona el alcance..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="reforma-integral">Reforma Integral</SelectItem>
                                                    <SelectItem value="obra-nueva">Obra Nueva</SelectItem>
                                                    <SelectItem value="locales">Locales / Retail</SelectItem>
                                                    <SelectItem value="pequena-reforma">Pequeña Reforma</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="timeline"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plazo de Inicio</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} required>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 bg-muted/50 border-none focus:ring-1 focus:ring-primary rounded-xl">
                                                        <SelectValue placeholder="¿Para cuándo?" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="inmediato">Lo antes posible (1-2 meses)</SelectItem>
                                                    <SelectItem value="medio">En 3-6 meses</SelectItem>
                                                    <SelectItem value="largo">Solo explorando precios</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all h-14 text-lg font-medium rounded-xl"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
                                    Hablar con el Arquitecto <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </form>
                        </Form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
