import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stores Near You',
  description: 'Find physical and online stores near you. Browse categories, compare prices, and get directions.',
  openGraph: {
    title: 'Stores Near You — Scout',
    description: 'Find physical and online stores near you with live pricing.',
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
