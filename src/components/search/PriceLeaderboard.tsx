'use client';

import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useLocationStore } from '@/store/location-store';
import { useCurrency } from '@/hooks/useCurrency';
import { queryKeys } from '@/lib/query-keys';

interface PriceLeaderboardProps {
  query: string;
}

export function PriceLeaderboard({ query }: PriceLeaderboardProps) {
  const { lat, lng } = useLocationStore();
  const { formatPrice } = useCurrency();

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: queryKeys.search(query, lat, lng),
    queryFn: async () => {
      const params = new URLSearchParams({ q: query });
      if (lat) params.set('lat', String(lat));
      if (lng) params.set('lng', String(lng));
      const res = await fetch(`/api/search?${params}`);
      const json = await res.json();
      return json.data as Product[];
    },
    enabled: !!query,
  });

  if (isLoading || !data || data.length === 0) return null;

  // Sort by lowest price, take top 8
  const sorted = [...data].sort((a, b) => a.lowestPricePence - b.lowestPricePence).slice(0, 8);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label mb-0.5">Compare</p>
          <h2 className="text-lg font-bold text-scout-dark">Price comparison</h2>
        </div>
        <span className="text-xs text-scout-muted">Sorted cheapest first</span>
      </div>

      <div className="border border-scout-border rounded-2xl overflow-hidden">
        {sorted.map((product, i) => {
          const cheapest = product.storePrices[0]; // already sorted by price in serpapi
          const savings = product.rrpPence > product.lowestPricePence
            ? Math.round(((product.rrpPence - product.lowestPricePence) / product.rrpPence) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className={cn(
                'flex items-center gap-3 px-4 py-3 hover:bg-scout-bg/50 transition-colors',
                i !== sorted.length - 1 && 'border-b border-scout-border'
              )}
            >
              {/* Rank */}
              <span className="w-5 text-xs font-bold text-scout-muted shrink-0">{i + 1}</span>

              {/* Product name */}
              <Link
                href={`/product/${product.id}`}
                className="flex-1 min-w-0 hover:text-scout-dark transition-colors"
              >
                <p className="text-sm font-medium text-scout-dark truncate">{product.name}</p>
                <p className="text-xs text-scout-muted">{cheapest?.storeName || product.brand}</p>
              </Link>

              {/* All store prices */}
              <div className="hidden md:flex items-center gap-2 shrink-0">
                {product.storePrices.slice(0, 4).map(sp => (
                  <a
                    key={sp.storeId}
                    href={sp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${sp.storeName} — ${formatPrice(sp.pricePence)}`}
                    className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg bg-scout-bg hover:bg-scout-border transition-colors text-xs"
                  >
                    <span className="font-bold text-scout-dark">{formatPrice(sp.pricePence)}</span>
                    <span className="text-scout-muted">{sp.storeAbbreviation}</span>
                  </a>
                ))}
                {product.storePrices.length > 4 && (
                  <span className="text-xs text-scout-muted">+{product.storePrices.length - 4}</span>
                )}
              </div>

              {/* Best price + savings */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-scout-green">{formatPrice(product.lowestPricePence)}</p>
                {savings >= 5 && (
                  <p className="text-xs text-scout-muted line-through">{formatPrice(product.rrpPence)}</p>
                )}
              </div>

              {/* Buy CTA — direct retailer URL when we have it, otherwise
                  resolve via /api/buy/[id] which 302s to the real retailer */}
              <a
                href={
                  cheapest?.url && cheapest.url !== '#' && !/google\.com\/search/i.test(cheapest.url)
                    ? cheapest.url
                    : `/api/buy/${product.id}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-scout-dark text-white text-xs font-medium rounded-lg hover:bg-scout-dark/90 transition-colors shrink-0"
              >
                Buy <ExternalLink size={11} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
