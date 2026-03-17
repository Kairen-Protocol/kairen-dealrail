'use client';

import { IntegrationsWorkbench } from '@/components/IntegrationsWorkbench';

export default function IntegrationsPage() {
  return (
    <div className="space-y-5">
      <section className="terminal-panel rounded-xl p-4">
        <h1 className="text-xl font-semibold">Integrations Workspace</h1>
        <p className="mt-1 text-sm text-[var(--terminal-muted)]">
          Adapter execution for settlement routing and external rails.
        </p>
      </section>
      <IntegrationsWorkbench />
    </div>
  );
}
