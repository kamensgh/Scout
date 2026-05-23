'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const validImages = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());

  const activeImage = validImages[active];
  const hasImage = activeImage && !errors.has(active);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-scout-bg rounded-2xl overflow-hidden">
        {hasImage ? (
          <Image
            src={activeImage}
            alt={`${productName} - image ${active + 1}`}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onError={() => setErrors(prev => new Set(prev).add(active))}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={56} className="text-scout-muted/30" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-scout-bg',
                active === i ? 'border-scout-dark' : 'border-scout-border hover:border-scout-muted'
              )}
            >
              {!errors.has(i) ? (
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                  onError={() => setErrors(prev => new Set(prev).add(i))}
                />
              ) : (
                <Package size={20} className="absolute inset-0 m-auto text-scout-muted/30" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
