import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const payload = await request.json();

        // Validate payload exists and is an array
        if (!payload || !Array.isArray(payload)) {
            return NextResponse.json({ error: 'Payload must be an array of selected chapters.' }, { status: 400 });
        }

        // Create the temp directory if it doesn't exist
        const OUTPUT_DIR = path.resolve(process.cwd(), 'tmp_batch_job');
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        // Save the payload to a JSON file format that the standalone script can read
        const configPath = path.join(OUTPUT_DIR, 'selection_config.json');
        fs.writeFileSync(configPath, JSON.stringify(payload, null, 2), 'utf-8');

        console.log(`[API] Saved Batch Job Configuration to: ${configPath}`);

        return NextResponse.json({
            success: true,
            message: 'Configuración guardada en el servidor con éxito.',
            configPath
        });

    } catch (error: any) {
        console.error('[API] Error saving Batch Job Configuration:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
