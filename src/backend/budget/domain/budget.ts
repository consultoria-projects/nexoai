import { ProjectSpecs } from './project-specs';
import { PersonalInfo } from '@/backend/lead/domain/lead';

export interface BudgetLineItem {
  order: number;
  originalTask: string;
  found: boolean;
  item?: {
    code: string;
    description: string;
    unit: string;
    price?: number;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
  };
  note?: string;
  id?: string;
  isEditing?: boolean;
  chapter?: string;
  originalState?: {
    unitPrice: number;
    quantity: number;
    description: string;
    unit: string;
  };
}

export interface BudgetCostBreakdown {
  materialExecutionPrice: number;
  overheadExpenses: number;
  industrialBenefit: number;
  tax: number;
  globalAdjustment: number;
  total: number;
}

/**
 * Represents the core Budget entity in the domain layer.
 * Decoupled from Frontend Zod Schemas.
 */
export interface Budget {
  id: string;

  // Owner Reference (Linked to Lead Module)
  leadId: string;

  // Snapshot of client data at budget creation time (Immutable record)
  clientSnapshot: PersonalInfo;

  // Metadata
  status: 'draft' | 'pending_review' | 'approved' | 'sent';
  createdAt: Date;
  updatedAt: Date;
  version: number;
  type?: 'renovation' | 'quick' | 'new_build';

  // Domain Project Data
  specs: ProjectSpecs;

  // Financials
  lineItems: BudgetLineItem[];
  costBreakdown: BudgetCostBreakdown;
  totalEstimated: number;

  // Origin & Metadata
  source?: 'wizard' | 'pdf_measurement' | 'manual';
  pricingMetadata?: {
    uploadedFileName?: string;
    pageCount?: number;
    extractionConfidence?: number;
  };

  // AI Renders
  renders?: BudgetRender[];
}

export interface BudgetRender {
  id: string;
  url: string;
  originalUrl?: string;
  prompt: string;
  style: string;
  roomType: string;
  createdAt: Date;
}

/**
 * Represents a repository interface for budget data persistence.
 */
export interface BudgetRepository {
  findById(id: string): Promise<Budget | null>;
  findByLeadId(leadId: string): Promise<Budget[]>;
  findAll(): Promise<Budget[]>;
  save(budget: Budget): Promise<void>;
}
