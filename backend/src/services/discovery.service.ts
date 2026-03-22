import { ethers } from 'ethers';
import { config } from '../config';

export interface ProviderCandidate {
  providerAddress: string;
  evaluatorAddress: string;
  source: 'x402n' | 'virtuals' | 'near' | 'mock' | 'imported';
  serviceId: string | null;
  serviceName: string;
  description: string;
  endpoint: string | null;
  basePriceUsdc: string | null;
  reputationScore: number | null;
  erc8004AgentId: string | null;
  erc8004Registered: boolean;
}

const IDENTITY_ABI = [
  'function agentIdOf(address agent) view returns (uint256)',
];

const REPUTATION_ABI = [
  'function getReputation(uint256 agentId) view returns (uint256)',
];

const MOCK_CANDIDATES: ProviderCandidate[] = [
  {
    providerAddress: '0xef9C7E3Fea4f54CB3C6c8fa0978a0C8aB8f28fcF',
    evaluatorAddress: '0xe872Bd6d99452C87BA54c7618FEc71f0DB23d4f2',
    source: 'mock',
    serviceId: 'mock-1',
    serviceName: 'Automation Benchmark Report',
    description: 'Benchmark an automation workflow and return a report with deterministic checkpoints.',
    endpoint: 'https://x402n.kairen.xyz/api/v1',
    basePriceUsdc: '0.10',
    reputationScore: 835,
    erc8004AgentId: null,
    erc8004Registered: false,
  },
  {
    providerAddress: '0x9f2B0f8d8A3f52f8444A9fc4b6c67Aaa4a84F26a',
    evaluatorAddress: '0x782D2a5fD77d001865fA425d995E7fd5Ce880332',
    source: 'mock',
    serviceId: 'mock-2',
    serviceName: 'Agent Workflow Automation',
    description: 'Low-latency automation service with benchmark traces and operator notes.',
    endpoint: 'https://x402n.kairen.xyz/api/v1',
    basePriceUsdc: '0.12',
    reputationScore: 902,
    erc8004AgentId: null,
    erc8004Registered: false,
  },
  {
    providerAddress: '0x2365DBD6f08F3049f643F6385D0f0B6Ff14E0A1f',
    evaluatorAddress: '0xAc5E2f0E2E6f66F8f02E8A53b8D4d367a28d9f80',
    source: 'mock',
    serviceId: 'mock-3',
    serviceName: 'Research Findings Report',
    description: 'Compile findings into a report with benchmark appendix and delivery notes.',
    endpoint: 'https://x402n.kairen.xyz/api/v1',
    basePriceUsdc: '0.09',
    reputationScore: 768,
    erc8004AgentId: null,
    erc8004Registered: false,
  },
  {
    providerAddress: '0xA4F52B80e7f89d3E87B4aDD2E0E9D2C18c0D5b71',
    evaluatorAddress: '0xB8A6843353423Af6285e6Ec5063154db88D63c7E',
    source: 'mock',
    serviceId: 'mock-4',
    serviceName: 'Image Generation Pack',
    description: 'Generate prompt-driven image assets with quick preview delivery for demos.',
    endpoint: 'https://x402n.kairen.xyz/api/v1',
    basePriceUsdc: '0.08',
    reputationScore: 811,
    erc8004AgentId: null,
    erc8004Registered: false,
  },
];

class DiscoveryService {
  private importedCandidates: ProviderCandidate[] = [];
  private ercProvider = new ethers.JsonRpcProvider(
    config.integrations.erc8004.baseMainnetRpc,
    { chainId: 8453, name: 'base' },
    { staticNetwork: true }
  );
  private identity = new ethers.Contract(
    config.integrations.erc8004.identityRegistry,
    IDENTITY_ABI,
    this.ercProvider
  ) as any;
  private reputation = new ethers.Contract(
    config.integrations.erc8004.reputationRegistry,
    REPUTATION_ABI,
    this.ercProvider
  ) as any;

  async listProviderCandidates(filters?: {
    query?: string;
    minReputation?: number;
    maxBasePriceUsdc?: number;
    sources?: Array<'x402n' | 'virtuals' | 'near' | 'mock' | 'imported'>;
  }): Promise<ProviderCandidate[]> {
    const shouldFetchExternal =
      !filters?.sources || filters.sources.some((source) => ['x402n', 'virtuals', 'near'].includes(source));
    const seed = shouldFetchExternal ? await this.fetchAllSources() : [];
    const imported = this.importedCandidates.map((row) => ({ ...row, source: 'imported' as const }));
    const base = this.deduplicateCandidates([...seed, ...MOCK_CANDIDATES, ...imported]);
    const enriched = await Promise.all(base.map((candidate) => this.enrichReputation(candidate)));

    return enriched
      .filter((candidate) => {
        if (filters?.query) {
          if (!this.matchesQuery(candidate, filters.query)) return false;
        }
        if (typeof filters?.minReputation === 'number') {
          if ((candidate.reputationScore ?? 0) < filters.minReputation) return false;
        }
        if (typeof filters?.maxBasePriceUsdc === 'number' && candidate.basePriceUsdc) {
          const p = Number(candidate.basePriceUsdc);
          if (!Number.isNaN(p) && p > filters.maxBasePriceUsdc) return false;
        }
        if (filters?.sources && filters.sources.length > 0) {
          const allowed = new Set(filters.sources);
          if (!allowed.has(candidate.source as any)) return false;
        }
        return true;
      })
      .sort((a, b) => (b.reputationScore ?? 0) - (a.reputationScore ?? 0));
  }

  listSources(): Array<{ id: string; enabled: boolean; kind: 'discovery' }> {
    return [
      { id: 'x402n', enabled: config.integrations.discovery.x402nEnabled, kind: 'discovery' },
      { id: 'virtuals', enabled: config.integrations.discovery.virtualsEnabled, kind: 'discovery' },
      { id: 'near', enabled: config.integrations.discovery.nearEnabled, kind: 'discovery' },
      { id: 'imported', enabled: true, kind: 'discovery' },
      { id: 'mock', enabled: true, kind: 'discovery' },
    ];
  }

  importCandidates(candidates: ProviderCandidate[]): { imported: number } {
    const normalized = candidates
      .filter((c) => /^0x[a-fA-F0-9]{40}$/.test(c.providerAddress))
      .map((c) => ({
        ...c,
        providerAddress: c.providerAddress.toLowerCase(),
        evaluatorAddress: c.evaluatorAddress.toLowerCase(),
      }));
    this.importedCandidates.push(...normalized);
    return { imported: normalized.length };
  }

  async getAgentIdentity(address: string): Promise<{
    address: string;
    agentId: string | null;
    registered: boolean;
    reputationScore: number | null;
  }> {
    const normalized = address.toLowerCase();
    try {
      const agentId = await this.identity.agentIdOf(normalized);
      if (!agentId || BigInt(agentId) === 0n) {
        return {
          address: normalized,
          agentId: null,
          registered: false,
          reputationScore: null,
        };
      }

      const reputationRaw = await this.reputation.getReputation(agentId);
      return {
        address: normalized,
        agentId: agentId.toString(),
        registered: true,
        reputationScore: Number(reputationRaw),
      };
    } catch {
      return {
        address: normalized,
        agentId: null,
        registered: false,
        reputationScore: null,
      };
    }
  }

  private async fetchAllSources(): Promise<ProviderCandidate[]> {
    const jobs: Array<Promise<ProviderCandidate[]>> = [];

    if (config.integrations.discovery.x402nEnabled) {
      jobs.push(this.fetchX402nServices());
    }
    if (config.integrations.discovery.virtualsEnabled) {
      jobs.push(this.fetchGenericMarketplace('virtuals', config.integrations.discovery.virtualsServicesUrl));
    }
    if (config.integrations.discovery.nearEnabled) {
      jobs.push(this.fetchGenericMarketplace('near', config.integrations.discovery.nearServicesUrl));
    }

    const resolved = await Promise.all(jobs);
    return resolved.flat();
  }

  private deduplicateCandidates(candidates: ProviderCandidate[]): ProviderCandidate[] {
    const seen = new Set<string>();
    const result: ProviderCandidate[] = [];

    for (const candidate of candidates) {
      const key = `${candidate.providerAddress.toLowerCase()}:${candidate.serviceId ?? candidate.serviceName.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(candidate);
    }

    return result;
  }

  private matchesQuery(candidate: ProviderCandidate, query: string): boolean {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return true;

    const haystack = `${candidate.serviceName} ${candidate.description}`.toLowerCase();
    if (haystack.includes(normalizedQuery)) {
      return true;
    }

    const hayTerms = new Set(this.tokenize(haystack));
    const queryTerms = this.tokenize(normalizedQuery);

    if (queryTerms.length === 0) {
      return true;
    }

    return queryTerms.some((term) => hayTerms.has(term));
  }

  private tokenize(value: string): string[] {
    return value
      .split(/[^a-z0-9]+/i)
      .map((term) => term.trim().toLowerCase())
      .filter((term) => term.length >= 3);
  }

  private async fetchX402nServices(): Promise<ProviderCandidate[]> {
    try {
      const response = await this.fetchWithTimeout(`${config.x402n.baseUrl}/services`, {
        headers: config.x402n.apiKey
          ? { Authorization: `ApiKey ${config.x402n.apiKey}` }
          : undefined,
      });

      if (!response.ok) {
        return [];
      }

      const body = (await response.json()) as any;
      const rows = Array.isArray(body?.services) ? body.services : Array.isArray(body) ? body : [];

      return rows
        .map((row: any) => {
          const providerAddress = row.provider_wallet_address || row.provider_address || row.owner_address;
          if (!providerAddress || !/^0x[a-fA-F0-9]{40}$/.test(providerAddress)) {
            return null;
          }
          return {
            providerAddress,
            evaluatorAddress: '0xe872Bd6d99452C87BA54c7618FEc71f0DB23d4f2',
            source: 'x402n' as const,
            serviceId: row.id || null,
            serviceName: row.name || 'Provider Service',
            description: row.description || '',
            endpoint: row.endpoint || null,
            basePriceUsdc: row.base_price_usdc || null,
            reputationScore: null,
            erc8004AgentId: null,
            erc8004Registered: false,
          };
        })
        .filter((x: ProviderCandidate | null): x is ProviderCandidate => x !== null);
    } catch {
      return [];
    }
  }

  private async fetchGenericMarketplace(
    source: 'virtuals' | 'near',
    url: string
  ): Promise<ProviderCandidate[]> {
    if (!url) return [];

    try {
      const response = await this.fetchWithTimeout(url);
      if (!response.ok) {
        return [];
      }

      const body = (await response.json()) as any;
      const rows = Array.isArray(body?.services) ? body.services : Array.isArray(body) ? body : [];

      return rows
        .map((row: any, idx: number) => {
          const providerAddress =
            row.provider_wallet_address || row.provider_address || row.owner_address || row.wallet;
          if (!providerAddress || !/^0x[a-fA-F0-9]{40}$/.test(providerAddress)) {
            return null;
          }
          return {
            providerAddress,
            evaluatorAddress: '0xe872Bd6d99452C87BA54c7618FEc71f0DB23d4f2',
            source,
            serviceId: row.id || `${source}-${idx}`,
            serviceName: row.name || `${source} provider`,
            description: row.description || '',
            endpoint: row.endpoint || row.url || null,
            basePriceUsdc: row.base_price_usdc || row.price_usdc || null,
            reputationScore: null,
            erc8004AgentId: null,
            erc8004Registered: false,
          } as ProviderCandidate;
        })
        .filter((x: ProviderCandidate | null): x is ProviderCandidate => x !== null);
    } catch {
      return [];
    }
  }

  private async enrichReputation(candidate: ProviderCandidate): Promise<ProviderCandidate> {
    if (candidate.reputationScore !== null) {
      return candidate;
    }

    try {
      const agentId = await this.identity.agentIdOf(candidate.providerAddress);
      if (!agentId || BigInt(agentId) === 0n) {
        return candidate;
      }

      const raw = await this.reputation.getReputation(agentId);
      const rep = Number(raw);
      return {
        ...candidate,
        reputationScore: Number.isFinite(rep) ? rep : candidate.reputationScore,
        erc8004AgentId: agentId.toString(),
        erc8004Registered: true,
      };
    } catch {
      return candidate;
    }
  }

  private async fetchWithTimeout(
    url: string,
    init?: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.integrations.discovery.timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const discoveryService = new DiscoveryService();
