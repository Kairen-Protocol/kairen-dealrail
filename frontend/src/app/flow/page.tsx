'use client';

import { DealPipelineDashboard } from '@/components/DealPipelineDashboard';
import { ProviderDiscoveryPanel } from '@/components/ProviderDiscoveryPanel';

export default function FlowPage() {
  return (
    <div className="space-y-5">
      <section className="hero-grid terminal-panel rounded-[1.5rem] p-6">
        <div className="relative z-10">
          <div className="terminal-kicker">Flow</div>
          <h1 className="mt-2 text-3xl font-semibold">Advanced negotiation workspace</h1>
        </div>
        <p className="mt-1 text-sm text-[var(--terminal-muted)]">
          Operator-facing surface for discovery, policy input, reverse auction, and deal confirmation. This is the
          manual control room behind the terminal.
        </p>
        <div className="mt-3 grid gap-2 text-xs md:grid-cols-4">
          <div className="terminal-metric">
            <div className="terminal-mono text-[var(--terminal-accent)]">STEP 1</div>
            <div className="mt-1 text-[var(--terminal-muted)]">Discover providers and set preferred provider/evaluator.</div>
          </div>
          <div className="terminal-metric">
            <div className="terminal-mono text-[var(--terminal-accent)]">STEP 2</div>
            <div className="mt-1 text-[var(--terminal-muted)]">Define policy values and start reverse auction.</div>
          </div>
          <div className="terminal-metric">
            <div className="terminal-mono text-[var(--terminal-accent)]">STEP 3</div>
            <div className="mt-1 text-[var(--terminal-muted)]">Select best offer, create batch, confirm deal.</div>
          </div>
          <div className="terminal-metric">
            <div className="terminal-mono text-[var(--terminal-accent)]">STEP 4</div>
            <div className="mt-1 text-[var(--terminal-muted)]">Copy technical IDs and move to Ops for onchain lifecycle.</div>
          </div>
        </div>
      </section>
      <ProviderDiscoveryPanel />
      <DealPipelineDashboard />
    </div>
  );
}
