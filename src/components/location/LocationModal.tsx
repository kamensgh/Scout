'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, Loader2, AlertCircle } from 'lucide-react';
import { useLocationStore } from '@/store/location-store';
import { Button } from '@/components/ui/Button';

const SUGGESTIONS = [
  'London, UK', 'Manchester, UK', 'Birmingham, UK', 'Edinburgh, UK',
  'New York, US', 'Los Angeles, US', 'Chicago, US',
  'Accra, Ghana', 'Lagos, Nigeria', 'Nairobi, Kenya',
  'Sydney, Australia', 'Toronto, Canada',
];

export function LocationModal() {
  const { status, error, setFromText, setFromGPS } = useLocationStore();
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (input.length < 2) { setSuggestions([]); return; }
    const filtered = SUGGESTIONS.filter(s => s.toLowerCase().includes(input.toLowerCase()));
    setSuggestions(filtered.slice(0, 5));
  }, [input]);

  const handleSubmit = useCallback(async (value?: string) => {
    const text = (value || input).trim();
    if (!text) return;
    setShowSuggestions(false);
    await setFromText(text);
  }, [input, setFromText]);

  const handleGPS = useCallback(async () => {
    await setFromGPS();
  }, [setFromGPS]);

  const isLoading = status === 'detecting';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scout-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-lg mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-scout-dark rounded-lg flex items-center justify-center">
              <Search size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-scout-dark">Scout</span>
          </div>
          <h1 className="text-3xl font-bold text-scout-dark mb-2">
            Find the best prices<br />near you
          </h1>
          <p className="text-scout-muted">
            Scout checks 12 UK retailers for live prices, stock, and delivery.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <div className="relative">
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-scout-muted" />
            <input
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Enter postcode, city, or area..."
              className="w-full pl-11 pr-4 py-4 bg-white border border-scout-border rounded-2xl text-scout-dark placeholder:text-scout-muted focus:outline-none focus:ring-2 focus:ring-scout-dark/20 focus:border-scout-dark transition-all text-base"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Autocomplete dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-scout-border rounded-xl shadow-card-hover z-10 overflow-hidden"
              >
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-scout-bg transition-colors text-sm"
                    onMouseDown={e => { e.preventDefault(); setInput(s); handleSubmit(s); }}
                  >
                    <MapPin size={14} className="text-scout-muted shrink-0" />
                    <span className="text-scout-dark">{s}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => handleSubmit()}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {isLoading ? 'Locating…' : 'Find prices near me'}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleGPS}
            disabled={isLoading}
            title="Use my location"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
          </Button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {status === 'error' && error && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-2 text-scout-red text-sm bg-scout-red/5 px-4 py-3 rounded-xl"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint text */}
        <p className="text-center text-xs text-scout-muted mt-6">
          Works worldwide — UK postcodes, city names, or full addresses
        </p>
      </motion.div>
    </div>
  );
}
