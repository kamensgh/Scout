'use client';

import { useCallback } from 'react';
import { cn } from '@/lib/utils';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatValue?: (v: number) => string;
  className?: string;
}

export function RangeSlider({ min, max, value, onChange, step = 1, formatValue, className }: RangeSliderProps) {
  const [low, high] = value;
  const range = max - min;

  const lowPct = ((low - min) / range) * 100;
  const highPct = ((high - min) / range) * 100;

  const handleLow = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Math.min(Number(e.target.value), high - step);
      onChange([v, high]);
    },
    [high, step, onChange]
  );

  const handleHigh = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Math.max(Number(e.target.value), low + step);
      onChange([low, v]);
    },
    [low, step, onChange]
  );

  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1.5 bg-scout-border rounded-full" />
        <div
          className="absolute h-1.5 bg-scout-dark rounded-full"
          style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={low}
          onChange={handleLow}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: low > max - step ? 5 : 3 }}
        />
        <input
          type="range" min={min} max={max} step={step} value={high}
          onChange={handleHigh}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
        <div className="absolute w-4 h-4 bg-white border-2 border-scout-dark rounded-full shadow pointer-events-none" style={{ left: `calc(${lowPct}% - 8px)` }} />
        <div className="absolute w-4 h-4 bg-white border-2 border-scout-dark rounded-full shadow pointer-events-none" style={{ left: `calc(${highPct}% - 8px)` }} />
      </div>
      {formatValue && (
        <div className="flex justify-between mt-2 text-xs text-scout-muted">
          <span>{formatValue(low)}</span>
          <span>{formatValue(high)}</span>
        </div>
      )}
    </div>
  );
}
