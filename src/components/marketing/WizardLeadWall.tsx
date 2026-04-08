import React from 'react';
import { cookies } from 'next/headers';

/**
 * LeadWall (Muro de Pago Inteligente). Pide el mail tras generar el presupuesto.
 * Test 2.1: Evalúa si el misterio total (Blurry completo - Variante A) agarra más emails
 * que darle una prueba transparente parcial (Blurry soft en el medio - Variante B).
 */
export function WizardLeadWall({ children }: { children: React.ReactNode }) {
    const cookieStore = cookies();
    const variant = cookieStore.get('variant_id')?.value || 'A';

    return (
        <div className="relative border rounded-2xl overflow-hidden shadow-sm bg-white mt-12 w-full max-w-5xl mx-auto">
            
            {/* Contenido (El documento de Presupuesto real que le pasamos como hijo) */}
            {/* Si es A, emborronamos TODO mucho. Si es B, emborronamos solo moderadamente para dejarles "ojear" la cabecera */}
            <div className={`p-8 ${variant === 'A' ? 'blur-md select-none' : 'blur-[3px] select-none opacity-70'} transition-all`}>
                {children}
            </div>

            {/* Overlay Central Muro de Captación MQL */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white/30 to-white/90">
                <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full border border-gray-200 text-center transform transition-transform hover:scale-[1.01]">
                    
                    <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                        <span className="text-3xl">📄</span>
                    </div>

                    <h3 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        {variant === 'A' 
                            ? 'Déjanos tu email para verlo' 
                            : 'Desbloquea el desglose completo'}
                    </h3>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {variant === 'A'
                            ? 'Este presupuesto ha sido estructurado con éxito por la IA. Recíbelo privado en tu bandeja de entrada.'
                            : 'Puedes ver las primeras partidas arriba. Envíanos tu correo para descargar el PDF analítico completo y la auditoría de márgenes.'}
                    </p>
                    
                    <form className="flex flex-col gap-4">
                        <input 
                            type="email" 
                            placeholder="tu@empresa.com" 
                            className="px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 ring-blue-500/20 outline-none w-full text-lg transition-all"
                            required
                        />
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1">
                            Ver Mi Presupuesto
                        </button>
                    </form>
                    <p className="text-sm text-gray-400 mt-5 font-medium">100% Gratis. Sin tarjetas. Cero Spam.</p>
                </div>
            </div>
        </div>
    );
}
