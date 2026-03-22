'use client';

import { useEffect, useMemo, useState } from 'react';

type LoopTone = 'system' | 'ok' | 'warn';

type LoopStep = {
  tone: LoopTone;
  text: string;
};

type LoopScenario = {
  id: string;
  label: string;
  command: string;
  note: string;
  steps: LoopStep[];
};

const SCENARIOS: LoopScenario[] = [
  {
    id: 'doctor',
    label: 'Check posture',
    command: 'doctor',
    note: 'Start quiet. Read backend, chain, and market posture before doing anything else.',
    steps: [
      { tone: 'ok', text: 'backend=reachable | chain=Base Sepolia' },
      { tone: 'warn', text: 'market=curated_demo | provider_supply=3 visible' },
      { tone: 'system', text: 'services=public | base_directory=online' },
      { tone: 'system', text: 'next=docs or dashboard' },
    ],
  },
  {
    id: 'vend',
    label: 'Rank supply',
    command: 'vend automation benchmark report --budget 0.12 --hours 24',
    note: 'Treat discovery as a clear operating step, not as magic hidden behind the landing page.',
    steps: [
      { tone: 'ok', text: 'request accepted | negotiation=neg_c40dce13' },
      { tone: 'system', text: 'offers=3 | delivery_window=24h' },
      { tone: 'ok', text: 'best_offer=0.09 USDC | eta=20h' },
      { tone: 'warn', text: 'mode=curated_demo | ready_for_escrow' },
    ],
  },
  {
    id: 'settle',
    label: 'Settle and prove',
    command: 'job settle base',
    note: 'The strongest story is still receipts and settlement, so the loop ends on proof.',
    steps: [
      { tone: 'ok', text: 'escrow funded | budget=0.10 USDC' },
      { tone: 'system', text: 'deliverable submitted | evaluator notified' },
      { tone: 'ok', text: 'state=Completed | receipt written' },
      { tone: 'system', text: 'proof surfaces=dashboard + base directory' },
    ],
  },
];

export function HeroFlowLoop() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const scenario = SCENARIOS[scenarioIndex];

  useEffect(() => {
    if (visibleSteps < scenario.steps.length) {
      const timeoutId = window.setTimeout(() => {
        setVisibleSteps((current) => current + 1);
      }, visibleSteps === 0 ? 540 : 820);

      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      setScenarioIndex((current) => (current + 1) % SCENARIOS.length);
      setVisibleSteps(0);
    }, 1700);

    return () => window.clearTimeout(timeoutId);
  }, [scenario, visibleSteps]);

  const progressWidth = useMemo(() => {
    if (scenario.steps.length === 0) return '0%';
    return `${Math.max(14, Math.round((visibleSteps / scenario.steps.length) * 100))}%`;
  }, [scenario.steps.length, visibleSteps]);

  const visible = scenario.steps.slice(0, visibleSteps);

  return (
    <section className="hero-loop-shell">
      <div className="hero-loop-header">
        <div>
          <div className="terminal-kicker">Operations Loop</div>
          <div className="hero-loop-title">{scenario.label}</div>
        </div>
        <div className="hero-loop-badge">
          <span className="hero-loop-orb" />
          Passive demo
        </div>
      </div>

      <div className="hero-loop-command-wrap">
        <div className="hero-loop-command-label">dealrail$</div>
        <div className="hero-loop-command">
          {scenario.command}
          <span className="hero-loop-caret" aria-hidden="true" />
        </div>
      </div>

      <div className="hero-loop-body">
        {visible.map((step, index) => (
          <div
            key={`${scenario.id}-${index}-${step.text}`}
            className={
              step.tone === 'ok'
                ? 'hero-loop-line hero-loop-line-ok'
                : step.tone === 'warn'
                  ? 'hero-loop-line hero-loop-line-warn'
                  : 'hero-loop-line hero-loop-line-system'
            }
          >
            <span className="hero-loop-index">{String(index + 1).padStart(2, '0')}</span>
            <span>{step.text}</span>
          </div>
        ))}

        {visibleSteps < scenario.steps.length && (
          <div className="hero-loop-line hero-loop-line-pending">
            <span className="hero-loop-index">{String(visibleSteps + 1).padStart(2, '0')}</span>
            <span>waiting for next operation step...</span>
          </div>
        )}
      </div>

      <div className="hero-loop-footer">
        <div className="hero-loop-note">{scenario.note}</div>
        <div className="hero-loop-progress" aria-hidden="true">
          <span style={{ width: progressWidth }} />
        </div>
      </div>
    </section>
  );
}
