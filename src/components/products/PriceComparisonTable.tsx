'use client';

'use client';

import { useState } from 'react';
import { ExternalLink, MapPin, Truck, ArrowUpDown } from 'lucide-react';
import type { StorePrice } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn, formatPrice, formatDistance } from '@/lib/utils';

interface EnrichedStorePrice extends StorePrice {
  distanceKm?: number;
  distanceMiles?: number;
}

interface PriceComparisonTableProps {
  prices: EnrichedStorePrice[];
  className?: string;
}

type SortKey = 'price' | 'distance';

export function PriceComparisonTable({ prices, className }: PriceComparisonTableProps) {
  const [sort, setSort] = useState<SortKey>('price');

  const sorted = [...prices].sort((a, b) => {
    if (sort === 'price') return a.pricePence - b.pricePence;
    const aDist = a.distanceKm ?? Infinity;
    const bDist = b.distanceKm ?? Infinity;
    return aDist - bDist;
  });

  const cheapest = sorted[0]?.pricePence;

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
                sort === key ? 'bg-scout-dark text-white' : 'bg-scout-bg text-scout-muted hover:text-scout-dark border border-scout-border'
              )}
            >
              <ArrowUpDown size={11} />
              {key === 'price' ? 'By price' : 'By distance'}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-scout-border rounded-2xl overflow-hidden">
        {sorted.map((price, i) => (
          <div
            key={price.storeId}
            className={cn(
              'flex items-center gap-4 px-5 py-4 transition-colors hover:bg-scout-bg/50',
              i !== sorted.length - 1 && 'border-b border-scout-border'
            )}
          >
            {/* Store */}
            <div className="flex items-center gap-3 w-36 shrink-0">
              <span className="w-9 h-9 rounded-lg bg-scout-bg border border-scout-border text-xs font-bold text-scout-muted flex items-center justify-center">
                {price.storeAbbreviation}
              </span>
              <div>
                <p className="text-sm font-medium text-scout-dark">{price.storeName}</p>
                <p className="text-xs text-scout-muted">
                  {price.storeType === 'online' ? 'Online only' : 'In store & online'}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={cn('text-base font-bold', price.pricePence === cheapest ? 'text-scout-green' : 'text-scout-dark')}>
                  {formatPrice(price.pricePence)}
                </span>
                {price.pricePence === cheapest && <Badge variant="price-drop">Best price</Badge>}
              </div>
            </div>

            {/* Stock & delivery */}
            <div className="hidden sm:flex flex-col gap-0.5 text-xs text-scout-muted w-40">
              {price.inStock ? (
                <Badge variant="in-stock" className="self-start">In stock</Badge>
              ) : (
                <Badge variant="out-of-stock" className="self-start">Out of stock</Badge>
              )}
              {price.distanceKm !== undefined && price.storeType !== 'online' ? (
                <span className="flex items-center gap-1 mt-1">
                  <MapPin size={11} />
                  {formatDistance(price.distanceKm)} away
                </span>
              ) : price.deliveryDays !== undefined ? (
                <span className="flex items-center gap-1 mt-1">
                  <Truck size={11} />
                  {price.deliveryDays === 0 ? 'Same day' : price.deliveryDays === 1 ? 'Next day' : `${price.deliveryDays} days`}
                  {price.deliveryFeePence === 0 ? ' · Free' : price.deliveryFeePence ? ` · ${formatPrice(price.deliveryFeePence)}` : ''}
                </span>
              ) : null}
            </div>

            {/* CTA */}
            {price.url && price.url !== '#' ? (
              <a
                href={price.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0',
                  price.inStock
                    ? 'bg-scout-dark text-white hover:bg-scout-dark/90'
                    : 'bg-scout-bg text-scout-muted border border-scout-border'
                )}
              >
                Buy
                <ExternalLink size={13} />
              </a>
            ) : (
              <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-scout-bg text-scout-muted border border-scout-border shrink-0">
                No link
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
