import { promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import { randomUUID } from 'crypto';

export interface DemandOpportunity {
  id: string;
  createdAt: string;
  status: 'open' | 'matched' | 'archived';
  source: 'terminal' | 'api';
  requestText: string;
  normalizedQuery: string;
  maxBudgetUsdc: number | null;
  maxDeliveryHours: number | null;
  matchesAtCreate: number;
}

const BOOK_PATH = resolve(__dirname, '../../data/opportunity-book.json');

class OpportunityBookService {
  private opportunities: DemandOpportunity[] | null = null;
  private writeQueue = Promise.resolve();

  async list(filters?: { status?: DemandOpportunity['status']; limit?: number }) {
    await this.ensureLoaded();
    const rows = [...(this.opportunities || [])];
    return rows
      .filter((row) => (filters?.status ? row.status === filters.status : true))
      .slice(0, filters?.limit ?? 50);
  }

  async create(input: {
    requestText: string;
    normalizedQuery: string;
    maxBudgetUsdc?: number | null;
    maxDeliveryHours?: number | null;
    matchesAtCreate?: number;
    source?: DemandOpportunity['source'];
  }) {
    await this.ensureLoaded();

    const opportunity: DemandOpportunity = {
      id: `opp_${randomUUID().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      status: 'open',
      source: input.source || 'api',
      requestText: input.requestText.trim(),
      normalizedQuery: input.normalizedQuery.trim(),
      maxBudgetUsdc: typeof input.maxBudgetUsdc === 'number' ? input.maxBudgetUsdc : null,
      maxDeliveryHours: typeof input.maxDeliveryHours === 'number' ? input.maxDeliveryHours : null,
      matchesAtCreate: input.matchesAtCreate ?? 0,
    };

    this.opportunities!.unshift(opportunity);
    await this.persist();
    return opportunity;
  }

  private async ensureLoaded() {
    if (this.opportunities) return;

    await fs.mkdir(dirname(BOOK_PATH), { recursive: true });

    try {
      const raw = await fs.readFile(BOOK_PATH, 'utf8');
      const parsed = JSON.parse(raw) as DemandOpportunity[];
      this.opportunities = Array.isArray(parsed) ? parsed : [];
    } catch {
      this.opportunities = [];
      await this.persist();
    }
  }

  private async persist() {
    const payload = JSON.stringify(this.opportunities || [], null, 2);
    this.writeQueue = this.writeQueue.then(() => fs.writeFile(BOOK_PATH, payload, 'utf8'));
    await this.writeQueue;
  }
}

export const opportunityBookService = new OpportunityBookService();
