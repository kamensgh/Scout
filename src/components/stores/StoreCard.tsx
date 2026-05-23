'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Clock, Truck, BadgeCheck } from 'lucide-react';
import type { Store } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { formatDistance } from '@/lib/utils';

interface StoreCardProps {
  store: Store & { distanceKm?: number };
  className?: string;
}

export function StoreCard({ store, className }: StoreCardProps) {
  const [logoError, setLogoError] = useState(false);
  return (
    <div className={`bg-white border border-scout-border rounded-2xl p-4 ${className || ''}`}>
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
              <h3 className="text-sm font-semibold text-scout-dark">{store.name}</h3>
              {store.verified && <BadgeCheck size={14} className="text-scout-blue" />}
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
            <MapPin size={12} />
            <span>{store.address}</span>
          </div>
        )}
        {store.deliveryDays !== undefined && (
          <div className="flex items-center gap-1.5">
            <Truck size={12} />
            <span>
              {store.deliveryDays === 0 ? 'Same-day delivery' : store.deliveryDays === 1 ? 'Next-day delivery' : `${store.deliveryDays}-day delivery`}
              {store.deliveryFee === 0 ? ' · Free' : ''}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          <span>{store.type === 'online' ? 'Online only' : store.type === 'physical' ? 'In-store only' : 'In-store & online'}</span>
        </div>
      </div>
    </div>
  );
}
