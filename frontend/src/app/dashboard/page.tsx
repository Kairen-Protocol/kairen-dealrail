'use client';

import { useEffect, useState } from 'react';
import { DemandOpportunity, healthCheck, jobsApi, Job, integrationsApi } from '@/lib/api';
import { listTerminalRuns, subscribeTerminalRuns, TerminalRunRecord } from '@/lib/terminalLedger';
import { MarketPulsePanel } from '@/components/MarketPulsePanel';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="terminal-metric">
      <div className="terminal-mono text-[10px] uppercase tracking-widest text-[var(--terminal-muted)]">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [runs, setRuns] = useState<TerminalRunRecord[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [opportunities, setOpportunities] = useState<DemandOpportunity[]>([]);
  const [chainLabel, setChainLabel] = useState('Unknown');

  useEffect(() => {
    async function load() {
      setRuns(listTerminalRuns());
      const [health, jobsRes, opportunityRes] = await Promise.all([
        healthCheck().catch(() => null),
        jobsApi.list({ limit: 8 }).catch(() => ({ jobs: [] })),
        integrationsApi.listOpportunities({ status: 'open', limit: 8 }).catch(() => ({ opportunities: [] })),
      ]);
      setJobs(jobsRes.jobs || []);
      setOpportunities(opportunityRes.opportunities || []);
      if (health?.blockchain.chainId === 84532) setChainLabel('Base Sepolia');
      else if (health?.blockchain.chainId === 11142220) setChainLabel('Celo Sepolia');
      else setChainLabel(health?.blockchain.chainId ? `Chain ${health.blockchain.chainId}` : 'Unknown');
    }

    void load();
    const id = window.setInterval(load, 5000);
    const unsubscribe = subscribeTerminalRuns(() => setRuns(listTerminalRuns()));
    return () => {
      window.clearInterval(id);
      unsubscribe();
    };
  }, []);

  const flowCount = runs.filter((r) => r.action === 'start_flow').length;
  const opsCount = runs.filter((r) => r.action === 'start_ops').length;
  const integrationsCount = runs.filter((r) => r.action === 'open_integrations').length;

  return (
    <div className="space-y-5">
      <section className="hero-grid terminal-panel rounded-[1.5rem] p-6">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="terminal-kicker">Dashboard</div>
            <h1 className="mt-2 text-3xl font-semibold">Market board and audit tape</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--terminal-muted)]">
              This page is for watching what the desk is doing: command traffic, market supply, recent jobs, and chain
              health in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="terminal-chip">{chainLabel}</span>
            <span className="terminal-chip">{runs.length} terminal events</span>
            <span className="terminal-chip">{jobs.length} recent jobs</span>
            <span className="terminal-chip">{opportunities.length} open opportunities</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <Stat label="Total Commands" value={String(runs.length)} />
        <Stat label="Flow Intents" value={String(flowCount)} />
        <Stat label="Ops Intents" value={String(opsCount)} />
        <Stat label="Integrations Intents" value={String(integrationsCount)} />
        <Stat label="Open Demand" value={String(opportunities.length)} />
      </section>

      <MarketPulsePanel />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="terminal-panel rounded-[1.25rem] p-5 xl:col-span-7">
          <div className="terminal-kicker">Command Ledger</div>
          <div className="mt-4 max-h-[560px] space-y-2 overflow-auto">
            {runs.map((run) => (
              <div key={run.id} className="rounded-2xl border border-[var(--terminal-border)] bg-black/20 p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--terminal-muted)]">
                  <span className="terminal-mono">{new Date(run.at).toLocaleString()}</span>
                  <span className="terminal-chip">{run.action}</span>
                </div>
                <div className="mt-2 break-words terminal-mono text-[var(--terminal-fg)]">{run.command}</div>
                <div className="mt-1 text-[var(--terminal-good)]">{run.note}</div>
              </div>
            ))}
            {runs.length === 0 && <div className="text-sm text-[var(--terminal-muted)]">No command records yet.</div>}
          </div>
        </div>

        <div className="space-y-4 xl:col-span-5">
          <div className="terminal-panel rounded-[1.25rem] p-5">
            <div className="terminal-kicker">Open Opportunities</div>
            <div className="mt-4 space-y-3">
              {opportunities.map((opportunity) => (
                <div key={opportunity.id} className="rounded-2xl border border-[var(--terminal-border)] bg-black/15 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="break-all terminal-mono text-[11px] text-[var(--terminal-accent)]">{opportunity.id}</div>
                    <span className="terminal-chip">{opportunity.source}</span>
                  </div>
                  <div className="mt-2 break-words text-sm text-[var(--terminal-muted)]">{opportunity.normalizedQuery}</div>
                  <div className="mt-1 text-xs text-[var(--terminal-muted)]">
                    Budget {opportunity.maxBudgetUsdc ?? 'n/a'} USDC | Delivery {opportunity.maxDeliveryHours ?? 'n/a'}h
                  </div>
                </div>
              ))}
              {opportunities.length === 0 && <div className="text-sm text-[var(--terminal-muted)]">No queued buyer demand yet.</div>}
            </div>
          </div>

          <div className="terminal-panel rounded-[1.25rem] p-5">
            <div className="terminal-kicker">Recent Jobs</div>
          <div className="mt-4 space-y-3">
            {jobs.map((job) => (
              <div key={job.jobId} className="rounded-2xl border border-[var(--terminal-border)] bg-black/15 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">Job #{job.jobId}</div>
                  <span className="terminal-chip">{job.state}</span>
                </div>
                <div className="mt-2 text-sm text-[var(--terminal-muted)]">
                  Budget {job.budget} | Provider {job.provider.slice(0, 6)}...{job.provider.slice(-4)}
                </div>
                <div className="mt-1 text-xs text-[var(--terminal-muted)]">
                  Evaluator {job.evaluator.slice(0, 6)}...{job.evaluator.slice(-4)}
                </div>
              </div>
            ))}
            {jobs.length === 0 && <div className="text-sm text-[var(--terminal-muted)]">No recent job data returned yet.</div>}
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
