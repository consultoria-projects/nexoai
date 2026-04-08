"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type PopupType = 'NONE' | 'EXIT_INTENT' | 'SCROLL' | 'TIME';

interface CROContextType {
    activePopup: PopupType;
    closePopup: () => void;
    triggerPopup: (type: PopupType) => void;
}

const CROContext = createContext<CROContextType>({
    activePopup: 'NONE',
    closePopup: () => {},
    triggerPopup: () => {}
});

/**
 * Engine global de Conversion Rate Optimization (CRO). 
 * Dispara popups interrumpiendo fluidamente en base a métricas de comportamiento JS puros.
 */
export function CROEngineProvider({ children }: { children: React.ReactNode }) {
    const [activePopup, setActivePopup] = useState<PopupType>('NONE');
    
    // Flags de un solo uso por sesión para no fatigar al usuario
    const [hasTriggeredExit, setHasTriggeredExit] = useState(false);
    const [hasTriggeredScroll, setHasTriggeredScroll] = useState(false);
    const [hasTriggeredTime, setHasTriggeredTime] = useState(false);

    useEffect(() => {
        // 1. Exit Intent (El ratón sale acelerado hacia arriba buscando cerrar pestaña)
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasTriggeredExit && activePopup === 'NONE') {
                setActivePopup('EXIT_INTENT');
                setHasTriggeredExit(true);
            }
        };

        // 2. Comportamiento de Lectura (Hizo Scroll más de la mitad de la Landing)
        const handleScroll = () => {
            if (hasTriggeredScroll || activePopup !== 'NONE') return;
            const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (scrollPercentage > 0.5) {
                setActivePopup('SCROLL');
                setHasTriggeredScroll(true);
            }
        };

        // 3. Time Delayed (Está 20 segundos leyendo la portada, está interesado)
        const timeTimer = setTimeout(() => {
            if (!hasTriggeredTime && activePopup === 'NONE') {
                setActivePopup('TIME');
                setHasTriggeredTime(true);
            }
        }, 20000);

        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeTimer);
        };
    }, [hasTriggeredExit, hasTriggeredScroll, hasTriggeredTime, activePopup]);

    return (
        <CROContext.Provider value={{ activePopup, closePopup: () => setActivePopup('NONE'), triggerPopup: setActivePopup }}>
            {children}
            <GlobalPopupRenderer />
        </CROContext.Provider>
    );
}

export const useCROEngine = () => useContext(CROContext);

function GlobalPopupRenderer() {
    const { activePopup, closePopup } = useCROEngine();

    if (activePopup === 'NONE') return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl max-w-lg w-full p-10 shadow-2xl relative shadow-blue-900/20 transform transition-all">
                <button onClick={closePopup} className="absolute top-4 right-5 text-2xl text-gray-400 hover:text-black transition-colors rounded-full p-2">
                    ✕
                </button>
                {activePopup === 'EXIT_INTENT' && <ExitIntentModal />}
                {activePopup === 'SCROLL' && <ScrollSuccessModal />}
                {activePopup === 'TIME' && <TimeAuditModal />}
            </div>
        </div>
    );
}

function ExitIntentModal() {
    return (
        <div className="text-center">
            <span className="text-5xl block mb-6">✋</span>
            <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-gray-900">¡Espera! Protege el margen</h2>
            <p className="text-gray-600 mb-8 text-lg">Hemos visto a 200 empresas constructoras perder más del 11% de beneficio anual en sus obras solo por la gestión ineficiente albaranes. Descárgate nuestro <strong>Video-Caso de Estudio VIP</strong> gratuitamente.</p>
            <button className="bg-red-600 text-white font-bold w-full py-4 text-lg rounded-xl shadow-lg hover:bg-red-700 hover:-translate-y-1 transition-all">Ver Video Confidencial Ahora</button>
        </div>
    );
}

function ScrollSuccessModal() {
    return (
        <div className="text-center">
            <span className="text-5xl block mb-6">📈</span>
            <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-gray-900">El autónomo que presupuesta en furgoneta</h2>
            <p className="text-gray-600 mb-8 text-lg">Lee el caso de éxito real donde Carlos generó 35 presupuestos en un mes enviando solo audios al Agente de IA, sin tocar Presto.</p>
            <button className="bg-blue-600 text-white font-bold w-full py-4 text-lg rounded-xl shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition-all">Leer Caso Completo</button>
        </div>
    );
}

function TimeAuditModal() {
    return (
        <div className="text-center">
            <span className="text-5xl block mb-6">🔍</span>
            <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-gray-900">¿Estás considerando sistematizarte?</h2>
            <p className="text-gray-600 mb-8 text-lg">Aprovecha la pausa. Te regalamos una <strong>Auditoría de Arquitectura de Software Express</strong> de 15 minutos exactos para revelarte cuánto tiempo le devolvería el desarrollo a medida a tu cuadrilla mensual.</p>
            <button className="bg-gray-900 text-white font-bold w-full py-4 text-lg rounded-xl shadow-lg hover:bg-black hover:-translate-y-1 transition-all">Agendar Auditoría VIP Gratis</button>
        </div>
    );
}
