'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/terminal', label: 'Terminal' },
  { href: '/dashboard', label: 'Board' },
  { href: '/docs', label: 'Docs' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    return window.localStorage.getItem('dealrail.theme') === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem('dealrail.theme', nextTheme);
  }

  return (
    <div className="relative min-h-screen bg-[var(--terminal-bg)] text-[var(--terminal-fg)]">
      <header className="shell-header sticky top-0 z-20 border-b border-[var(--terminal-border)]">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="shell-brand shell-brand-compact">
            <div className="terminal-kicker">Kairen</div>
            <div className="shell-brandmark shell-brandmark-compact">DealRail</div>
          </Link>

          <nav className="ml-auto flex items-center gap-1 overflow-x-auto whitespace-nowrap">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shell-nav-link shell-nav-link-minimal ${active ? 'shell-nav-link-active' : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="shell-divider hidden sm:block" />

          <div className="hidden sm:block">
            <ConnectButton showBalance={false} />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="shell-theme-toggle terminal-mono"
            suppressHydrationWarning
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
