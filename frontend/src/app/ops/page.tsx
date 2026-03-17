'use client';

import { CreateJobButton } from '@/components/CreateJobButton';
import { JobsList } from '@/components/JobsList';

export default function OpsPage() {
  return (
    <div className="space-y-5">
      <section className="terminal-panel rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Ops Workspace</h1>
            <p className="mt-1 text-sm text-[var(--terminal-muted)]">
              Onchain execution controls: create jobs, manage lifecycle, and validate final states.
            </p>
          </div>
          <CreateJobButton />
        </div>
      </section>
      <JobsList />
    </div>
  );
}
