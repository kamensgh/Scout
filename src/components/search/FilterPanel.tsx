'use client';

import { SlidersHorizontal, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSearchStore } from '@/store/search-store';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocationStore } from '@/store/location-store';
import { queryKeys } from '@/lib/query-keys';
import { cn } from '@/lib/utils';
import type { Product, ProductCategory } from '@/types';

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'audio', label: 'Audio' },
  { id: 'computing', label: 'Computing' },
  { id: 'tvs', label: 'TVs' },
  { id: 'home', label: 'Home' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'diy', label: 'DIY' },
  { id: 'sports', label: 'Sports' },
];

const RATING_TIERS = [4, 3, 2] as const;

interface FilterPanelProps {
  query?: string;
}

export function FilterPanel({ query = '' }: FilterPanelProps) {
  const { filters, setFilters } = useSearchStore();
  const { formatPrice } = useCurrency();
  const { lat, lng } = useLocationStore();

  // Reuses the SearchResults query cache entry — no extra network request.
  const { data: rawData } = useQuery({
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

  const brands = Array.from(new Set((rawData ?? []).map(p => p.brand).filter(Boolean))).sort();

  const toggleCategory = (cat: ProductCategory) => {
    const cats = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    setFilters({ categories: cats });
  };

  const toggleBrand = (brand: string) => {
    const list = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    setFilters({ brands: list });
  };

  const priceValue: [number, number] = [
    filters.minPricePence ?? 0,
    filters.maxPricePence ?? 500000,
  ];

  return (
    <div className="bg-white border border-scout-border rounded-2xl p-5 space-y-6">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-scout-muted" />
        <h2 className="text-sm font-semibold text-scout-dark">Filters</h2>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-scout-muted mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => toggleCategory(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                filters.categories.includes(id)
                  ? 'bg-scout-dark text-white border-scout-dark'
                  : 'bg-white text-scout-muted border-scout-border hover:border-scout-dark hover:text-scout-dark'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-scout-muted mb-3">Price range</h3>
        <RangeSlider
          min={0}
          max={500000}
          step={1000}
          value={priceValue}
          onChange={([min, max]) => setFilters({ minPricePence: min, maxPricePence: max })}
          formatValue={formatPrice}
        />
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-scout-muted mb-3">Brand</h3>
          <div className="flex flex-wrap gap-2">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  filters.brands.includes(brand)
                    ? 'bg-scout-dark text-white border-scout-dark'
                    : 'bg-white text-scout-muted border-scout-border hover:border-scout-dark hover:text-scout-dark'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-scout-muted mb-3">Rating</h3>
        <div className="space-y-1.5">
          {RATING_TIERS.map(tier => (
            <button
              key={tier}
              onClick={() => setFilters({ minRating: filters.minRating === tier ? undefined : tier })}
              className={cn(
                'flex items-center gap-1.5 w-full px-2 py-1 rounded-lg text-sm transition-colors',
                filters.minRating === tier ? 'bg-scout-bg text-scout-dark font-medium' : 'text-scout-muted hover:text-scout-dark'
              )}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className={i < tier ? 'fill-scout-accent text-scout-accent' : 'text-scout-border'} />
              ))}
              <span>&amp; up</span>
            </button>
          ))}
          <button
            onClick={() => setFilters({ minRating: undefined })}
            className={cn(
              'text-sm px-2 py-1 rounded-lg transition-colors',
              filters.minRating == null ? 'text-scout-dark font-medium' : 'text-scout-muted hover:text-scout-dark'
            )}
          >
            Any rating
          </button>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        {[
          { key: 'inStockOnly' as const, label: 'In stock only' },
          { key: 'freeDelivery' as const, label: 'Free delivery' },
          { key: 'nearMe' as const, label: 'Near me' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-scout-dark">{label}</span>
            <div
              className={`w-10 h-5 rounded-full transition-colors relative ${filters[key] ? 'bg-scout-dark' : 'bg-scout-border'}`}
              onClick={() => setFilters({ [key]: !filters[key] })}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${filters[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
