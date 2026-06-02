'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useMemo, useEffect, useRef } from 'react';
import type { Product, ProductCategory } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { queryKeys } from '@/lib/query-keys';
import { useLocationStore } from '@/store/location-store';
import { useSearchStore } from '@/store/search-store';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { SearchX, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SortBy } from '@/store/search-store';

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const { lat, lng, country } = useLocationStore();
  const { filters, sortBy, setSortBy, setFilters } = useSearchStore();
  const autoSelectedRef = useRef(false);

  const { data: rawData, isLoading, error } = useQuery({
    queryKey: queryKeys.search(query, lat, lng),
    queryFn: async () => {
      const params = new URLSearchParams({ q: query });
      if (lat) params.set('lat', String(lat));
      if (lng) params.set('lng', String(lng));
      if (country) params.set('country', country.toLowerCase());
      const res = await fetch(`/api/search?${params}`);
      const json = await res.json();
      return json.data as Product[];
    },
    enabled: !!query,
  });

  // Auto-select most common category when results first arrive
  useEffect(() => {
    if (!rawData || rawData.length === 0 || autoSelectedRef.current) return;
    autoSelectedRef.current = true;
    const counts = new Map<string, number>();
    for (const p of rawData) counts.set(p.category, (counts.get(p.category) || 0) + 1);
    const top = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] as ProductCategory;
    if (top && filters.categories.length === 0) {
      setFilters({ categories: [top] });
    }
  }, [rawData]);

  // Reset auto-select when query changes
  useEffect(() => {
    autoSelectedRef.current = false;
  }, [query]);

  const data = useMemo(() => {
    if (!rawData) return [];
    let result = [...rawData];

    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }
    if (filters.minPricePence != null && filters.minPricePence > 0) {
      result = result.filter(p => p.lowestPricePence >= filters.minPricePence!);
    }
    if (filters.maxPricePence != null && filters.maxPricePence < 500000) {
      result = result.filter(p => p.lowestPricePence <= filters.maxPricePence!);
    }
    if (filters.inStockOnly) {
      result = result.filter(p => p.storePrices.some(sp => sp.inStock));
    }
    if (filters.freeDelivery) {
      result = result.filter(p => p.storePrices.some(sp => sp.deliveryFeePence === 0));
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.lowestPricePence - b.lowestPricePence);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.lowestPricePence - a.lowestPricePence);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [rawData, filters, sortBy]);

  if (isLoading) {
    return (
      <div>
        <div className="h-9 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error || !rawData) {
    return <div className="text-center py-12"><p className="text-scout-muted">Failed to load results.</p></div>;
  }

  if (rawData.length === 0) {
    return (
      <div className="text-center py-16">
        <SearchX size={40} className="text-scout-border mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-scout-dark mb-2">No results for &quot;{query}&quot;</h3>
        <p className="text-scout-muted">Try a different search or browse by category.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <p className="text-sm text-scout-muted shrink-0">
          {data.length} of {rawData.length} results
        </p>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <ArrowUpDown size={13} className="text-scout-muted" />
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                sortBy === opt.value
                  ? 'bg-scout-dark text-white border-scout-dark'
                  : 'bg-white text-scout-muted border-scout-border hover:border-scout-dark hover:text-scout-dark'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-scout-border rounded-2xl">
          <p className="text-scout-muted text-sm">No results match the current filters.</p>
          <button
            onClick={() => setFilters({ categories: [], minPricePence: 0, maxPricePence: 500000 })}
            className="mt-2 text-sm text-scout-dark underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {data.map(product => (
            <motion.div key={product.id} variants={staggerItem}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
