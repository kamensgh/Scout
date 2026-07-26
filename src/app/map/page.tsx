'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocationStore } from '@/store/location-store';
import { MapView } from '@/components/map/MapView';
import { StoreCard } from '@/components/stores/StoreCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Store } from '@/types';
import { queryKeys } from '@/lib/query-keys';

const CATEGORY_FILTERS = [
  { id: '', label: 'All' },
  { id: 'computing', label: 'Computing & Phones' },
  { id: 'audio', label: 'Audio' },
  { id: 'tvs', label: 'TVs' },
  { id: 'home', label: 'Home' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'diy', label: 'DIY' },
  { id: 'sports', label: 'Sports' },
];

export default function MapPage() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const { lat, lng, displayName, country } = useLocationStore();

  useEffect(() => { setMounted(true); }, []);

  const { data: stores, isLoading } = useQuery({
    queryKey: queryKeys.stores(lat, lng),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (lat) params.set('lat', String(lat));
      if (lng) params.set('lng', String(lng));
      if (country) params.set('country', country.toLowerCase());
      const res = await fetch(`/api/stores?${params}`);
      const json = await res.json();
      return json.data as (Store & { distanceKm?: number })[];
    },
    enabled: mounted,
  });

  if (!mounted) return null;

  const allStores = stores || [];
  const physicalStores = allStores.filter(s => s.type !== 'online');

  // Physical/both stores always shown; online stores filtered by their category tags
  const visibleStores = activeCategory
    ? allStores.filter(s =>
        s.type !== 'online' || s.categories?.includes(activeCategory)
      )
    : allStores;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="section-label mb-1">Coverage</p>
        <h1 className="text-2xl font-serif text-scout-dark">
          {displayName ? <>Stores near <em className="italic">{displayName}</em></> : 'Store map'}
        </h1>
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORY_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeCategory === id
                ? 'bg-scout-dark text-white border-scout-dark'
                : 'bg-white text-scout-muted border-scout-border hover:text-scout-dark hover:border-scout-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <MapView stores={physicalStores} height="600px" className="shadow-card" />
        </div>

        {/* Store list */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
            : visibleStores.map(store => (
              <StoreCard key={store.id} store={store} />
            ))
          }
        </div>
      </div>
    </div>
  );
}
