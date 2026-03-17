'use client';

import { useEffect, useState } from 'react';
import { healthCheck, integrationsApi, jobsApi, ProviderCandidate } from '@/lib/api';

type MarketPulsePanelProps = {
  variant?: 'compact' | 'full';
};

type PulseState = {
  backendOnline: boolean;
  chainLabel: string;
  providers: ProviderCandidate[];
  discoverySources: Array<{ id: string; enabled: boolean }>;
  executionProviders: Array<{ id: string; mode: string; useCase: string }>;
  x402Endpoints: string[];
  openJobs: number;
};

const initialState: PulseState = {
  backendOnline: false,
  chainLabel: 'Unknown',
  providers: [],
  discoverySources: [],
  executionProviders: [],
  x402Endpoints: [],
  openJobs: 0,
};

function chainName(chainId?: number) {
  if (chainId === 84532) return 'Base Sepolia';
  if (chainId === 11142220) return 'Celo Sepolia';
  return chainId ? `Chain ${chainId}` : 'Unknown';
}

export function MarketPulsePanel({ variant = 'full' }: MarketPulsePanelProps) {
  const [state, setState] = useState<PulseState>(initialState);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [health, providerRes, sourceRes, executionRes, x402Res, jobsRes] = await Promise.all([
          healthCheck().catch(() => null),
          integrationsApi.listProviders().catch(() => ({ providers: [] })),
          integrationsApi.listDiscoverySources().catch(() => ({ sources: [] })),
          integrationsApi.listExecutionProviders().catch(() => ({ providers: [] })),
          integrationsApi.getX402Status().catch(() => ({ endpoints: [] })),
          jobsApi.list({ limit: 12 }).catch(() => ({ jobs: [] })),
        ]);

        if (!mounted) return;
        setState({
          backendOnline: !!health,
          chainLabel: chainName(health?.blockchain.chainId),
          providers: providerRes.providers || [],
          discoverySources: sourceRes.sources || [],
          executionProviders: executionRes.providers || [],
          x402Endpoints: x402Res.endpoints || [],
          openJobs: (jobsRes.jobs || []).length,
        });
      } catch {
        if (!mounted) return;
        setState(initialState);
      }
    }

    void load();
    const id = window.setInterval(load, 10000);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  const topProviders = state.providers.slice(0, variant === 'compact' ? 2 : 4);
  const enabledSources = state.discoverySources.filter((source) => source.enabled);

  return (
    <section className="terminal-panel rounded-[1.25rem] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="terminal-kicker">Market Pulse</div>
          <h3 className="mt-2 text-lg font-semibold">Live rails and available supply</h3>
        </div>
        <div className={`h-2.5 w-2.5 rounded-full ${state.backendOnline ? 'bg-[var(--terminal-good)]' : 'bg-[var(--terminal-danger)]'}`} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="terminal-metric">
          <div className="terminal-label">Chain</div>
          <div className="mt-1 text-sm font-semibold">{state.chainLabel}</div>
        </div>
        <div className="terminal-metric">
          <div className="terminal-label">Marketable Agents</div>
          <div className="mt-1 text-sm font-semibold">{state.providers.length}</div>
        </div>
        <div className="terminal-metric">
          <div className="terminal-label">Discovery Sources</div>
          <div className="mt-1 text-sm font-semibold">{enabledSources.length}</div>
        </div>
        <div className="terminal-metric">
          <div className="terminal-label">Recent Jobs</div>
          <div className="mt-1 text-sm font-semibold">{state.openJobs}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--terminal-border)] bg-black/15 p-4">
          <div className="terminal-label">Available Providers</div>
          <div className="mt-3 space-y-2">
            {topProviders.length > 0 ? topProviders.map((provider) => (
              <div key={`${provider.source}-${provider.providerAddress}`} className="rounded-xl border border-[var(--terminal-border)] bg-black/15 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{provider.serviceName}</div>
                  <div className="terminal-chip">{provider.source}</div>
                </div>
                <div className="mt-1 text-xs text-[var(--terminal-muted)]">{provider.description || 'No description yet'}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[var(--terminal-muted)]">
                  <span>Rep {provider.reputationScore ?? 'n/a'}</span>
                  <span>Base {provider.basePriceUsdc ?? 'n/a'} USDC</span>
                  <span>{provider.erc8004Registered ? 'ERC-8004 verified' : 'Unverified'}</span>
                </div>
              </div>
            )) : (
              <div className="text-sm text-[var(--terminal-muted)]">No discovery data returned yet.</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--terminal-border)] bg-black/15 p-4">
          <div className="terminal-label">Execution Rails</div>
          <div className="mt-3 space-y-2">
            {state.executionProviders.map((provider) => (
              <div key={provider.id} className="flex items-start justify-between gap-3 rounded-xl border border-[var(--terminal-border)] bg-black/15 p-3 text-sm">
                <div>
                  <div className="font-medium">{provider.id}</div>
                  <div className="mt-1 text-xs text-[var(--terminal-muted)]">{provider.useCase}</div>
                </div>
                <div className="terminal-chip">{provider.mode}</div>
              </div>
            ))}
            {state.executionProviders.length === 0 && (
              <div className="text-sm text-[var(--terminal-muted)]">No execution rail metadata returned yet.</div>
            )}
          </div>

          <div className="mt-4 border-t border-[var(--terminal-border)] pt-4">
            <div className="terminal-label">x402 Reachability</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {state.x402Endpoints.length > 0 ? state.x402Endpoints.map((endpoint) => (
                <span key={endpoint} className="terminal-chip">{endpoint}</span>
              )) : (
                <span className="text-sm text-[var(--terminal-muted)]">No x402 endpoints reported.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
