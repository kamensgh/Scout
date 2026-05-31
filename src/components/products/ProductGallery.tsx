'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const validImages = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const thumbsRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  const activeImage = validImages[active];
  const hasImage = activeImage && !errors.has(active);
  const total = validImages.length;

  const goTo = useCallback((idx: number) => {
    if (total === 0) return;
    setActive(((idx % total) + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Keep active thumbnail in view
  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-scout-bg rounded-2xl overflow-hidden group">
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

        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-card flex items-center justify-center text-scout-dark hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-card flex items-center justify-center text-scout-dark hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
              {active + 1} / {total}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div
          ref={thumbsRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {validImages.map((img, i) => (
            <button
              key={i}
              ref={i === active ? activeThumbRef : undefined}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                'relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-scout-bg',
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
