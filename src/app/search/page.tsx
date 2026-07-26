'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { SearchResults } from '@/components/search/SearchResults';
import { PriceLeaderboard } from '@/components/search/PriceLeaderboard';
import { MinimalSearchResults } from '@/components/discovery/MinimalSearchResults';
import { useLocationStore } from '@/store/location-store';
import { useSearchStore } from '@/store/search-store';
import type { ProductCategory } from '@/types';

function SearchPageInner() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const effectiveQuery = q || categoryParam;
  const { dataRegion } = useLocationStore();
  const { setFilters, setSortBy } = useSearchStore();
  const prevQuery = useRef('');

  // Reset filters when query changes; pre-select category filter when browsing by category
  useEffect(() => {
    if (effectiveQuery !== prevQuery.current) {
      prevQuery.current = effectiveQuery;
      setFilters({
        categories: categoryParam && !q ? [categoryParam as ProductCategory] : [],
        minPricePence: 0,
        maxPricePence: 500000,
        inStockOnly: false,
        freeDelivery: false,
        brands: [],
        minRating: undefined,
      });
      setSortBy('relevance');
    }
  }, [effectiveQuery, categoryParam, q]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <SearchBar defaultValue={q} className="max-w-2xl" />
      </div>

      {dataRegion === 'sparse' ? (
        <MinimalSearchResults initialQuery={effectiveQuery} />
      ) : (
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterPanel query={effectiveQuery} />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <PriceLeaderboard query={effectiveQuery} />
            <SearchResults query={effectiveQuery} />
          </main>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-scout-muted">Loading…</div>}>
      <SearchPageInner />
    </Suspense>
  );
}
