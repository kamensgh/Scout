import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Product, SearchFilters, ParsedSearchIntent } from '@/types';

export type SortBy = 'relevance' | 'price-asc' | 'price-desc' | 'rating';

interface SearchState {
  query: string;
  results: Product[];
  isLoading: boolean;
  filters: SearchFilters;
  sortBy: SortBy;
  parsedIntent: ParsedSearchIntent | null;
  setQuery: (q: string) => void;
  setResults: (results: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setSortBy: (sort: SortBy) => void;
  setParsedIntent: (intent: ParsedSearchIntent | null) => void;
  reset: () => void;
}

const defaultFilters: SearchFilters = {
  categories: [],
  brands: [],
  inStockOnly: false,
  freeDelivery: false,
  nearMe: false,
};

export const useSearchStore = create<SearchState>()(
  devtools(
    (set) => ({
      query: '',
      results: [],
      isLoading: false,
      filters: defaultFilters,
      sortBy: 'relevance' as SortBy,
      parsedIntent: null,
      setQuery: (query) => set({ query }),
      setResults: (results) => set({ results }),
      setLoading: (isLoading) => set({ isLoading }),
      setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
      setSortBy: (sortBy) => set({ sortBy }),
      setParsedIntent: (parsedIntent) => set({ parsedIntent }),
      reset: () => set({ query: '', results: [], filters: defaultFilters, sortBy: 'relevance', parsedIntent: null }),
    }),
    { name: 'SearchStore' }
  )
);
