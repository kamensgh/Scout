import type { Product } from '@/types';

const cache = new Map<string, { product: Product; expiresAt: number }>();
const TTL_MS = 10 * 60 * 1000; // 10 minutes

export function cachePut(products: Product[]) {
  const expiresAt = Date.now() + TTL_MS;
  for (const p of products) {
    cache.set(p.id, { product: p, expiresAt });
  }
}

export function cacheGet(id: string): Product | null {
  const entry = cache.get(id);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(id);
    return null;
  }
  return entry.product;
}

export function makeStableId(title: string): string {
  return 'serp-' + title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
