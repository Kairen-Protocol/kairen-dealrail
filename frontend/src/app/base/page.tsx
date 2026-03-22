'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BaseAgentServicesResponse, getApiOrigin, getErrorMessage, integrationsApi } from '@/lib/api';

export default function BaseAgentServicesPage() {
  const [directory, setDirectory] = useState<BaseAgentServicesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setDirectory(await integrationsApi.getBaseAgentServices());
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    })();
  }, []);

  const directoryUrl = `${getApiOrigin()}/api/v1/base/agent-services`;

  return (
    <div className="space-y-6">
      <section className="hero-grid editorial-card p-6">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="terminal-kicker">Base Agent Services</div>
            <h1 className="hero-display mt-3 text-5xl md:text-6xl">Public Base-facing service surface.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--terminal-muted)]">
              This page turns the Base track into something concrete: public endpoints, Base settlement posture, and the
              visible provider supply the desk can currently expose.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={directoryUrl} target="_blank" rel="noreferrer" className="terminal-btn terminal-btn-accent">
              View JSON
            </a>
            <Link href="/terminal" className="terminal-btn">
              Open Desk
            </Link>
            <Link href="/dashboard" className="terminal-btn">
              Market Board
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <section className="terminal-panel rounded-[1.5rem] p-6">
          <div className="text-sm text-[var(--terminal-danger)]">{error}</div>
        </section>
      )}

      {directory && (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="terminal-metric">
              <div className="terminal-label">Chain</div>
              <div className="mt-1 text-sm font-semibold">Base Sepolia</div>
            </div>
            <div className="terminal-metric">
              <div className="terminal-label">Catalog Mode</div>
              <div className={`mt-1 text-sm font-semibold ${directory.catalogMode === 'curated_demo' ? 'text-[var(--terminal-warn)]' : 'text-[var(--terminal-good)]'}`}>
                {directory.catalogMode === 'curated_demo' ? 'Curated demo' : 'Live blended'}
              </div>
            </div>
            <div className="terminal-metric">
              <div className="terminal-label">Public Surfaces</div>
              <div className="mt-1 text-sm font-semibold">{directory.publicSurfaces.length}</div>
            </div>
            <div className="terminal-metric">
              <div className="terminal-label">Visible Supply</div>
              <div className="mt-1 text-sm font-semibold">{directory.discovery.providerCount}</div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr,1.1fr]">
            <div className="terminal-panel rounded-[1.5rem] p-6">
              <div className="terminal-kicker">Settlement Rail</div>
              <div className="mt-4 space-y-3 text-sm text-[var(--terminal-muted)]">
                <div>
                  <div className="terminal-label">Escrow</div>
                  <div className="mt-1 break-all terminal-mono text-[var(--terminal-fg)]">{directory.settlementRail.escrowAddress}</div>
                </div>
                <div>
                  <div className="terminal-label">Stablecoin</div>
                  <div className="mt-1 break-all terminal-mono text-[var(--terminal-fg)]">
                    {directory.settlementRail.stablecoinSymbol} • {directory.settlementRail.stablecoinAddress}
                  </div>
                </div>
                <div>
                  <div className="terminal-label">Payment Models</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {directory.paymentModels.map((model) => (
                      <span key={model} className="terminal-chip">{model}</span>
                    ))}
                  </div>
                </div>
                <a
                  href={directory.settlementRail.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex text-xs text-[var(--terminal-accent)] hover:underline"
                >
                  View escrow on explorer
                </a>
              </div>
            </div>

            <section className="terminal-panel rounded-[1.5rem] p-6">
              <div className="terminal-kicker">Public Surfaces</div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {directory.publicSurfaces.map((surface) => (
                  <div key={surface.id} className="rounded-2xl border border-[var(--terminal-border)] bg-black/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{surface.name}</div>
                      <span className="terminal-chip">{surface.access}</span>
                    </div>
                    <div className="mt-2 terminal-mono text-[11px] text-[var(--terminal-accent)]">{surface.method} {surface.endpoint}</div>
                    <div className="mt-2 text-sm text-[var(--terminal-muted)]">{surface.useCase}</div>
                    <div className="mt-2 text-xs text-[var(--terminal-muted)]">{surface.settlementModel}</div>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <section className="terminal-panel rounded-[1.5rem] p-6">
            <div className="terminal-kicker">Visible Supply</div>
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              {directory.supplyPreview.map((service) => (
                <div key={`${service.source}-${service.providerAddress}-${service.serviceName}`} className="rounded-2xl border border-[var(--terminal-border)] bg-black/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{service.serviceName}</div>
                    <span className="terminal-chip">{service.source}</span>
                  </div>
                  <div className="mt-2 text-sm text-[var(--terminal-muted)]">{service.description || 'No description yet.'}</div>
                  <div className="mt-3 text-xs text-[var(--terminal-muted)]">
                    Base price {service.basePriceUsdc ?? 'n/a'} USDC • Rep {service.reputationScore ?? 'n/a'} • {service.erc8004Registered ? `ERC-8004 ${service.erc8004AgentId ?? 'visible'}` : 'Unverified'}
                  </div>
                  <div className="mt-2 break-all terminal-mono text-[11px] text-[var(--terminal-muted)]">
                    {service.endpoint || service.providerAddress}
                  </div>
                </div>
              ))}
              {directory.supplyPreview.length === 0 && (
                <div className="text-sm text-[var(--terminal-muted)]">
                  No provider supply is visible right now. The public Base surfaces still exist, but the discovery side needs a connected feed.
                </div>
              )}
            </div>
          </section>

          <section className="terminal-panel rounded-[1.5rem] p-6">
            <div className="terminal-kicker">Boundary</div>
            <div className="mt-4 space-y-2 text-sm leading-6 text-[var(--terminal-muted)]">
              {directory.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
