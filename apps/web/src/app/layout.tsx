import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'GG Stats — League of Legends & TFT Statistics',
    template: '%s | GG Stats',
  },
  description:
    'Real-time statistics, builds, and match history for League of Legends and Teamfight Tactics. Track your performance and climb the ranks.',
  keywords: [
    'League of Legends',
    'LoL',
    'TFT',
    'Teamfight Tactics',
    'stats',
    'statistics',
    'builds',
    'match history',
    'ranked',
    'live game',
  ],
  openGraph: {
    title: 'GG Stats — League of Legends & TFT Statistics',
    description: 'Real-time statistics, builds, and match history for LoL and TFT.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
