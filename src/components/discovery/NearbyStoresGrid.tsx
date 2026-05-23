'use client';

import { useQuery } from '@tanstack/react-query';
import type { PlaceResult } from '@/types';
import { NearbyStoreCard } from './NearbyStoreCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { queryKeys } from '@/lib/query-keys';
import { useLocationStore } from '@/store/location-store';
import { MapPin } from 'lucide-react';

interface NearbyStoresGridProps {
  category?: string;
}

export function NearbyStoresGrid({ category = 'electronics' }: NearbyStoresGridProps) {
  const { lat, lng, city } = useLocationStore();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.places(lat || 0, lng || 0, category),
    queryFn: async () => {
      if (!lat || !lng) return [];
      const params = new URLSearchParams({ lat: String(lat), lng: String(lng), category });
      const res = await fetch(`/api/location/places?${params}`);
      const json = await res.json();
      return json.data as PlaceResult[];
    },
    enabled: !!lat && !!lng,
    staleTime: 1000 * 60 * 10,
  });

  if (!lat || !lng) return null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-scout-border rounded-2xl p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center py-12 text-scout-muted">
        <MapPin size={32} className="mx-auto mb-3 text-scout-border" />
        <p className="text-sm">No stores found nearby — try a different category</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-scout-muted mb-4">{data.length} stores near {city}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(place => (
          <NearbyStoreCard key={place.placeId} place={place} />
        ))}
      </div>
    </div>
  );
}
