
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import * as path from 'path';
import { FirestorePriceBookRepository } from '@/backend/price-book/infrastructure/firestore-price-book-repository';
import { FirestoreBasicResourceRepository } from '@/backend/price-book/infrastructure/firestore-basic-resource-repository';
import { FirestoreIngestionJobRepository } from '@/backend/price-book/infrastructure/firestore-ingestion-job-repository';
import { LLMPriceBookParser } from '@/backend/price-book/infrastructure/llm-price-book-parser';
import { IngestPriceBookService } from '@/backend/price-book/application/ingest-price-book-service';
import { IngestionJob } from '@/backend/price-book/domain/ingestion-job';

async function main() {
    console.log("=== STARTING REAL INGESTION JOB ===");

    // 1. Initialize Adapters
    const priceBookRepo = new FirestorePriceBookRepository();
    const resourceRepo = new FirestoreBasicResourceRepository();
    const jobRepo = new FirestoreIngestionJobRepository();
    const parser = new LLMPriceBookParser();

    // 2. Initialize Service with ALL dependencies
    const service = new IngestPriceBookService(
        priceBookRepo,
        parser,
        jobRepo,
        resourceRepo
    );

    // 3. Define File Path
    const pdfPath = path.resolve(process.cwd(), 'public/documents/Libro Precios 46_COAATMCA.pdf');
    console.log(`Target PDF: ${pdfPath}`);

    const jobId = "cli_job_" + Date.now();
    const userId = "cli-user";
    const year = 2024;

    // 4. Create Job Record manually (mimicking UI/Controller)
    const newJob: IngestionJob = {
        id: jobId,
        fileName: 'Libro Precios 46_COAATMCA.pdf',
        fileUrl: 'local', // We are passing local path
        status: 'pending',
        progress: 0,
        logs: ['Job created via CLI script.'],
        year: year,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await jobRepo.create(newJob);
    console.log(`Job Created: ${jobId}`);

    // 5. Run Ingestion (Partial Range for Test)
    // Pages 1-8 were empty/indices. Let's try pages 9-19.
    try {
        await service.execute(pdfPath, year, jobId, { startPage: 9, maxPages: 10 });
        console.log("=== INGESTION COMPLETE ===");
    } catch (error) {
        console.error("=== INGESTION FAILED ===");
        console.error(error);
    }
}

main();
