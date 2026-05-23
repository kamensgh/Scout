'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart2, ArrowLeft, X } from 'lucide-react';
import { useComparisonStore } from '@/store/comparison-store';
import { useLocationStore } from '@/store/location-store';
import { ProductAISummary } from '@/components/products/ProductAISummary';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import type { Product } from '@/types';
import Image from 'next/image';

export default function ComparePage() {
  const [mounted, setMounted] = useState(false);
  const { comparedIds, removeProduct, clear } = useComparisonStore();
  const { lat, lng } = useLocationStore();
  const { formatPrice } = useCurrency();

  useEffect(() => { setMounted(true); }, []);

  // Fetch products manually since useQueries may not be available
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mounted || comparedIds.length === 0) return;
    setLoading(true);
    Promise.all(
      comparedIds.map(async id => {
        const params = new URLSearchParams();
        if (lat) params.set('lat', String(lat));
        if (lng) params.set('lng', String(lng));
        const res = await fetch(`/api/products/${id}?${params}`);
        const json = await res.json();
        return json.data as Product;
      })
    ).then(setProducts).finally(() => setLoading(false));
  }, [mounted, comparedIds, lat, lng]);

  if (!mounted) return null;

  if (comparedIds.length < 2) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <BarChart2 size={48} className="text-scout-border mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-scout-dark mb-2">Nothing to compare yet</h1>
        <p className="text-scout-muted mb-6">Add at least 2 products using the compare button on any product card.</p>
        <Link href="/">
          <Button variant="primary">Browse products</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${comparedIds.length}, 1fr)` }}>
          {Array.from({ length: comparedIds.length + 1 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const specs = Array.from(new Set(products.flatMap(p => Object.keys(p.specs || {}))));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm"><ArrowLeft size={14} /> Back</Button>
          </Link>
          <h1 className="text-xl font-bold text-scout-dark">Compare products</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={clear}>Clear all</Button>
      </div>

      {/* AI summary */}
      {products.length >= 2 && (
        <div className="mb-8">
          <ProductAISummary product={products[0]} relatedProducts={products.slice(1)} />
        </div>
      )}

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header: product cards */}
          <thead>
            <tr>
              <th className="w-44 p-3 text-left text-xs font-semibold uppercase tracking-widest text-scout-muted">Product</th>
              {products.map(p => (
                <th key={p.id} className="p-3 min-w-48">
                  <div className="bg-white border border-scout-border rounded-2xl p-4 text-left">
                    <div className="flex justify-end mb-2">
                      <button onClick={() => removeProduct(p.id)} className="text-scout-muted hover:text-scout-red transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="relative aspect-square bg-scout-bg rounded-xl overflow-hidden mb-3">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="200px" />
                    </div>
                    <p className="text-xs text-scout-muted mb-1">{p.brand}</p>
                    <p className="text-sm font-semibold text-scout-dark mb-2 line-clamp-2">{p.name}</p>
                    <p className="text-lg font-bold text-scout-dark">{formatPrice(p.lowestPricePence)}</p>
                    <StarRating rating={p.rating} size={12} showValue className="mt-1" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price row */}
            <tr className="border-t border-scout-border">
              <td className="p-4 text-sm font-medium text-scout-muted">Best price</td>
              {products.map(p => {
                const lowest = Math.min(...products.map(x => x.lowestPricePence));
                return (
                  <td key={p.id} className="p-4 text-center">
                    <span className={cn('text-base font-bold', p.lowestPricePence === lowest ? 'text-scout-green' : 'text-scout-dark')}>
                      {formatPrice(p.lowestPricePence)}
                    </span>
                    {p.lowestPricePence === lowest && <Badge variant="price-drop" className="ml-2">Best</Badge>}
                  </td>
                );
              })}
            </tr>
            {/* Rating row */}
            <tr className="border-t border-scout-border bg-scout-bg/30">
              <td className="p-4 text-sm font-medium text-scout-muted">Rating</td>
              {products.map(p => {
                const highest = Math.max(...products.map(x => x.rating));
                return (
                  <td key={p.id} className="p-4 text-center">
                    <span className={cn('text-sm font-bold', p.rating === highest ? 'text-scout-green' : 'text-scout-dark')}>
                      {p.rating.toFixed(1)} / 5
                    </span>
                  </td>
                );
              })}
            </tr>
            {/* Stores row */}
            <tr className="border-t border-scout-border">
              <td className="p-4 text-sm font-medium text-scout-muted">Retailers</td>
              {products.map(p => (
                <td key={p.id} className="p-4 text-center">
                  <span className="text-sm text-scout-dark">{p.storePrices.length}</span>
                </td>
              ))}
            </tr>
            {/* Spec rows */}
            {specs.map((spec, i) => (
              <tr key={spec} className={cn('border-t border-scout-border', i % 2 === 0 && 'bg-scout-bg/30')}>
                <td className="p-4 text-sm font-medium text-scout-muted">{spec}</td>
                {products.map(p => (
                  <td key={p.id} className="p-4 text-center text-sm text-scout-dark">
                    {p.specs?.[spec] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
