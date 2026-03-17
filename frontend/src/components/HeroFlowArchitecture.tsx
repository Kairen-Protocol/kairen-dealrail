'use client';

import { useEffect, useState } from 'react';

const phases = [
  {
    title: 'Negotiate',
    headline: 'Service commerce for agents starts with intent and counterparty discovery.',
    desc: 'The buyer states a task, the market is scanned, and reverse auction pressure compresses price and delivery risk.',
  },
  {
    title: 'Offer',
    headline: 'One offer is selected, packed into escrow terms, and made executable.',
    desc: 'The provider quote, evaluator path, and settlement assumptions become one confirmed deal instead of a chat transcript.',
  },
  {
    title: 'Receipt',
    headline: 'Completion, refund, and reputation write produce auditable evidence.',
    desc: 'The final output is not just a payment. It is a receipt trail judges, operators, and agents can inspect.',
  },
];

const roleLanes = [
  {
    role: 'Client',
    steps: ['State task', 'Set budget + deadline', 'Confirm offer', 'Fund escrow'],
  },
  {
    role: 'Provider',
    steps: ['Surface capability', 'Quote delivery terms', 'Win offer slot', 'Submit work'],
  },
  {
    role: 'Evaluator',
    steps: ['Read scope', 'Check output', 'Approve or reject', 'Write result'],
  },
];

export function HeroFlowArchitecture() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhaseIndex((current) => (current + 1) % phases.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  const phase = phases[phaseIndex];

  return (
    <section className="hero-grid terminal-panel rounded-[1.5rem] p-6">
      <div className="relative z-10 mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="terminal-kicker">Point To Point</div>
          <h2 className="mt-2 text-2xl font-semibold">One rail from negotiate to receipt</h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--terminal-muted)]">
            Minimal animation, clear stages, and role-specific steps. The desk is designed for service commerce where the
            proof matters as much as the payment.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {phases.map((item, idx) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setPhaseIndex(idx)}
              className={`terminal-chip transition ${
                idx === phaseIndex ? 'border-[var(--terminal-accent)] text-[var(--terminal-accent)]' : ''
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 rounded-[1.5rem] border border-[var(--terminal-border)] bg-black/15 p-5">
        <div className="terminal-kicker">Animated Phase</div>
        <div className="mt-2 text-3xl font-semibold text-[var(--terminal-accent)]">{phase.title}</div>
        <div className="mt-3 text-lg font-medium">{phase.headline}</div>
        <div className="mt-2 max-w-3xl text-sm text-[var(--terminal-muted)]">{phase.desc}</div>

        <div className="relative mt-5 h-3 rounded-full bg-[var(--terminal-border)]/45">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--terminal-accent)]/20 transition-all duration-700"
            style={{ width: `${((phaseIndex + 1) / phases.length) * 100}%` }}
          />
          <div
            className="absolute top-[1px] h-2.5 w-2.5 rounded-full bg-[var(--terminal-accent)] shadow-[0_0_18px_rgba(141,252,196,0.55)] transition-all duration-700"
            style={{ left: `calc(${((phaseIndex + 1) / phases.length) * 100}% - 10px)` }}
          />
        </div>
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {roleLanes.map((lane, laneIndex) => (
          <div key={lane.role} className="rounded-2xl border border-[var(--terminal-border)] bg-black/15 p-4">
            <div className="terminal-label">{lane.role}</div>
            <div className="mt-3 space-y-2">
              {lane.steps.map((step, stepIndex) => {
                const active = stepIndex <= phaseIndex;
                return (
                  <div key={step} className="flex items-center gap-3 text-sm">
                    <div
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        active ? 'bg-[var(--terminal-accent)] shadow-[0_0_10px_rgba(141,252,196,0.55)]' : 'bg-[var(--terminal-border)]'
                      }`}
                    />
                    <div className={active ? 'text-[var(--terminal-fg)]' : 'text-[var(--terminal-muted)]'}>
                      {laneIndex === 0 && stepIndex === 0 && phaseIndex === 0 ? 'Start here' : step}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
