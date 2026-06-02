'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Truck, BadgeCheck, Search, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { useLocationStore } from '@/store/location-store';
import { staggerContainer, staggerItem } from '@/lib/animations';
import type { Product } from '@/types';

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'computing', label: 'Computing & Phones' },
  { id: 'audio', label: 'Audio' },
  { id: 'tvs', label: 'TVs' },
  { id: 'home', label: 'Home' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'diy', label: 'DIY' },
  { id: 'sports', label: 'Sports' },
];

interface StoreInfo {
  id: string;
  name: string;
  logo?: string;
  abbreviation?: string;
  type: 'physical' | 'online' | 'both';
  website?: string;
  tagline?: string;
  address?: string;
  rating?: number;
  verified?: boolean;
  deliveryDays?: number;
  openNow?: boolean;
  categories?: string[] | null;
}

function LogoImage({ store, size = 56 }: { store: StoreInfo; size?: number }) {
  const [err, setErr] = useState(false);
  if (store.logo && !err) {
    return (
      <Image
        src={store.logo}
        alt={store.name}
        width={size}
        height={size}
        className="object-contain p-1.5"
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <span className="text-lg font-bold text-scout-muted">
      {store.abbreviation || store.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export default function StorePage() {
  const { id } = useParams<{ id: string }>();
  const { country } = useLocationStore();
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [committed, setCommitted] = useState('');

  // Fetch store info
  const { data: storeData } = useQuery<{ data: StoreInfo }>({
    queryKey: ['store', id],
    queryFn: async () => {
      const res = await fetch(`/api/stores/${id}`);
      return res.json();
    },
  });
  const store = storeData?.data;

  // Fetch products for this store
  const { data: productsData, isLoading } = useQuery<{ data: Product[] }>({
    queryKey: ['store-products', id, activeCategory, committed, country],
    queryFn: async () => {
      const params = new URLSearchParams({
        country: (country || 'gb').toLowerCase(),
        limit: '12',
      });
      if (activeCategory) params.set('category', activeCategory);
      if (committed) params.set('q', committed);
      else params.set('q', 'electronics');
      if (store?.name && store.type === 'physical') params.set('storeName', store.name);
      const res = await fetch(`/api/stores/${id}/products?${params}`);
      return res.json();
    },
    enabled: !!store,
  });

  const products = productsData?.data || [];

  const visibleCategories = store?.categories
    ? CATEGORIES.filter(c => !c.id || store.categories!.includes(c.id))
    : CATEGORIES;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-scout-border bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-scout-muted hover:text-scout-dark transition-colors">
            <ArrowLeft size={18} />
          </Link>
          {store && (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white border border-scout-border overflow-hidden flex items-center justify-center shrink-0">
                <LogoImage store={store} size={28} />
              </div>
              <span className="font-semibold text-scout-dark">{store.name}</span>
              {store.verified && <BadgeCheck size={14} className="text-scout-blue" />}
            </div>
          )}
          {store?.website && (
            <a
              href={store.website}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 text-xs text-scout-muted hover:text-scout-dark transition-colors"
            >
              Visit site <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Store hero */}
        {store ? (
          <div className="bg-white border border-scout-border rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-scout-bg border border-scout-border overflow-hidden flex items-center justify-center shrink-0">
              <LogoImage store={store} size={56} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-scout-dark">{store.name}</h1>
                {store.verified && <BadgeCheck size={16} className="text-scout-blue shrink-0" />}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                  store.type === 'online'
                    ? 'bg-scout-blue/10 text-scout-blue'
                    : store.type === 'physical'
                    ? 'bg-scout-green/10 text-scout-green'
                    : 'bg-scout-accent/10 text-scout-accent'
                }`}>
                  {store.type === 'online' ? 'Online Retailer' : store.type === 'physical' ? 'Physical Store' : 'Online & In-Store'}
                </span>
              </div>
              {store.tagline && <p className="text-sm text-scout-muted mb-2">{store.tagline}</p>}
              {store.address && <p className="text-xs text-scout-muted">{store.address}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {store.deliveryDays !== undefined && (
                  <div className="flex items-center gap-1.5 text-xs text-scout-muted">
                    <Truck size={12} />
                    <span>
                      {store.deliveryDays === 0
                        ? 'Same-day delivery'
                        : store.deliveryDays === 1
                        ? 'Next-day delivery'
                        : `${store.deliveryDays}-day delivery`}
                    </span>
                  </div>
                )}
                {store.openNow !== undefined && (
                  <span className={`text-xs font-medium ${store.openNow ? 'text-scout-green' : 'text-scout-red'}`}>
                    {store.openNow ? 'Open now' : 'Closed'}
                  </span>
                )}
                {store.rating && (
                  <span className="text-xs text-scout-muted">★ {store.rating.toFixed(1)}</span>
                )}
              </div>
            </div>
            {store.website && (
              <a
                href={store.website}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 px-4 py-2 bg-scout-dark text-white text-sm font-medium rounded-xl hover:bg-scout-dark/90 transition-colors"
              >
                Shop on site <ExternalLink size={14} />
              </a>
            )}
          </div>
        ) : (
          <div className="h-32 bg-white border border-scout-border rounded-3xl mb-8 animate-pulse" />
        )}

        {/* Search + category filters */}
        <div className="mb-6 space-y-3">
          <form
            onSubmit={(e) => { e.preventDefault(); setCommitted(search); setActiveCategory(''); }}
            className="relative max-w-md"
          >
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-scout-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search in ${store?.name || 'this store'}…`}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-scout-border rounded-xl focus:outline-none focus:ring-2 focus:ring-scout-dark/10 focus:border-scout-dark transition-colors"
            />
          </form>

          <div className="flex flex-wrap gap-2">
            {visibleCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setCommitted(''); setSearch(''); }}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id && !committed
                    ? 'bg-scout-dark text-white'
                    : 'bg-white border border-scout-border text-scout-dark hover:border-scout-dark'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Store size={40} className="mx-auto text-scout-muted mb-4 opacity-40" />
            <p className="text-scout-muted">No products found. Try a different search or category.</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {products.map(product => (
              <motion.div key={product.id} variants={staggerItem}>
                <ProductCard product={product} className="h-full" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Back to search */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm text-scout-muted hover:text-scout-dark transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back to Scout
          </Link>
        </div>
      </div>
    </div>
  );
}
