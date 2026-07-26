'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Camera, Sparkles, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  'wireless headphones under £200',
  'MacBook Air M3',
  'espresso machine for beginners',
  'IKEA desk lamp',
  '65 inch Samsung TV',
  'Dyson vacuum',
  'gaming chair under £300',
];

interface SearchBarProps {
  className?: string;
  size?: 'default' | 'hero';
  placeholder?: string;
  defaultValue?: string;
}

export function SearchBar({ className, size = 'default', placeholder, defaultValue = '' }: SearchBarProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [suggestions] = useState(SUGGESTIONS);

  const handleSubmit = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setFocused(false);
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    });
  }, [router]);

  const isHero = size === 'hero';

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'flex items-stretch bg-white border divide-x transition-all',
        'border-scout-border divide-scout-border',
        isHero ? 'shadow-card-hover' : '',
        focused && 'ring-2 ring-scout-dark/10 border-scout-dark/30'
      )}>
        <div className={cn('flex-1 flex items-center gap-2 min-w-0', isHero ? 'px-4 py-3' : 'px-3 py-2')}>
          <Search size={isHero ? 20 : 16} className="text-scout-muted shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit(query)}
            placeholder={placeholder || 'Search products, brands, categories…'}
            className={cn(
              'flex-1 min-w-0 bg-transparent outline-none text-scout-dark placeholder:text-scout-muted',
              isHero ? 'text-base' : 'text-sm'
            )}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-scout-muted hover:text-scout-dark transition-colors shrink-0">
              <X size={15} />
            </button>
          )}
        </div>
        <button
          onClick={() => router.push('/image-search')}
          className={cn(
            'flex items-center justify-center text-scout-muted hover:text-scout-dark transition-colors shrink-0',
            isHero ? 'w-14' : 'w-10'
          )}
          title="Visual search"
        >
          <Camera size={isHero ? 20 : 16} />
        </button>
        <button
          onClick={() => handleSubmit(query)}
          className={cn(
            'flex items-center gap-1.5 font-medium transition-colors shrink-0',
            isHero ? 'bg-scout-dark text-white px-5 py-2.5 text-sm hover:bg-scout-dark/90' : 'bg-scout-dark text-white px-3 py-1.5 text-xs hover:bg-scout-dark/90'
          )}
        >
          Search
          {isHero && <ArrowRight size={16} />}
        </button>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {focused && !query && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-scout-border rounded-2xl shadow-card-hover z-20 overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-scout-border">
              <span className="text-xs font-semibold uppercase tracking-widest text-scout-muted">Try searching for</span>
            </div>
            {suggestions.map(s => (
              <button
                key={s}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-scout-bg transition-colors text-sm"
                onMouseDown={() => { setQuery(s); handleSubmit(s); }}
              >
                <Sparkles size={14} className="text-scout-muted shrink-0" />
                <span className="text-scout-dark">{s}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
