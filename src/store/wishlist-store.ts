import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface PriceAlert {
  productId: string;
  productName: string;
  targetPricePence: number;
  email: string;
  createdAt: string;
}

interface WishlistState {
  savedProducts: Product[];
  priceAlerts: PriceAlert[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  isProductSaved: (id: string) => boolean;
  addAlert: (alert: Omit<PriceAlert, 'createdAt'>) => void;
  removeAlert: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      savedProducts: [],
      priceAlerts: [],
      addProduct: (product) =>
        set((s) => ({ savedProducts: [...s.savedProducts.filter(p => p.id !== product.id), product] })),
      removeProduct: (id) =>
        set((s) => ({ savedProducts: s.savedProducts.filter((p) => p.id !== id) })),
      isProductSaved: (id) => get().savedProducts.some((p) => p.id === id),
      addAlert: (alert) =>
        set((s) => ({ priceAlerts: [...s.priceAlerts.filter(a => a.productId !== alert.productId), { ...alert, createdAt: new Date().toISOString() }] })),
      removeAlert: (productId) =>
        set((s) => ({ priceAlerts: s.priceAlerts.filter((a) => a.productId !== productId) })),
    }),
    { name: 'scout-wishlist' }
  )
);
