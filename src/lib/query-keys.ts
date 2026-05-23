export const queryKeys = {
  search: (q: string, lat?: number | null, lng?: number | null) =>
    ['search', q, lat, lng] as const,
  product: (id: string, lat?: number | null, lng?: number | null) =>
    ['product', id, lat, lng] as const,
  trending: (category?: string, lat?: number | null, lng?: number | null) =>
    ['trending', category, lat, lng] as const,
  stores: (lat?: number | null, lng?: number | null, radius?: number) =>
    ['stores', lat, lng, radius] as const,
  store: (id: string) => ['store', id] as const,
  places: (lat: number, lng: number, category: string) =>
    ['places', lat, lng, category] as const,
};
