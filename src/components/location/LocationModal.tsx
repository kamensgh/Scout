'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, Loader2, AlertCircle, X } from 'lucide-react';
import { useLocationStore } from '@/store/location-store';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from './LoadingScreen';

interface Suggestion {
  description: string;
  placeId: string;
}

export function LocationModal() {
  const { status, error, rawInput, lat, setFromText, setFromGPS, closePicker } = useLocationStore();
  const [input, setInput] = useState(rawInput || '');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [acLoading, setAcLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([]);
      setAcLoading(false);
      return;
    }

    setAcLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      try {
        const res = await fetch(
          `/api/location/autocomplete?input=${encodeURIComponent(input)}`,
          { signal: abortRef.current.signal }
        );
        const json = await res.json();
        setSuggestions(json.data || []);
      } catch {
        // ignore aborted requests
      } finally {
        setAcLoading(false);
      }
    }, 280);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  const handleSubmit = useCallback(async (value?: string) => {
    const text = (value || input).trim();
    if (!text) return;
    setShowSuggestions(false);
    setSuggestions([]);
    await setFromText(text);
  }, [input, setFromText]);

  const handleSelect = useCallback((suggestion: Suggestion) => {
    setInput(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
    handleSubmit(suggestion.description);
  }, [handleSubmit]);

  const handleGPS = useCallback(async () => {
    await setFromGPS();
  }, [setFromGPS]);

  const hasExistingLocation = lat !== null;

  // Show LoadingScreen while GPS / geocoding is running
  if (status === 'detecting') return <LoadingScreen />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scout-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-lg mx-4 relative"
      >
        {/* Close button — only shown when a location already exists */}
        {hasExistingLocation && (
          <button
            onClick={closePicker}
            className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white border border-scout-border flex items-center justify-center text-scout-muted hover:text-scout-dark hover:border-scout-dark transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}

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
            Scout checks retailers near you for live prices, stock, and delivery.
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
              onKeyDown={e => {
                if (e.key === 'Enter') handleSubmit();
                if (e.key === 'Escape') setShowSuggestions(false);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Enter postcode, city, or address..."
              className="w-full pl-11 pr-10 py-4 bg-white border border-scout-border rounded-2xl text-scout-dark placeholder:text-scout-muted focus:outline-none focus:ring-2 focus:ring-scout-dark/20 focus:border-scout-dark transition-all text-base"
              autoFocus
              autoComplete="off"
            />
            {acLoading && (
              <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-scout-muted animate-spin" />
            )}
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
                    key={s.placeId}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-scout-bg transition-colors text-sm"
                    onMouseDown={e => { e.preventDefault(); handleSelect(s); }}
                  >
                    <MapPin size={14} className="text-scout-muted shrink-0" />
                    <span className="text-scout-dark">{s.description}</span>
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
            disabled={!input.trim()}
          >
            <Search size={16} />
            Find prices near me
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleGPS}
            title="Use my location"
          >
            <Navigation size={16} />
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

        <p className="text-center text-xs text-scout-muted mt-6">
          Works worldwide — UK postcodes, city names, or full addresses
        </p>
      </motion.div>
    </div>
  );
}
