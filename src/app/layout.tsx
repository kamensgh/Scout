import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { LocationGate } from '@/components/location/LocationGate';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const BASE_URL = 'https://scout-six-taupe.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Scout — Search once. Pay less.',
    template: '%s | Scout',
  },
  description: 'Compare live prices across 50+ retailers and find the best deal instantly. Scout tracks stock, delivery, and price drops so you never overpay.',
  keywords: ['price comparison', 'best deals', 'online shopping', 'lowest prices', 'price tracker', 'deal finder', 'local stores', 'price alerts'],
  authors: [{ name: 'Scout' }],
  creator: 'Scout',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Scout',
    title: 'Scout — Search once. Pay less.',
    description: 'Compare live prices across 50+ retailers. Track price drops, set alerts, and find the best deal instantly.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Scout — Search once. Pay less.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scout — Search once. Pay less.',
    description: 'Compare live prices across 50+ retailers. Track price drops, set alerts, and find the best deal instantly.',
    images: ['/opengraph-image'],
    creator: '@scoutprices',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
          </LocationGate>
        </Providers>
      </body>
    </html>
  );
}
