import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search millions of live prices across 50+ retailers. Compare deals, track price drops, and find the best offer.',
  openGraph: {
    title: 'Search Products — Scout',
    description: 'Search millions of live prices across 50+ retailers.',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
