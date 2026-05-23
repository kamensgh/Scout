import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({ rating, max = 5, size = 14, showValue = false, reviewCount, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = rating - i;
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="text-scout-border fill-scout-border" />
              {filled > 0 && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: `${Math.min(filled, 1) * 100}%` }}>
                  <Star size={size} className="text-scout-accent fill-scout-accent" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && <span className="text-xs font-semibold text-scout-dark">{rating.toFixed(1)}</span>}
      {reviewCount !== undefined && (
        <span className="text-xs text-scout-muted">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
