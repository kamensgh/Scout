'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Truck, ArrowRight } from 'lucide-react';
import type { Store } from '@/types';

interface OnlineRetailerCardProps {
  store: Store & { deliveryDays?: number; website?: string; tagline?: string };
  className?: string;
}

export function OnlineRetailerCard({ store, className }: OnlineRetailerCardProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <Link
      href={`/store/${store.id}`}
      className={`group bg-white border border-scout-border rounded-2xl p-5 hover:border-scout-dark hover:shadow-sm transition-all flex flex-col gap-3 ${className || ''}`}
    >
      {/* Logo + verified */}
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-xl bg-scout-bg border border-scout-border overflow-hidden flex items-center justify-center shrink-0">
          {store.logo && !logoError ? (
            <Image
              src={store.logo}
              alt={store.name}
              width={48}
              height={48}
              className="object-contain p-1.5"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-base font-bold text-scout-muted">{store.abbreviation}</span>
          )}
        </div>
        {store.verified && (
          <span className="flex items-center gap-1 text-xs text-scout-blue font-medium">
            <BadgeCheck size={13} /> Verified
          </span>
        )}
      </div>

      {/* Name + tagline */}
      <div>
        <h3 className="text-sm font-bold text-scout-dark group-hover:underline mb-0.5">{store.name}</h3>
        {(store as typeof store & { tagline?: string }).tagline && (
          <p className="text-xs text-scout-muted leading-snug">
            {(store as typeof store & { tagline?: string }).tagline}
          </p>
        )}
      </div>

      {/* Delivery info */}
      <div className="mt-auto flex items-center justify-between pt-2 border-t border-scout-border">
        <div className="flex items-center gap-1.5 text-xs text-scout-muted">
          <Truck size={12} />
          <span>
            {store.deliveryDays === 0
              ? 'Same-day'
              : store.deliveryDays === 1
              ? 'Next-day delivery'
              : store.deliveryDays
              ? `${store.deliveryDays}-day delivery`
              : 'Online delivery'}
          </span>
        </div>
        <span className="text-xs text-scout-dark font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          Browse <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
