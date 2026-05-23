import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { LocationGate } from '@/components/location/LocationGate';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { ComparisonBar } from '@/components/layout/ComparisonBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Scout — Search once. Pay less.',
  description: 'Scout reads live prices, stock and delivery from twelve UK retailers — find the best deal instantly.',
  keywords: 'price comparison, UK deals, shopping, best prices',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <LocationGate>
            <Navigation />
            <main className="min-h-screen pt-[88px]">
              {children}
            </main>
            <Footer />
            <ComparisonBar />
          </LocationGate>
        </Providers>
      </body>
    </html>
  );
}
