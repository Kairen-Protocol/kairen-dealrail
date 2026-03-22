import type { Metadata } from 'next';
import { IBM_Plex_Mono, Instrument_Serif, Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/AppShell';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
});
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'DealRail | Kairen',
  description: 'Ethereum machine-commerce desk for agent and human operators',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${plexMono.variable} ${instrumentSerif.variable}`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
