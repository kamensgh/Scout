'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import type { Product, ProductCategory } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { queryKeys } from '@/lib/query-keys';
import { useLocationStore } from '@/store/location-store';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface TrendingGridProps {
  category?: ProductCategory;
  limit?: number;
  className?: string;
}

export function TrendingGrid({ category, limit = 4, className }: TrendingGridProps) {
  const { lat, lng } = useLocationStore();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.trending(category, lat, lng),
    queryFn: async () => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (category) params.set('category', category);
      if (lat) params.set('lat', String(lat));
      if (lng) params.set('lng', String(lng));
      const res = await fetch(`/api/trending?${params}`);
      const json = await res.json();
      return json.data as Product[];
    },
  });

  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className || ''}`}>
        {Array.from({ length: limit }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className || ''}`}
    >
      {(data || []).map((product, i) => (
        <motion.div key={product.id} variants={staggerItem}>
          <ProductCard product={product} className="h-full" />
        </motion.div>
      ))}
    </motion.div>
  );
}
