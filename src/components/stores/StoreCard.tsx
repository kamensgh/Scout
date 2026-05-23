'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Truck, BadgeCheck, ArrowRight } from 'lucide-react';
import type { Store } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { formatDistance } from '@/lib/utils';

interface StoreCardProps {
  store: Store & { distanceKm?: number; openNow?: boolean };
  className?: string;
}

export function StoreCard({ store, className }: StoreCardProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <Link
      href={`/store/${store.id}`}
      className={`group bg-white border border-scout-border rounded-2xl p-4 hover:border-scout-dark hover:shadow-sm transition-all block ${className || ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-scout-border overflow-hidden flex items-center justify-center shrink-0">
            {store.logo && !logoError ? (
              <Image
                src={store.logo}
                alt={store.name}
                width={40}
                height={40}
                className="object-contain p-1"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-sm font-bold text-scout-muted">{store.abbreviation}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-scout-dark group-hover:underline">{store.name}</h3>
              {store.verified && <BadgeCheck size={13} className="text-scout-blue shrink-0" />}
            </div>
            <StarRating rating={store.rating} size={12} showValue />
          </div>
        </div>
        {store.distanceKm !== undefined && (
          <Badge variant="default">{formatDistance(store.distanceKm)}</Badge>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-scout-muted">
        {store.address && (
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{store.address}</span>
          </div>
        )}
        {store.deliveryDays !== undefined && (
          <div className="flex items-center gap-1.5">
            <Truck size={12} className="shrink-0" />
            <span>
              {store.deliveryDays === 0 ? 'Same-day delivery' : store.deliveryDays === 1 ? 'Next-day delivery' : `${store.deliveryDays}-day delivery`}
              {store.deliveryFee === 0 ? ' · Free' : ''}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="shrink-0" />
            <span>
              {store.type === 'online' ? 'Online retailer' : store.type === 'physical' ? 'Physical store' : 'In-store & online'}
              {(store as Store & { openNow?: boolean }).openNow !== undefined && (
                <span className={`ml-1.5 font-medium ${(store as Store & { openNow?: boolean }).openNow ? 'text-scout-green' : 'text-scout-red'}`}>
                  · {(store as Store & { openNow?: boolean }).openNow ? 'Open' : 'Closed'}
                </span>
              )}
            </span>
          </div>
          <ArrowRight size={12} className="text-scout-muted group-hover:text-scout-dark transition-colors" />
        </div>
      </div>
    </Link>
  );
}
