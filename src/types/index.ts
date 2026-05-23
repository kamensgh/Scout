export interface Store {
  id: string;
  name: string;
  logo: string;
  abbreviation: string;
  type: 'physical' | 'online' | 'both';
  country: string; // ISO 3166-1 alpha-2
  lat?: number;
  lng?: number;
  address?: string;
  deliveryDays?: number;
  deliveryFee?: number;
  verified: boolean;
  rating: number;
}

export interface StorePrice {
  storeId: string;
  storeName: string;
  storeLogo: string;
  storeAbbreviation: string;
  storeType: 'physical' | 'online' | 'both';
  pricePence: number;
  inStock: boolean;
  deliveryDays?: number;
  deliveryFeePence?: number;
  collectionAvailable?: boolean;
  url: string;
  lastUpdated: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  imageUrl: string;
  images: string[];
  tags: string[];
  lowestPricePence: number;
  highestPricePence: number;
  rrpPence: number;
  storePrices: StorePrice[];
  rating: number;
  reviewCount: number;
  trending: boolean;
  trendingRank?: number;
  specs?: Record<string, string>;
  nearestStoreName?: string;
  nearestStoreDistance?: number;
  nearestStoreCity?: string;
}

export type ProductCategory =
  | 'audio'
  | 'computing'
  | 'tvs'
  | 'home'
  | 'kitchen'
  | 'furniture'
  | 'diy'
  | 'sports';

export interface SearchFilters {
  categories: ProductCategory[];
  minPricePence?: number;
  maxPricePence?: number;
  brands: string[];
  minRating?: number;
  inStockOnly: boolean;
  freeDelivery: boolean;
  nearMe: boolean;
}

export interface ParsedSearchIntent {
  query: string;
  category?: ProductCategory;
  maxPricePence?: number;
  brand?: string;
  nearMe: boolean;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'distance';
  filters: Partial<SearchFilters>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingsTotal?: number;
  openNow?: boolean;
  phoneNumber?: string;
  website?: string;
  distanceKm: number;
  category: string;
  types?: string[];
}

export interface LocationData {
  rawInput: string | null;
  lat: number | null;
  lng: number | null;
  city: string | null;
  country: string | null;
  countryName: string | null;
  displayName: string | null;
  dataRegion: 'rich' | 'sparse';
  method: 'gps' | 'text' | null;
  status: 'idle' | 'detecting' | 'resolved' | 'error';
  error: string | null;
}

export interface CategoryInfo {
  id: ProductCategory;
  label: string;
  icon: string;
  count: number;
}
