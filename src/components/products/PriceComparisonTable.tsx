'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, ChevronDown, MapPin, ArrowUpDown } from 'lucide-react';
import type { StorePrice } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDistance } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';

interface EnrichedStorePrice extends StorePrice {
  distanceKm?: number;
}

interface PriceComparisonTableProps {
  prices: EnrichedStorePrice[];
  className?: string;
}

type SortKey = 'price' | 'distance';
const INITIAL_VISIBLE = 4;

function StoreLogo({ logo, name, abbr }: { logo: string; name: string; abbr: string }) {
  const [err, setErr] = useState(false);
  if (logo && !err) {
    return (
      <Image
        src={logo}
        alt={name}
        width={36}
        height={36}
        className="object-contain p-0.5 rounded"
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <span className="text-xs font-bold text-scout-muted">
      {abbr.slice(0, 2)}
    </span>
  );
}

export function PriceComparisonTable({ prices, className }: PriceComparisonTableProps) {
  const [sort, setSort] = useState<SortKey>('price');
  const [expanded, setExpanded] = useState(false);
  const { formatPrice } = useCurrency();

  const sorted = [...prices].sort((a, b) => {
    if (sort === 'price') return a.pricePence - b.pricePence;
    const aDist = a.distanceKm ?? Infinity;
    const bDist = b.distanceKm ?? Infinity;
    return aDist - bDist;
  });

  const cheapest = sorted[0]?.pricePence;
  const visible = expanded ? sorted : sorted.slice(0, INITIAL_VISIBLE);
  const hasMore = sorted.length > INITIAL_VISIBLE;

  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-scout-dark">Price comparison</h2>
        <div className="flex gap-2">
          {(['price', 'distance'] as SortKey[]).map(key => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                sort === key
                  ? 'bg-scout-dark text-white'
                  : 'bg-scout-bg text-scout-muted hover:text-scout-dark border border-scout-border'
              )}
            >
              <ArrowUpDown size={11} />
              {key === 'price' ? 'By price' : 'By distance'}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-scout-border rounded-2xl overflow-hidden">
        {visible.map((price, i) => {
          const isCheapest = price.pricePence === cheapest;
          const disc = price.rrpPence && price.rrpPence > price.pricePence
            ? Math.round(((price.rrpPence - price.pricePence) / price.rrpPence) * 100)
            : 0;
          const isLinked = !!price.url && price.url !== '#';
          const isNearby = price.storeType === 'physical' || price.storeType === 'both';

          const deliveryDisplay = price.shippingText
            || (price.deliveryFeePence === 0
              ? 'Free delivery'
              : price.deliveryFeePence
              ? `Delivery ${formatPrice(price.deliveryFeePence)}`
              : price.deliveryDays !== undefined
              ? (price.deliveryDays === 0 ? 'Same-day delivery' : price.deliveryDays === 1 ? 'Next-day delivery' : `${price.deliveryDays}-day delivery`)
              : null);

          const row = (
            <div className={cn(
              'flex items-start gap-4 px-5 py-4 transition-colors group',
              isLinked && 'hover:bg-scout-bg/50 cursor-pointer',
              i !== visible.length - 1 && 'border-b border-scout-border'
            )}>
              {/* Logo */}
              <div className="w-9 h-9 rounded-lg bg-scout-bg border border-scout-border overflow-hidden flex items-center justify-center shrink-0 mt-0.5">
                <StoreLogo logo={price.storeLogo} name={price.storeName} abbr={price.storeAbbreviation} />
              </div>

              {/* Store info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className={cn(
                    'text-sm font-semibold text-scout-dark',
                    isLinked && 'group-hover:underline'
                  )}>
                    {price.storeName}
                  </p>
                  {price.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-scout-green/10 text-scout-green font-medium rounded">
                      {price.badge}
                    </span>
                  )}
                  {isLinked && (
                    <ExternalLink size={11} className="text-scout-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  )}
                </div>

                {/* Listing name (retailer-specific variant) */}
                {price.listingName && (
                  <p className="text-xs text-scout-muted leading-snug mb-1 truncate">{price.listingName}</p>
                )}

                {/* Stock status */}
                <p className={cn('text-xs font-medium', price.inStock ? 'text-scout-green' : 'text-scout-red')}>
                  {price.inStock
                    ? (isNearby
                      ? price.distanceKm !== undefined
                        ? `In stock online and nearby · ${formatDistance(price.distanceKm)} away`
                        : 'In stock online and nearby'
                      : 'In stock online')
                    : 'Out of stock'}
                </p>

                {/* Delivery */}
                {deliveryDisplay && (
                  <p className="text-xs text-scout-muted mt-0.5">{deliveryDisplay}</p>
                )}
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <p className={cn(
                  'text-base font-bold leading-tight',
                  isCheapest ? 'text-scout-green' : 'text-scout-dark'
                )}>
                  {formatPrice(price.pricePence)}
                </p>
                {disc >= 5 && price.rrpPence && (
                  <p className="text-xs text-scout-muted mt-0.5">
                    {disc}% off <span className="line-through">{formatPrice(price.rrpPence)}</span>
                  </p>
                )}
                {isCheapest && !disc && (
                  <Badge variant="price-drop" className="mt-1">Best price</Badge>
                )}
              </div>
            </div>
          );

          return isLinked ? (
            <a key={price.storeId + i} href={price.url} target="_blank" rel="noopener noreferrer" className="block">
              {row}
            </a>
          ) : (
            <div key={price.storeId + i}>{row}</div>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 py-3.5 flex items-center justify-center gap-2 text-sm font-medium text-scout-dark bg-white border border-scout-border rounded-2xl hover:border-scout-dark transition-colors"
        >
          {expanded ? 'Show fewer shops' : `More shops`}
          <ChevronDown size={15} className={cn('transition-transform duration-200', expanded && 'rotate-180')} />
        </button>
      )}
    </div>
  );
}
