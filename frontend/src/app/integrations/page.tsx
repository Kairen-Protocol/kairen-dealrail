'use client';

import { IntegrationsWorkbench } from '@/components/IntegrationsWorkbench';

export default function IntegrationsPage() {
  return (
    <div className="space-y-5">
      <section className="hero-grid terminal-panel rounded-[1.5rem] p-6">
        <div className="relative z-10">
          <div className="terminal-kicker">Integrations</div>
          <h1 className="mt-2 text-3xl font-semibold">Settlement and execution rails</h1>
        </div>
        <p className="mt-1 text-sm text-[var(--terminal-muted)]">
          This page is not a dump of adapters. It explains what each rail is for, what stage it belongs to, and what
          value you should enter before pressing anything.
        </p>
      </section>
      <IntegrationsWorkbench />
    </div>
  );
}
