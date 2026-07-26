'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Truck, BadgeCheck, ArrowRight } from 'lucide-react';
import { useLocationStore } from '@/store/location-store';

// Keyword → Unsplash image mapping for store category cards
const CATEGORY_IMAGE_MAP: Array<{ keywords: string[]; image: string; gradient: string }> = [
  {
    keywords: ['electrical', 'electronics', 'appliance', 'gadget', 'device'],
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
    gradient: 'from-blue-600/70',
  },
  {
    keywords: ['television', 'tv', 'audio', 'sound', 'speaker', 'headphone'],
    image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80',
    gradient: 'from-indigo-700/70',
  },
  {
    keywords: ['supermarket', 'grocery', 'food', 'fresh', 'produce', 'drinks'],
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
    gradient: 'from-green-600/70',
  },
  {
    keywords: ['furniture', 'sofa', 'bed', 'chair', 'table', 'desk', 'wardrobe'],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    gradient: 'from-amber-700/70',
  },
  {
    keywords: ['kitchen', 'cooking', 'cookware', 'bake', 'coffee', 'blender'],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    gradient: 'from-orange-600/70',
  },
  {
    keywords: ['laptop', 'computer', 'computing', 'pc', 'tablet', 'phone', 'smartphone', 'mobile'],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    gradient: 'from-slate-700/70',
  },
  {
    keywords: ['sport', 'fitness', 'gym', 'exercise', 'outdoor', 'bike', 'running'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    gradient: 'from-red-600/70',
  },
  {
    keywords: ['fashion', 'clothing', 'clothes', 'wear', 'apparel', 'shoes', 'bags'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
    gradient: 'from-pink-600/70',
  },
  {
    keywords: ['beauty', 'health', 'personal', 'care', 'skincare', 'pharmacy'],
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    gradient: 'from-rose-500/70',
  },
  {
    keywords: ['diy', 'tools', 'hardware', 'garden', 'paint', 'build', 'plumbing'],
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80',
    gradient: 'from-yellow-700/70',
  },
  {
    keywords: ['baby', 'kids', 'children', 'toy', 'play'],
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80',
    gradient: 'from-cyan-500/70',
  },
  {
    keywords: ['home', 'decor', 'bedding', 'bath', 'lighting', 'cleaning'],
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80',
    gradient: 'from-teal-600/70',
  },
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80';
const FALLBACK_GRADIENT = 'from-scout-dark/70';

function getCategoryVisual(label: string): { image: string; gradient: string } {
  const lower = label.toLowerCase();
  for (const { keywords, image, gradient } of CATEGORY_IMAGE_MAP) {
    if (keywords.some(kw => lower.includes(kw))) return { image, gradient };
  }
  return { image: FALLBACK_IMAGE, gradient: FALLBACK_GRADIENT };
}

interface StoreCategory {
  id: string;
  label: string;
  description: string;
  externalUrl: string;
  searchQuery: string;
}

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

function CategoryCard({ category, storeName }: { category: StoreCategory; storeName: string }) {
  const router = useRouter();
  const { image, gradient } = getCategoryVisual(category.label);
  const [imgErr, setImgErr] = useState(false);

  const hasExternalUrl = !!category.externalUrl;

  const handleClick = () => {
    if (hasExternalUrl) {
      window.open(category.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      const params = new URLSearchParams({ q: `${storeName} ${category.label}` });
      router.push(`/search?${params}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group relative rounded-2xl overflow-hidden aspect-[4/3] w-full text-left focus:outline-none focus:ring-2 focus:ring-scout-dark/30"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {!imgErr ? (
          <Image
            src={image}
            alt={category.label}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full bg-scout-dark" />
        )}
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} to-transparent`} />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-5">
        <h3 className="text-white font-bold text-lg leading-tight mb-2 drop-shadow">
          {category.label}
        </h3>
        <div className="flex items-center gap-1 text-white/80 text-xs font-medium">
          <span>Shop now</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </button>
  );
}

export default function StorePage() {
  const { id } = useParams<{ id: string }>();
  const { country } = useLocationStore();
  const cc = (country || 'gb').toLowerCase();

  // Fetch store info
  const { data: storeData } = useQuery<{ data: StoreInfo }>({
    queryKey: ['store', id],
    queryFn: async () => {
      const res = await fetch(`/api/stores/${id}`);
      return res.json();
    },
  });
  const store = storeData?.data;

  // Fetch categories from Google sitelinks
  const { data: categoriesData, isLoading: catsLoading } = useQuery<{ data: StoreCategory[] }>({
    queryKey: ['store-categories', id, cc],
    queryFn: async () => {
      const params = new URLSearchParams({ country: cc });
      if (store?.name) params.set('storeName', store.name);
      const res = await fetch(`/api/stores/${id}/categories?${params}`);
      return res.json();
    },
    enabled: !!store,
  });

  const categories = categoriesData?.data || [];

  return (
    <div className="min-h-screen">
      {/* Sticky header */}
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
          <div className="bg-white border border-scout-border rounded-3xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
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
                  <span className={`text-xs font-medium ${store.openNow ? 'text-scout-green' : 'text-red-500'}`}>
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
          <div className="h-32 bg-white border border-scout-border rounded-3xl mb-10 animate-pulse" />
        )}

        {/* Category section header */}
        <div className="mb-6">
          <p className="section-label mb-1">Departments</p>
          <h2 className="text-xl font-bold text-scout-dark">Shop by category</h2>
        </div>

        {/* Category grid */}
        {catsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-scout-bg animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 text-scout-muted">
            <p>No categories found for this store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.filter(c => c.externalUrl).map(cat => (
              <CategoryCard key={cat.id} category={cat} storeName={store?.name || ''} />
            ))}
          </div>
        )}

        {/* Back link */}
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
