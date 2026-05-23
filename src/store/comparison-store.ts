import { create } from 'zustand';

interface ComparisonState {
  comparedIds: string[];
  addProduct: (id: string) => void;
  removeProduct: (id: string) => void;
  isCompared: (id: string) => boolean;
  clear: () => void;
}

export const useComparisonStore = create<ComparisonState>()((set, get) => ({
  comparedIds: [],
  addProduct: (id) =>
    set((s) => s.comparedIds.length < 4 ? { comparedIds: [...s.comparedIds, id] } : s),
  removeProduct: (id) =>
    set((s) => ({ comparedIds: s.comparedIds.filter((i) => i !== id) })),
  isCompared: (id) => get().comparedIds.includes(id),
  clear: () => set({ comparedIds: [] }),
}));
