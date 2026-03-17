'use client';

import { CreateJobButton } from '@/components/CreateJobButton';
import { JobsList } from '@/components/JobsList';

export default function OpsPage() {
  return (
    <div className="space-y-5">
      <section className="hero-grid terminal-panel rounded-[1.5rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="terminal-kicker">Ops</div>
            <h1 className="mt-2 text-3xl font-semibold">Escrow lifecycle control room</h1>
            <p className="mt-1 text-sm text-[var(--terminal-muted)]">
              Onchain execution controls for the confirmed deal: create jobs, fund escrow, inspect lifecycle state, and
              validate final settlement.
            </p>
          </div>
          <CreateJobButton />
        </div>
      </section>
      <JobsList />
    </div>
  );
}
