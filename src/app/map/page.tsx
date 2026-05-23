'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocationStore } from '@/store/location-store';
import { MapView } from '@/components/map/MapView';
import { StoreCard } from '@/components/stores/StoreCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Store } from '@/types';
import { queryKeys } from '@/lib/query-keys';

export default function MapPage() {
  const [mounted, setMounted] = useState(false);
  const { lat, lng, displayName } = useLocationStore();

  useEffect(() => { setMounted(true); }, []);

  const { data: stores, isLoading } = useQuery({
    queryKey: queryKeys.stores(lat, lng),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (lat) params.set('lat', String(lat));
      if (lng) params.set('lng', String(lng));
      const res = await fetch(`/api/stores?${params}`);
      const json = await res.json();
      return json.data as (Store & { distanceKm?: number })[];
    },
    enabled: mounted,
  });

  if (!mounted) return null;

  const physicalStores = (stores || []).filter(s => s.type !== 'online');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="section-label mb-1">Coverage</p>
        <h1 className="text-2xl font-bold text-scout-dark">
          {displayName ? `Stores near ${displayName}` : 'London store map'}
        </h1>
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
            : physicalStores.map(store => (
              <StoreCard key={store.id} store={store} />
            ))
          }
        </div>
      </div>
    </div>
  );
}
