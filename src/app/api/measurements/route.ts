/**
 * Obsolete Measurement Processing API Route
 */

import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        { success: false, error: 'This API route has been deprecated or moved.' },
        { status: 501 }
    );
}

