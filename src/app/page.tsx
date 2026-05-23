'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Zap, MessageSquare, Search, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocationStore } from '@/store/location-store';
import { SearchBar } from '@/components/search/SearchBar';
import { TrendingGrid } from '@/components/products/TrendingGrid';
import { StoreCard } from '@/components/stores/StoreCard';
import { NearbyStoresGrid } from '@/components/discovery/NearbyStoresGrid';
import { CategorySearchBar } from '@/components/discovery/CategorySearchBar';
import { Button } from '@/components/ui/Button';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { getCategories } from '@/lib/mock-data';
import { useQuery } from '@tanstack/react-query';
import type { Store } from '@/types';

const CATEGORY_IMAGES: Record<string, string> = {
  audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  computing: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
  tvs: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&q=80',
  home: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80',
  kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  diy: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',
  sports: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
};

const STATS = [
  { value: '12', label: 'Retailers', sub: 'across the UK' },
  { value: '3.2M', label: 'Live prices', sub: 'updated hourly' },
  { value: '1,400+', label: 'London stores', sub: 'with stock data' },
  { value: '18%', label: 'Average saving', sub: 'vs first retailer' },
];

const CATEGORY_CHIPS = [
  'wireless headphones under £200',
  'MacBook Air M3',
  'espresso machine for beginners',
];

export default function HomePage() {
  const { lat, lng, displayName, dataRegion } = useLocationStore();
  const [mounted, setMounted] = useState(false);
  const [sparseCategory, setSparseCategory] = useState('electronics');

  useEffect(() => { setMounted(true); }, []);

  const { data: nearbyStores } = useQuery({
    queryKey: ['stores', lat, lng],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (lat) params.set('lat', String(lat));
      if (lng) params.set('lng', String(lng));
      const res = await fetch(`/api/stores?${params}`);
      const json = await res.json();
      return json.data as (Store & { distanceKm?: number })[];
    },
    enabled: !!lat && !!lng,
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative pt-12 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-scout-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-scout-blue/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.p variants={staggerItem} className="section-label">
              Scout · Vol. 04 · {displayName?.split(',').slice(-1)[0]?.trim() || 'London'}
            </motion.p>

            <motion.h1
              variants={staggerItem}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-scout-dark tracking-tight leading-none"
            >
              Search once.<br />Pay less.
            </motion.h1>

            <motion.p variants={staggerItem} className="text-lg text-scout-muted max-w-xl">
              Scout reads live prices, stock and delivery from{' '}
              {dataRegion === 'rich' ? 'twelve UK retailers' : 'local stores near you'} — so you can stop juggling tabs and just buy the right thing.
            </motion.p>

            {/* Search bar */}
            <motion.div variants={staggerItem} className="max-w-2xl">
              <SearchBar size="hero" placeholder="Headphones, IKEA bed, 4K TV…" />
              {/* Quick chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs text-scout-muted">Try</span>
                {CATEGORY_CHIPS.map(chip => (
                  <Link
                    key={chip}
                    href={`/search?q=${encodeURIComponent(chip)}`}
                    className="text-xs text-scout-dark bg-white border border-scout-border rounded-full px-3 py-1 hover:border-scout-dark transition-colors"
                  >
                    {chip}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Location indicator */}
            {displayName && (
              <motion.div variants={staggerItem} className="flex items-center gap-1.5 text-sm text-scout-muted">
                <MapPin size={14} />
                <span>Showing results near <strong className="text-scout-dark">{displayName}</strong></span>
              </motion.div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 pt-10 border-t border-scout-border"
          >
            {STATS.map(({ value, label, sub }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-scout-dark">{value}</p>
                <p className="text-sm font-medium text-scout-dark">{label}</p>
                <p className="text-xs text-scout-muted">{sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {dataRegion === 'rich' ? (
        <RichHomeContent nearbyStores={nearbyStores || []} />
      ) : (
        <SparseHomeContent category={sparseCategory} onCategoryChange={setSparseCategory} />
      )}
    </div>
  );
}

function RichHomeContent({ nearbyStores }: { nearbyStores: (Store & { distanceKm?: number })[] }) {
  const physicalStores = nearbyStores.filter(s => s.type !== 'online').slice(0, 6);
  const categories = getCategories();

  return (
    <div className="space-y-20 pb-20">
      {/* Nearby Stores */}
      {physicalStores.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label mb-1">Near you</p>
              <h2 className="text-2xl font-bold text-scout-dark">Nearby Stores</h2>
            </div>
            <Link href="/map">
              <Button variant="ghost" size="sm">View map <ArrowRight size={14} /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {physicalStores.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>
      )}

      {/* Browse by category */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="section-label mb-1">Catalogue</p>
            <h2 className="text-2xl font-bold text-scout-dark">Browse by category</h2>
          </div>
          <Link href="/trending">
            <Button variant="ghost" size="sm">All categories <ArrowRight size={14} /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map(({ id, label, count }) => {
            const img = CATEGORY_IMAGES[id] || CATEGORY_IMAGES.home;
            return (
              <Link key={id} href={`/search?category=${id}`} className="group relative rounded-2xl overflow-hidden aspect-square flex flex-col justify-end hover:scale-105 transition-transform duration-200">
                <Image
                  src={img}
                  alt={label}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative p-2.5 text-center">
                  <p className="text-xs font-semibold text-white leading-tight">{label}</p>
                  <p className="text-xs text-white/60">{count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="section-label mb-1">Today</p>
            <h2 className="text-2xl font-bold text-scout-dark">Biggest savings right now</h2>
          </div>
          <Link href="/trending">
            <Button variant="ghost" size="sm">See all <ArrowRight size={14} /></Button>
          </Link>
        </div>
        <TrendingGrid limit={6} />
      </section>

      {/* AI Callout */}
      <section className="bg-scout-dark mx-4 rounded-3xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-14 flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-white/10 rounded-md flex items-center justify-center">
                <Zap size={13} className="text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">AI Assistant</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Ask Scout anything.</h2>
            <p className="text-white/60 mb-6 max-w-md">
              &ldquo;What&apos;s the best espresso machine under £200?&rdquo; &ldquo;Compare the V15 to the V11.&rdquo; Scout reads thousands of reviews and live prices to answer.
            </p>
            <Link href="/chat">
              <Button variant="accent" size="lg">
                Try the assistant <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="flex-1 bg-white/5 rounded-2xl p-5 border border-white/10 max-w-sm w-full">
            <div className="text-sm text-white/60 mb-3">Best wireless headphones under £300 with great noise cancelling?</div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white font-bold shrink-0">S</div>
                <div className="text-sm text-white/80 leading-relaxed">
                  For ANC under £300, two strong picks:<br />
                  <strong className="text-white">Sony WH-1000XM5</strong> — £299 at Amazon. Best in class for adaptive ANC.<br />
                  <strong className="text-white">Bose QC Ultra</strong> — £279 at John Lewis (rare sale).
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1.5 bg-white/10 text-white text-xs rounded-lg hover:bg-white/20 transition-colors">Set an alert</button>
              <button className="px-3 py-1.5 bg-white/10 text-white text-xs rounded-lg hover:bg-white/20 transition-colors">Compare them</button>
            </div>
          </div>
        </div>
      </section>

      {/* What everyone is buying */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="section-label mb-1">Trending</p>
            <h2 className="text-2xl font-bold text-scout-dark">What everyone is buying</h2>
          </div>
        </div>
        <TrendingGrid limit={5} />
      </section>
    </div>
  );
}

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Search,
    title: 'Search anything',
    desc: 'Type a product name, describe what you need, or ask the AI. Scout understands natural language.',
    color: 'bg-scout-accent/10 text-scout-accent',
  },
  {
    step: '02',
    icon: SlidersHorizontal,
    title: 'Compare live prices',
    desc: 'See prices from 12+ retailers updated hourly — including in-store availability near you.',
    color: 'bg-scout-blue/10 text-scout-blue',
  },
  {
    step: '03',
    icon: ShoppingCart,
    title: 'Buy with confidence',
    desc: 'Go straight to the cheapest retailer with one click. Set alerts for price drops.',
    color: 'bg-scout-green/10 text-scout-green',
  },
];

function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="section-label mb-1">Process</p>
          <h2 className="text-2xl font-bold text-scout-dark">How Scout works</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* connector line on md+ */}
        <div className="hidden md:block absolute top-10 left-[calc(33.3%+1rem)] right-[calc(33.3%+1rem)] h-px border-t-2 border-dashed border-scout-border z-0" />
        {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc, color }) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: parseInt(step) * 0.1 }}
            className="relative bg-white border border-scout-border rounded-3xl p-7 z-10"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
                <Icon size={22} />
              </div>
              <span className="text-4xl font-bold text-scout-border mt-1 select-none">{step}</span>
            </div>
            <h3 className="text-base font-semibold text-scout-dark mb-2">{title}</h3>
            <p className="text-sm text-scout-muted leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Social proof strip */}
      <div className="mt-8 bg-scout-bg rounded-2xl px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-scout-muted text-center sm:text-left">
          Trusted by <strong className="text-scout-dark">142,000+</strong> shoppers last month · Average saving of <strong className="text-scout-dark">£47</strong> per order
        </p>
        <Link href="/search?q=headphones">
          <Button variant="primary" size="sm">Start saving <ArrowRight size={14} /></Button>
        </Link>
      </div>
    </section>
  );
}

function SparseHomeContent({ category, onCategoryChange }: { category: string; onCategoryChange: (c: string) => void }) {
  return (
    <div className="space-y-12 pb-20">
      <section className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <p className="section-label mb-1">Discovery</p>
          <h2 className="text-2xl font-bold text-scout-dark mb-2">Find stores near you</h2>
          <p className="text-scout-muted text-sm">Scout is searching Google Maps for real stores in your area.</p>
        </div>
        <div className="mb-6">
          <CategorySearchBar onCategoryChange={onCategoryChange} defaultCategory={category} />
        </div>
        <NearbyStoresGrid category={category} />
      </section>

      <section className="max-w-7xl mx-auto px-4 bg-scout-dark rounded-3xl p-8">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={18} className="text-white/70" />
          <span className="text-xs font-semibold uppercase tracking-widest text-white/50">AI Assistant</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Can&apos;t find what you need?</h2>
        <p className="text-white/60 mb-4">Ask our AI assistant for local shopping advice and alternatives.</p>
        <Link href="/chat">
          <Button variant="accent">Open Assistant <ArrowRight size={14} /></Button>
        </Link>
      </section>
    </div>
  );
}
