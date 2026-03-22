'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { healthCheck, HealthCheckResponse } from '@/lib/api';
import { HeroFlowLoop } from '@/components/HeroFlowLoop';

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
  const walletLabel = useMemo(() => {
    if (!isConnected || !address) return 'Wallet optional';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address, isConnected]);

  return (
    <div className="space-y-6">
      <section className="hero-grid editorial-card px-6 py-8 md:px-8 md:py-10">
        <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.08fr),minmax(320px,0.74fr)]">
          <div className="flex flex-col justify-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="terminal-kicker">Kairen / DealRail</span>
                <span className="terminal-chip">Quiet entry</span>
              </div>
              <h1 className="hero-display mt-5 max-w-4xl text-5xl md:text-6xl">
                Find a provider.
                <br />
                Lock terms.
                <br />
                Settle cleanly.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--terminal-muted)]">
                DealRail is for service deals that need clear steps: discover, agree, settle, and keep a visible
                receipt. The home page stays quiet. Watch the operating loop, then move into docs, jobs, or the Base
                surface when you need detail.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="terminal-chip">{health ? 'Backend online' : 'Backend offline'}</span>
                <span className="terminal-chip">{chainLabel}</span>
                <span className="terminal-chip">{walletLabel}</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/docs" className="terminal-btn terminal-btn-accent">
                  Start Guided
                </Link>
                <Link href="/dashboard" className="terminal-btn">
                  View Jobs
                </Link>
                <Link href="/base" className="terminal-btn">
                  Base Directory
                </Link>
              </div>
              <div className="mt-4 text-sm leading-6 text-[var(--terminal-muted)]">
                Need the command desk later? <Link href="/terminal" className="text-[var(--terminal-fg)] underline decoration-[var(--terminal-border)] underline-offset-4">Open /terminal</Link>.
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-command">open /docs</span>
                <span className="inline-command">open /dashboard</span>
                <span className="inline-command">curl -s dealrail.kairen.xyz/SKILL.md</span>
              </div>
            </div>
          </div>

          <div className="xl:pl-4">
            <HeroFlowLoop />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="terminal-panel rounded-[1.5rem] p-6">
          <div className="terminal-kicker">Guided Start</div>
          <div className="mt-3 text-2xl font-semibold">Use docs first</div>
          <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
            Best for humans. Read the short operating path, choose the lane, then move into terminal or jobs only when needed.
          </div>
          <div className="mt-4">
            <Link href="/docs" className="terminal-command">
              open /docs
            </Link>
          </div>
        </div>
        <div className="terminal-panel rounded-[1.5rem] p-6">
          <div className="terminal-kicker">Live Jobs</div>
          <div className="mt-3 text-2xl font-semibold">Read the active state</div>
          <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
            Best when you want proof quickly. Inspect running jobs, chain state, and the recorded lifecycle without starting in the command desk.
          </div>
          <div className="mt-4">
            <Link href="/dashboard" className="terminal-command">
              open /dashboard
            </Link>
          </div>
        </div>
        <div className="terminal-panel rounded-[1.5rem] p-6">
          <div className="terminal-kicker">Base Surface</div>
          <div className="mt-3 text-2xl font-semibold">Check the public directory</div>
          <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
            Use the Base-facing service surface when you need the public sponsor-track proof and visible supply story.
          </div>
          <div className="mt-4">
            <Link href="/base" className="terminal-command">
              open /base
            </Link>
          </div>
        </div>
      </section>

      <section className="terminal-panel rounded-[1.5rem] p-6">
        <div className="terminal-kicker">Simple Path</div>
        <h2 className="mt-3 text-3xl font-semibold">Start with one honest flow</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[1.2rem] border border-[var(--terminal-border)] bg-black/10 p-4">
            <div className="terminal-label">1. Start guided</div>
            <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
              Open docs first so the product explains the lanes before you touch terminal or wallet actions.
            </div>
          </div>
          <div className="rounded-[1.2rem] border border-[var(--terminal-border)] bg-black/10 p-4">
            <div className="terminal-label">2. Inspect proof</div>
            <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
              Use the jobs board and Base directory when you need the live state, receipts, and public surface quickly.
            </div>
          </div>
          <div className="rounded-[1.2rem] border border-[var(--terminal-border)] bg-black/10 p-4">
            <div className="terminal-label">3. Go deeper only if needed</div>
            <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
              The full command desk still exists on `/terminal`, but it is now a separate workspace instead of the home page burden.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
