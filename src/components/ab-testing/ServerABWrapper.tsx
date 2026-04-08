import { cookies } from 'next/headers';
import React from 'react';

interface ServerABWrapperProps {
    fallback: 'A' | 'B';
    variantA: React.ReactNode;
    variantB: React.ReactNode;
}

/**
 * Server Component Helper para renderizar dinámicamente (y sin flicker visual) 
 * la variante de Test A/B asignada en el Middleware per-sesión.
 */
export function ServerABWrapper({ fallback, variantA, variantB }: ServerABWrapperProps) {
    const cookieStore = cookies();
    const variantId = cookieStore.get('variant_id')?.value || fallback;

    return (
        <React.Fragment>
            {variantId === 'A' ? variantA : variantB}
        </React.Fragment>
    );
}
