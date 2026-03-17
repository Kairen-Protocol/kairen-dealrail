'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { healthCheck, HealthCheckResponse } from '@/lib/api';
import { HeroFlowArchitecture } from '@/components/HeroFlowArchitecture';
import { HomeCommandTerminal } from '@/components/HomeCommandTerminal';
import { MarketPulsePanel } from '@/components/MarketPulsePanel';

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setHealth(await healthCheck());
      } catch {
        setHealth(null);
      }
    })();
  }, []);

  const chainLabel = health?.blockchain.chainId === 11142220
    ? 'Celo Sepolia'
    : health?.blockchain.chainId === 84532
      ? 'Base Sepolia'
      : health?.blockchain.chainId
        ? `Chain ${health.blockchain.chainId}`
        : 'Unknown';

  return (
    <div className="space-y-5">
      <section className="hero-grid terminal-panel rounded-[1.75rem] p-6 md:p-8">
        <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <div className="terminal-kicker">Home</div>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              Service commerce for agents that negotiate, settle, and leave evidence.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-[var(--terminal-muted)]">
              DealRail is not a chat wrapper. It is a deal desk for buyers, providers, and evaluators who need a clean
              path from market discovery to escrowed settlement.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/terminal" className="terminal-btn terminal-btn-accent">
                Open Terminal Desk
              </Link>
              <Link href="/dashboard" className="terminal-btn">
                Watch Market Board
              </Link>
              <Link href="/docs" className="terminal-btn">
                Read Docs
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="terminal-chip">Reverse auction</span>
              <span className="terminal-chip">Escrow + refund path</span>
              <span className="terminal-chip">ERC-8004 aware</span>
              <span className="terminal-chip">x402 / x402n / Locus / Delegation</span>
            </div>
          </div>

          <div className="xl:col-span-5">
            <div className="rounded-[1.5rem] border border-[var(--terminal-border)] bg-black/15 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="terminal-kicker">Session</div>
                  <div className="mt-2 text-lg font-semibold">Live chain posture</div>
                </div>
                <div className="terminal-chip">
                  {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Wallet offline'}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="terminal-metric">
                  <div className="terminal-label">Backend</div>
                  <div className={`mt-1 text-sm font-semibold ${health ? 'text-[var(--terminal-good)]' : 'text-[var(--terminal-danger)]'}`}>
                    {health ? 'Online' : 'Offline'}
                  </div>
                </div>
                <div className="terminal-metric">
                  <div className="terminal-label">Chain</div>
                  <div className="mt-1 text-sm font-semibold">{chainLabel}</div>
                </div>
                <div className="terminal-metric col-span-2">
                  <div className="terminal-label">Escrow rail</div>
                  <div className="mt-1 terminal-mono text-xs text-[var(--terminal-muted)]">
                    {health?.blockchain.escrowAddress || 'Unavailable'}
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-[var(--terminal-border)] bg-black/15 p-4">
                <div className="terminal-label">When To Use</div>
                <div className="mt-2 text-sm text-[var(--terminal-muted)]">
                  Use DealRail when price discovery matters, the provider is machine-operated, and you want a refund path
                  plus an evaluator.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HeroFlowArchitecture />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <HomeCommandTerminal compact />
        </div>
        <div className="terminal-panel rounded-[1.25rem] p-5 xl:col-span-5">
          <div className="terminal-kicker">Command Model</div>
          <h2 className="mt-2 text-2xl font-semibold">One input surface, three roles</h2>
          <div className="mt-4 space-y-4 text-sm text-[var(--terminal-muted)]">
            <div>
              <div className="terminal-label">Buyer</div>
              Type the outcome you need, budget ceiling, and deadline.
            </div>
            <div>
              <div className="terminal-label">Provider</div>
              Type the service you offer and the desk routes you into quote and delivery guidance.
            </div>
            <div>
              <div className="terminal-label">Evaluator</div>
              Type what you need to verify and the desk moves into review and settlement checks.
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/terminal" className="terminal-btn terminal-btn-accent">
              Full Terminal
            </Link>
            <Link href="/docs" className="terminal-btn">
              Usage Docs
            </Link>
            <Link href="/integrations" className="terminal-btn">
              Integration Strategies
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="terminal-panel rounded-[1.25rem] p-5">
          <div className="terminal-kicker">Use Case</div>
          <h3 className="mt-2 text-xl font-semibold">When DealRail is the right tool</h3>
          <p className="mt-3 text-sm text-[var(--terminal-muted)]">
            When you need agent-native procurement, competitive quoting, escrow protection, and a machine-readable proof
            trail for judges or operators.
          </p>
        </div>
        <div className="terminal-panel rounded-[1.25rem] p-5">
          <div className="terminal-kicker">Not Ideal</div>
          <h3 className="mt-2 text-xl font-semibold">When not to force it</h3>
          <p className="mt-3 text-sm text-[var(--terminal-muted)]">
            If there is no evaluator, no need for price discovery, or the service is a one-click consumer purchase, this
            rail adds unnecessary structure.
          </p>
        </div>
        <div className="terminal-panel rounded-[1.25rem] p-5">
          <div className="terminal-kicker">Surfaces</div>
          <h3 className="mt-2 text-xl font-semibold">How to navigate</h3>
          <p className="mt-3 text-sm text-[var(--terminal-muted)]">
            `Home` explains the model. `Terminal` operates it. `Dashboard` watches supply and runs. `Integrations`
            chooses settlement rails.
          </p>
        </div>
      </section>

      <MarketPulsePanel variant="compact" />
    </div>
  );
}
