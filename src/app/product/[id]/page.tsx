'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Heart, ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/types';
import { useSession, signIn } from 'next-auth/react';
import { useLocationStore } from '@/store/location-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { ProductGallery } from '@/components/products/ProductGallery';
import { PriceComparisonTable } from '@/components/products/PriceComparisonTable';
import { ProductAISummary } from '@/components/products/ProductAISummary';
import { SimilarProducts } from '@/components/products/SimilarProducts';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { discountPercent, cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import { queryKeys } from '@/lib/query-keys';

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const { lat, lng } = useLocationStore();
  const { isProductSaved, addProduct, removeProduct } = useWishlistStore();
  const { data: session } = useSession();
  const { formatPrice } = useCurrency();
  const [specsOpen, setSpecsOpen] = useState(false);
  const [aiDetails, setAiDetails] = useState<{ description: string; specs: Record<string, string> } | null>(null);

  const { country } = useLocationStore();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: queryKeys.product(id, lat, lng),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (lat) params.set('lat', String(lat));
      if (lng) params.set('lng', String(lng));
      if (country) params.set('country', country.toLowerCase());
      const res = await fetch(`/api/products/${id}?${params}`);
      if (!res.ok) throw new Error('Not found');
      const json = await res.json();
      if (!json.data) throw new Error('Not found');
      return json.data;
    },
  });

  useEffect(() => {
    if (!product) return;
    // Skip AI call if SerpAPI knowledge_graph already gave us real specs
    const hasRealSpecs = product.specs && Object.keys(product.specs).length > 0;
    const hasRealDescription = product.description && !product.description.startsWith('Compare prices across');
    if (hasRealSpecs && hasRealDescription) return;

    let cancelled = false;
    fetch('/api/ai/product-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.name,
        category: product.category,
        lowestPricePence: product.lowestPricePence,
        storeCount: product.storePrices.length,
      }),
    })
      .then(r => r.json())
      .then(json => { if (!cancelled && json.data) setAiDetails(json.data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [product?.id]);

  if (isLoading) return <ProductPageSkeleton />;
  if (error || !product) return notFound();

  const description = aiDetails?.description || product.description;
  const specs = aiDetails?.specs && Object.keys(aiDetails.specs).length > 0 ? aiDetails.specs : product.specs;

  const savings = product.rrpPence > product.lowestPricePence
    ? discountPercent(product.rrpPence, product.lowestPricePence)
    : 0;
  const saved = session ? isProductSaved(product.id) : false;

  // Find the cheapest store that has a real external URL
  const bestBuy = product.storePrices.find(sp => sp.url && sp.url !== '#') ?? product.storePrices[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-scout-muted mb-6">
        <Link href="/" className="hover:text-scout-dark transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Home
        </Link>
        <span>/</span>
        <Link href={`/search?q=${product.category}`} className="hover:text-scout-dark transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-scout-dark truncate">{product.name}</span>
      </nav>

      {/* Main product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="category">{product.category}</Badge>
              {product.trending && <Badge variant="trending">Trending</Badge>}
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif text-scout-dark mb-3 leading-tight">{product.name}</h1>
            <p className="text-scout-muted text-sm leading-relaxed mb-4">{description}</p>
            <StarRating rating={product.rating} showValue reviewCount={product.reviewCount} />
          </div>

          {/* Price */}
          <div className="border-t border-scout-border pt-6">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-serif text-scout-dark">{formatPrice(product.lowestPricePence)}</span>
              {savings >= 5 && (
                <>
                  <span className="text-lg text-scout-muted line-through">{formatPrice(product.rrpPence)}</span>
                  <Badge variant="price-drop">−{savings}%</Badge>
                </>
              )}
            </div>
            <p className="text-sm text-scout-muted">Lowest from {product.storePrices.length} retailers</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={bestBuy?.url || '#'}
              target={bestBuy?.url && bestBuy.url !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="primary" size="lg" className="w-full">
                Buy from {bestBuy?.storeName ?? 'retailer'} · {formatPrice(product.lowestPricePence)}
              </Button>
            </a>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => { if (!session) { signIn('google'); return; } if (saved) { removeProduct(product.id); } else { addProduct(product); } }}
              className={cn(saved && 'border-scout-red text-scout-red')}
            >
              <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
            </Button>
          </div>

          {/* AI Summary */}
          <ProductAISummary product={product} />

          {/* Specs */}
          {specs && Object.keys(specs).length > 0 && (
            <div className="border border-scout-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setSpecsOpen(!specsOpen)}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-scout-dark hover:bg-scout-bg transition-colors"
              >
                Specifications
                <ChevronDown size={16} className={cn('transition-transform', specsOpen && 'rotate-180')} />
              </button>
              {specsOpen && (
                <div className="border-t border-scout-border divide-y divide-scout-border">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="flex px-5 py-3 text-sm">
                      <span className="w-40 text-scout-muted shrink-0">{key}</span>
                      <span className="text-scout-dark">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Price Comparison Table */}
      <div className="mb-12">
        <PriceComparisonTable prices={product.storePrices} />
      </div>

      {/* Related */}
      <div>
        <h2 className="text-xl font-bold text-scout-dark mb-6">You may also like</h2>
        <SimilarProducts product={product} limit={4} />
      </div>
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-48 mt-4" />
          <Skeleton className="h-12 w-full mt-2" />
        </div>
      </div>
    </div>
  );
}
