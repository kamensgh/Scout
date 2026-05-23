'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { useLocationStore } from '@/store/location-store';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface SimilarProductsProps {
  product: Product;
  limit?: number;
}

export function SimilarProducts({ product, limit = 4 }: SimilarProductsProps) {
  const { lat, lng } = useLocationStore();

  // Search by category for SerpAPI products, or by category name for mock products
  const searchQuery = product.category;

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ['similar', product.id, searchQuery, lat, lng],
    queryFn: async () => {
      const params = new URLSearchParams({ q: searchQuery });
      if (lat) params.set('lat', String(lat));
      if (lng) params.set('lng', String(lng));
      const res = await fetch(`/api/search?${params}`);
      const json = await res.json();
      const results = json.data as Product[];
      return results.filter(p => p.id !== product.id).slice(0, limit);
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: limit }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {data.map(p => (
        <motion.div key={p.id} variants={staggerItem}>
          <ProductCard product={p} className="h-full" />
        </motion.div>
      ))}
    </motion.div>
  );
}
