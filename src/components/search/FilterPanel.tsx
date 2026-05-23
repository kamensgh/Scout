'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useSearchStore } from '@/store/search-store';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { formatPrice } from '@/lib/utils';
import type { ProductCategory } from '@/types';

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

export function FilterPanel() {
  const { filters, setFilters } = useSearchStore();

  const toggleCategory = (cat: ProductCategory) => {
    const cats = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    setFilters({ categories: cats });
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
