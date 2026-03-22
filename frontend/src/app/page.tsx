'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { healthCheck, HealthCheckResponse } from '@/lib/api';
import { HeroFlowArchitecture } from '@/components/HeroFlowArchitecture';
import { HomeCommandTerminal } from '@/components/HomeCommandTerminal';

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const heroWords = ['machine buyers', 'provider supply', 'procurement runs', 'escrow receipts', 'autonomous deals'];

  useEffect(() => {
    void (async () => {
      try {
        setHealth(await healthCheck());
      } catch {
        setHealth(null);
      }
    })();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroWordIndex((current) => (current + 1) % heroWords.length);
    }, 2200);

    return () => window.clearInterval(timer);
  }, [heroWords.length]);

  const chainLabel = health?.blockchain.chainId === 11142220
    ? 'Celo Sepolia'
    : health?.blockchain.chainId === 84532
      ? 'Base Sepolia'
      : health?.blockchain.chainId
        ? `Chain ${health.blockchain.chainId}`
        : 'Unknown';

  return (
    <div className="space-y-8">
      <section className="hero-grid editorial-card px-6 py-8 md:px-8 md:py-10">
        <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-[1.04fr,0.96fr]">
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="terminal-kicker">Kairen / DealRail</span>
                <span className="terminal-chip">Ethereum machine payments + escrow</span>
              </div>
              <h1 className="hero-display mt-5 max-w-4xl text-5xl md:text-7xl">
                A cleaner desk for
                <br />
                <span className="hero-word-window mt-2 inline-flex min-h-[1.08em] items-center">
                  <span key={heroWords[heroWordIndex]} className="hero-word-item text-[var(--terminal-accent)]">
                    {heroWords[heroWordIndex]}
                  </span>
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--terminal-muted)]">
                One request in. Provider supply scanned. Payment posture chosen. Escrow committed when the job needs
                it. Receipt emitted at the end for the next human or agent step.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/terminal" className="terminal-btn terminal-btn-accent">
                  Open Desk
                </Link>
                <Link href="/base" className="terminal-btn">
                  Base Services
                </Link>
                <Link href="/docs" className="terminal-btn">
                  Read Docs
                </Link>
                <Link href="/dashboard" className="terminal-btn">
                  Market Board
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-command">npx @kairenxyz/dealrail doctor</span>
                <span className="inline-command">npx @kairenxyz/dealrail doctor --json</span>
              </div>
            </div>

            <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 md:grid-cols-3">
              <div className="terminal-metric">
                <div className="terminal-label">Human lane</div>
                <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
                  Use the browser desk when you want a guided, legible workflow and a demo that does not require wallet connection.
                </div>
              </div>
              <div className="terminal-metric">
                <div className="terminal-label">Agent lane</div>
                <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
                  Use the published CLI in JSON mode when another runtime is driving the deal.
                </div>
              </div>
              <div className="terminal-metric">
                <div className="terminal-label">Settlement</div>
                <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
                  Machine payment for immediate calls, escrow when a scoped service deal needs a receipt.
                </div>
              </div>
            </div>
          </div>

          <div className="xl:pl-4">
            <HomeCommandTerminal compact />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="terminal-panel rounded-[1.5rem] p-6">
          <div className="terminal-kicker">Live posture</div>
          <div className="mt-3 text-2xl font-semibold">{health ? 'Backend online' : 'Backend offline'}</div>
          <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
            {health
              ? `Connected to ${chainLabel} with ${health.integrations?.x402nMockMode ? 'demo' : 'live'} competition posture.`
              : 'Connect the backend before recording flows or checking the CLI preflight.'}
          </div>
        </div>
        <div className="terminal-panel rounded-[1.5rem] p-6">
          <div className="terminal-kicker">Wallet</div>
          <div className="mt-3 text-2xl font-semibold">{isConnected ? 'Connected' : 'Offline'}</div>
          <div className="mt-2 break-all text-sm leading-6 text-[var(--terminal-muted)]">
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Use wallet connection only when you need live settlement or delegation demos.'}
          </div>
        </div>
        <div className="terminal-panel rounded-[1.5rem] p-6">
          <div className="terminal-kicker">Escrow rail</div>
          <div className="mt-3 terminal-mono text-sm leading-6 text-[var(--terminal-fg)]">
            {health?.blockchain.escrowAddress || 'Unavailable'}
          </div>
          <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
            Base and Celo settlement remain the reliable proof layer for the current product story.
          </div>
        </div>
      </section>

      <HeroFlowArchitecture />

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="terminal-panel rounded-[1.5rem] p-6 xl:col-span-7">
          <div className="terminal-kicker">Start Here</div>
          <h2 className="mt-3 text-3xl font-semibold">The desk should feel simple</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--terminal-muted)]">
            <p>1. Run `doctor` to confirm the desk can actually see the backend and the current rail posture.</p>
            <p>2. Run `services` to inspect the Base-facing public service directory, or `vend image generation under 0.08 usdc in 6h` to stage a quick demo path.</p>
            <p>3. Connect a wallet only when you want to graduate from demo mode into a real provider or client settlement flow.</p>
          </div>
        </div>
        <div className="terminal-panel rounded-[1.5rem] p-6 xl:col-span-5">
          <div className="terminal-kicker">Quick Links</div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/terminal" className="terminal-btn terminal-btn-accent">
              Full Terminal
            </Link>
            <Link href="/docs" className="terminal-btn">
              Usage Docs
            </Link>
            <Link href="/integrations" className="terminal-btn">
              Rails
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
