'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, MapPin, Package } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import type { StorePrice } from '@/types';
import type { Product } from '@/types';
import { useWishlistStore } from '@/store/wishlist-store';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { cn, discountPercent, formatDistance } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';

function StoreAvatar({ sp }: { sp: StorePrice }) {
  const [err, setErr] = useState(false);
  if (sp.storeLogo && !err) {
    return (
      <span className="w-7 h-7 rounded-md bg-white border border-scout-border flex items-center justify-center overflow-hidden" title={sp.storeName}>
        <Image src={sp.storeLogo} alt={sp.storeName} width={20} height={20} className="object-contain" onError={() => setErr(true)} />
      </span>
    );
  }
  return (
    <span className="w-7 h-7 rounded-md bg-scout-bg border border-scout-border text-xs font-bold text-scout-muted flex items-center justify-center" title={sp.storeName}>
      {sp.storeAbbreviation}
    </span>
  );
}

interface ProductCardProps {
  product: Product;
  className?: string;
  showDistance?: boolean;
}

export function ProductCard({ product, className, showDistance = true }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { isProductSaved, addProduct, removeProduct } = useWishlistStore();
  const { formatPrice } = useCurrency();
  const { data: session } = useSession();

  const saved = session ? isProductSaved(product.id) : false;

  const savings = product.rrpPence > product.lowestPricePence
    ? discountPercent(product.rrpPence, product.lowestPricePence)
    : 0;

  const topStores = product.storePrices.slice(0, 3);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn('group relative bg-white border border-scout-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow', className)}
    >
      {/* Image area */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-scout-bg overflow-hidden">
          {product.imageUrl && !imageError ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className={product.id.startsWith('serp-')
                ? 'object-contain p-3 group-hover:scale-105 transition-transform duration-300'
                : 'object-cover group-hover:scale-105 transition-transform duration-300'}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={40} className="text-scout-muted/30" />
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {savings >= 5 && (
              <Badge variant="price-drop">−{savings}%</Badge>
            )}
            {product.trending && (
              <Badge variant="trending">Trending</Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist toggle — always visible; touch devices have no hover state */}
      <div className="absolute top-3 right-3">
        <button
          onClick={e => {
            e.preventDefault();
            if (!session) { signIn('google'); return; }
            if (saved) { removeProduct(product.id); } else { addProduct(product); }
          }}
          className={cn(
            'w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition-colors',
            saved ? 'text-scout-red' : 'text-scout-muted hover:text-scout-red'
          )}
          aria-label={saved ? 'Remove from saved' : 'Save'}
        >
          <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product info */}
      <Link href={`/product/${product.id}`} className="block p-4">
        <p className="text-xs text-scout-muted mb-1 uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-medium text-scout-dark leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>

        <StarRating rating={product.rating} size={12} showValue reviewCount={product.reviewCount} className="mb-3" />

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-bold text-scout-dark">{formatPrice(product.lowestPricePence)}</span>
          {savings >= 5 && (
            <span className="text-xs text-scout-muted line-through">{formatPrice(product.rrpPence)}</span>
          )}
        </div>

        {/* Nearest store */}
        {showDistance && product.nearestStoreName && product.nearestStoreDistance !== undefined && (
          <div className="flex items-center gap-1 text-xs text-scout-muted mb-3">
            <MapPin size={11} />
            <span>{product.nearestStoreName} · {formatDistance(product.nearestStoreDistance)}</span>
          </div>
        )}

        {/* Store avatars */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {topStores.map(sp => (
              <StoreAvatar key={sp.storeId} sp={sp} />
            ))}
            {product.storePrices.length > 3 && (
              <span className="w-7 h-7 rounded-md bg-scout-bg border border-scout-border text-xs text-scout-muted flex items-center justify-center">
                +{product.storePrices.length - 3}
              </span>
            )}
          </div>
          <span className="text-xs text-scout-muted">{product.storePrices.length} store{product.storePrices.length !== 1 ? 's' : ''}</span>
        </div>
      </Link>
    </motion.div>
  );
}
