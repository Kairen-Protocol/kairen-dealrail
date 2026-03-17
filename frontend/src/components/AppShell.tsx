'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/flow', label: 'Flow' },
  { href: '/ops', label: 'Ops' },
  { href: '/integrations', label: 'Integrations' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--terminal-bg)] text-[var(--terminal-fg)]">
      <header className="sticky top-0 z-20 border-b border-[var(--terminal-border)] bg-[var(--terminal-panel)]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-fit">
            <div className="text-sm uppercase tracking-[0.2em] text-[var(--terminal-accent)]">DealRail Terminal</div>
            <div className="text-xs text-[var(--terminal-muted)]">Negotiate {'->'} Escrow {'->'} Settle</div>
          </div>
          <nav className="ml-auto flex flex-wrap items-center gap-2">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded border px-3 py-1.5 text-xs uppercase tracking-wider transition ${
                    active
                      ? 'border-[var(--terminal-accent)] bg-[var(--terminal-accent)]/15 text-[var(--terminal-accent)]'
                      : 'border-[var(--terminal-border)] bg-black/20 text-[var(--terminal-muted)] hover:border-[var(--terminal-accent)]/60 hover:text-[var(--terminal-fg)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-2">
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
