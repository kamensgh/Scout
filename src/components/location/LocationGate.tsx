'use client';

import { useEffect, useState, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocationStore } from '@/store/location-store';
import { LocationModal } from './LocationModal';
import { LoadingScreen } from './LoadingScreen';
import type { Product } from '@/types';

const SAVINGS_QUERY = 'best deals sale price drop discount electronics clearance';
const POPULAR_QUERY = 'most popular bestseller trending gadgets electronics 2024';

export function LocationGate({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [dataReady, setDataReady] = useState(true);
  const prevStatusRef = useRef<string | null>(null);
  const queryClient = useQueryClient();

  const { status, lat, lng, country, isPickerOpen, closePicker } = useLocationStore();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = status;

    if (prev !== 'detecting' || status !== 'resolved' || !lat || !lng) return;

    closePicker();
    setDataReady(false);

    const cc = (country || 'gb').toLowerCase();

    const prefetchTrending = (queryOverride: string) =>
      queryClient.prefetchQuery({
        queryKey: ['trending', queryOverride, lat, lng],
        queryFn: async () => {
          const p = new URLSearchParams({ limit: '4', lat: String(lat), lng: String(lng), country: cc, q: queryOverride });
          const res = await fetch(`/api/trending?${p}`);
          return (await res.json()).data ?? [];
        },
        staleTime: 5 * 60 * 1000,
      });

    const run = async () => {
      await Promise.all([
        // Nearby + online stores (include country for curated online retailers)
        queryClient.prefetchQuery({
          queryKey: ['stores', lat, lng, cc],
          queryFn: async () => {
            const p = new URLSearchParams({ lat: String(lat), lng: String(lng), country: cc });
            const res = await fetch(`/api/stores?${p}`);
            return (await res.json()).data ?? [];
          },
          staleTime: 5 * 60 * 1000,
        }),
        // Biggest savings section
        prefetchTrending(SAVINGS_QUERY),
        // What everyone is buying section
        prefetchTrending(POPULAR_QUERY),
      ]);

      // Safety: if either trending query came back empty, retry with US fallback
      for (const q of [SAVINGS_QUERY, POPULAR_QUERY]) {
        const key = ['trending', q, lat, lng];
        const cached = queryClient.getQueryData<Product[]>(key);
        if (!cached || cached.length === 0) {
          try {
            const p = new URLSearchParams({ limit: '4', lat: String(lat), lng: String(lng), country: 'us', q });
            const res = await fetch(`/api/trending?${p}`);
            const json = await res.json();
            if (json.data?.length > 0) queryClient.setQueryData(key, json.data);
          } catch { /* ignore */ }
        }
      }
    };

    run().finally(() => setDataReady(true));
  }, [status, lat, lng, country, queryClient, closePicker]);

  if (!mounted) return null;
  if (status !== 'resolved' || isPickerOpen) return <LocationModal />;
  if (!dataReady) return <LoadingScreen />;

  return <>{children}</>;
}
