'use client';

import { DealPipelineDashboard } from '@/components/DealPipelineDashboard';
import { ProviderDiscoveryPanel } from '@/components/ProviderDiscoveryPanel';

export default function FlowPage() {
  return (
    <div className="space-y-5">
      <section className="terminal-panel rounded-xl p-4">
        <h1 className="text-xl font-semibold">Flow Workspace</h1>
        <p className="mt-1 text-sm text-[var(--terminal-muted)]">
          Use this page for policy, discovery, reverse auction rounds, batch confirmation, and negotiation receipts.
        </p>
      </section>
      <ProviderDiscoveryPanel />
      <DealPipelineDashboard />
    </div>
  );
}
