'use client';

import { useState } from 'react';
import { HomeCommandTerminal, TerminalAction } from '@/components/HomeCommandTerminal';
import { listTerminalRuns } from '@/lib/terminalLedger';
import { CliDemoTerminal } from '@/components/CliDemoTerminal';

const stepMap: Record<string, string[]> = {
  help: ['Read command map', 'Choose a role or rail'],
  doctor: ['Check backend reachability', 'Read discovery and rail posture', 'Choose the next human or agent path'],
  status: ['Check backend health', 'Confirm active chain and escrow'],
  wallet_send: ['Connect wallet if needed', 'Switch to the requested testnet', 'Submit the send transaction', 'Open explorer receipt'],
  swap_preview: ['Read the sample route', 'Keep it labeled as sample', 'Use live wallet sends as the stronger demo proof'],
  start_flow: ['Capture policy', 'Discover supply', 'Run reverse auction', 'Batch and confirm'],
  start_ops: ['Create job', 'Fund escrow', 'Submit deliverable', 'Resolve settlement'],
  open_integrations: ['Choose a settlement rail', 'Configure values', 'Execute or inspect output'],
  market_scan: ['Read discovery sources', 'Compare available agents', 'Choose counterparties'],
  role_buyer: ['Capture budget and delivery terms', 'Scan providers', 'Launch reverse auction'],
  role_provider: ['Prepare service listing', 'Join active auctions', 'Submit winning deliverable'],
  role_evaluator: ['Inspect deliverable', 'Complete or reject', 'Write outcome to reputation rail'],
  clear: ['Reset terminal output'],
  unknown: ['Refine command', 'Use help or role keywords'],
};

export default function TerminalPage() {
  const [lastAction, setLastAction] = useState<TerminalAction | null>(null);
  const [runs, setRuns] = useState(() => listTerminalRuns().slice(0, 12));

  function handleAction(action: TerminalAction) {
    setLastAction(action);
    setRuns(listTerminalRuns().slice(0, 12));
  }

  const steps = lastAction ? stepMap[lastAction.kind] || ['Command received'] : ['Run your first command in terminal'];

  return (
    <div className="space-y-6">
      <section className="hero-grid editorial-card p-6">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="terminal-kicker">Terminal</div>
            <h1 className="hero-display mt-3 text-5xl md:text-6xl">A simpler command surface for DealRail.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
              Start with `doctor`, then use one of two honest paths: hardcoded service demos for the product story, or
              real wallet sends on testnet for the transaction moment.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-command">doctor</span>
            <span className="inline-command">services</span>
            <span className="inline-command">send 1 usdc to 0x... on base sepolia</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <HomeCommandTerminal onAction={handleAction} />
        </div>
        <div className="space-y-5 xl:col-span-4">
          <div className="terminal-panel rounded-[1.5rem] p-6">
            <div className="terminal-kicker">Recommended Demo</div>
            <div className="mt-5 space-y-4 text-sm leading-6 text-[var(--terminal-muted)]">
              <div>
                <div className="terminal-label">`doctor`</div>
                Run this first. It tells you whether the backend is reachable, which chain is active, and whether the wallet path is ready.
              </div>
              <div>
                <div className="terminal-label">`services`</div>
                Use this for the hardcoded frontend demo path. It is the cleanest way to show the product idea without overclaiming live market depth.
              </div>
              <div>
                <div className="terminal-label">`send`</div>
                Use this for the strongest live browser proof: a wallet-connected testnet send on Base Sepolia or Celo Sepolia directly from the terminal.
              </div>
              <div>
                <div className="terminal-label">`vend`</div>
                Use this when you want the procurement-style sample path: state the need, budget, and delivery target, then let the desk shortlist from the curated catalog.
              </div>
              <div>
                <div className="terminal-label">`swap`</div>
                Keep this as a sample-only terminal command for now. It explains routing without pretending the desk already executes live testnet swaps.
              </div>
            </div>
          </div>

          <div className="terminal-panel rounded-[1.5rem] p-6">
            <div className="terminal-kicker">Human And Agent</div>
            <div className="mt-4 space-y-3">
              <div className="rounded-[1.2rem] border border-[var(--terminal-border)] bg-black/10 p-4">
                <div className="terminal-label">Human</div>
                <div className="mt-2 text-sm font-semibold">Doctor, demo, then send.</div>
                <div className="mt-2 text-xs leading-5 text-[var(--terminal-muted)]">
                  Use the browser terminal when you want a guided flow. Start with hardcoded demo services, then use a real wallet send for the transaction moment in the demo.
                </div>
                <div className="mt-3 terminal-mono text-[11px] text-[var(--terminal-accent)]">doctor -&gt; services -&gt; send 1 usdc to 0x... on base sepolia</div>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--terminal-border)] bg-black/10 p-4">
                <div className="terminal-label">Agent</div>
                <div className="mt-2 text-sm font-semibold">Preflight in JSON, then use the curated procurement sample.</div>
                <div className="mt-2 text-xs leading-5 text-[var(--terminal-muted)]">
                  Use the publishable CLI when another agent needs machine-readable posture and deterministic output.
                </div>
                <div className="mt-3 terminal-mono text-[11px] text-[var(--terminal-accent)]">dealrail doctor --json -&gt; dealrail vend ... --json</div>
              </div>
            </div>
          </div>

          <div className="terminal-panel rounded-[1.5rem] p-6">
            <div className="terminal-kicker">Last Command</div>
            <div className="mt-4 space-y-3">
              {steps.map((step, idx) => (
                <div key={`${step}-${idx}`} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--terminal-border)] bg-black/15 terminal-mono text-[10px] text-[var(--terminal-accent)]">
                    {idx + 1}
                  </div>
                  <div className="text-[var(--terminal-muted)]">{step}</div>
                </div>
              ))}
            </div>
            {lastAction && (
              <div className="mt-5 rounded-2xl border border-[var(--terminal-border)] bg-black/10 p-4 text-xs text-[var(--terminal-muted)]">
                <div className="terminal-label">Last command</div>
                <div className="mt-2 terminal-mono text-[var(--terminal-fg)]">{lastAction.command}</div>
                <div className="mt-1 text-[var(--terminal-good)]">{lastAction.note}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="terminal-panel rounded-[1.5rem] p-6">
        <div className="terminal-kicker">Recent Commands</div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {runs.slice(0, 4).map((run) => (
            <div key={run.id} className="rounded-2xl border border-[var(--terminal-border)] bg-black/10 p-4 text-xs">
              <div className="terminal-mono text-[var(--terminal-muted)]">{new Date(run.at).toLocaleTimeString()}</div>
              <div className="mt-2 break-words terminal-mono text-[var(--terminal-fg)]">{run.command}</div>
              <div className="mt-1 text-[var(--terminal-good)]">{run.note}</div>
            </div>
          ))}
          {runs.length === 0 && <div className="text-xs text-[var(--terminal-muted)]">No runs yet.</div>}
        </div>
      </section>

      <CliDemoTerminal />
    </div>
  );
}
