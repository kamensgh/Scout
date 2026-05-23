'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

interface ProductAISummaryProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductAISummary({ product, relatedProducts = [] }: ProductAISummaryProps) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const products = [product, ...relatedProducts.slice(0, 2)];

    fetch('/api/ai/parse-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `Compare and summarize: ${products.map(p => p.name + ' £' + (p.lowestPricePence / 100).toFixed(2)).join(', ')}` }),
    })
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setSummary(data?.data?.query || `The ${product.name} is available from ${product.storePrices.length} retailers, with prices ranging from ${(product.lowestPricePence / 100).toFixed(2)} to ${(product.highestPricePence / 100).toFixed(2)}. Rated ${product.rating}/5 from ${product.reviewCount.toLocaleString()} reviews.`);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSummary(`Available from ${product.storePrices.length} retailers. Lowest price £${(product.lowestPricePence / 100).toFixed(2)}. Rated ${product.rating}/5.`);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [product, relatedProducts]);

  return (
    <div className="bg-scout-bg border border-scout-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-scout-dark rounded-md flex items-center justify-center">
          <Sparkles size={13} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-scout-dark">Scout AI</span>
        {loading && <Loader2 size={13} className="text-scout-muted animate-spin" />}
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <p className="text-sm text-scout-dark leading-relaxed">{summary}</p>
      )}
    </div>
  );
}
