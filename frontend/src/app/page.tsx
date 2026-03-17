'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { healthCheck, HealthCheckResponse } from '@/lib/api';

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
      <section className="terminal-panel rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="terminal-mono text-xs uppercase tracking-[0.2em] text-[var(--terminal-accent)]">Mission Control</div>
            <h1 className="mt-2 text-2xl font-semibold">Simple flow, clear evidence</h1>
            <p className="mt-2 max-w-3xl text-sm text-[var(--terminal-muted)]">
              This UI is split by task. Start with Flow for negotiation and confirmation, then move to Ops for onchain execution.
            </p>
          </div>
          <div className="terminal-mono rounded border border-[var(--terminal-border)] bg-black/25 px-3 py-2 text-xs text-[var(--terminal-muted)]">
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Wallet not connected'}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link className="terminal-panel rounded-xl p-4 hover:border-[var(--terminal-accent)]" href="/flow">
          <div className="terminal-mono text-xs text-[var(--terminal-accent)]">01</div>
          <h2 className="mt-2 text-lg font-semibold">Flow</h2>
          <p className="mt-1 text-sm text-[var(--terminal-muted)]">Discovery, reverse auction, batch confirm, receipt.</p>
        </Link>
        <Link className="terminal-panel rounded-xl p-4 hover:border-[var(--terminal-accent)]" href="/ops">
          <div className="terminal-mono text-xs text-[var(--terminal-accent)]">02</div>
          <h2 className="mt-2 text-lg font-semibold">Ops</h2>
          <p className="mt-1 text-sm text-[var(--terminal-muted)]">Create, fund, submit, complete/reject jobs.</p>
        </Link>
        <Link className="terminal-panel rounded-xl p-4 hover:border-[var(--terminal-accent)]" href="/integrations">
          <div className="terminal-mono text-xs text-[var(--terminal-accent)]">03</div>
          <h2 className="mt-2 text-lg font-semibold">Integrations</h2>
          <p className="mt-1 text-sm text-[var(--terminal-muted)]">Uniswap, Locus, x402, delegation adapters.</p>
        </Link>
      </section>

      <section className="terminal-panel rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="terminal-mono text-[var(--terminal-muted)]">Backend</div>
          <div className={health ? 'text-[var(--terminal-good)]' : 'text-red-400'}>{health ? 'ONLINE' : 'OFFLINE'}</div>
          <div className="terminal-mono text-[var(--terminal-muted)]">Chain</div>
          <div>{chainLabel}</div>
          <div className="terminal-mono text-[var(--terminal-muted)]">Escrow</div>
          <div className="terminal-mono text-xs">
            {health?.blockchain.escrowAddress
              ? `${health.blockchain.escrowAddress.slice(0, 8)}...${health.blockchain.escrowAddress.slice(-6)}`
              : '-'}
          </div>
        </div>
      </section>
    </div>
  );
}
