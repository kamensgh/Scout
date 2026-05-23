'use client';

import { useState } from 'react';
import { TrendingGrid } from '@/components/products/TrendingGrid';
import type { ProductCategory } from '@/types';

const TABS: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'audio', label: 'Audio' },
  { id: 'computing', label: 'Computing' },
  { id: 'tvs', label: 'TVs' },
  { id: 'home', label: 'Home' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'diy', label: 'DIY' },
  { id: 'sports', label: 'Sports' },
];

export default function TrendingPage() {
  const [tab, setTab] = useState<ProductCategory | 'all'>('all');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="section-label mb-1">Today</p>
        <h1 className="text-2xl font-bold text-scout-dark">Trending &amp; best deals</h1>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
              tab === id
                ? 'bg-scout-dark text-white border-scout-dark'
                : 'bg-white text-scout-muted border-scout-border hover:text-scout-dark hover:border-scout-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <TrendingGrid category={tab === 'all' ? undefined : tab} limit={12} />
    </div>
  );
}
