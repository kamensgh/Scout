import { NextRequest, NextResponse } from 'next/server';
import { getProductById, MOCK_STORES } from '@/lib/mock-data';
import { cacheGet } from '@/lib/serp-cache';
import { searchGoogleShopping } from '@/lib/serpapi';
import { distanceKm } from '@/lib/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const lat = req.nextUrl.searchParams.get('lat') ? parseFloat(req.nextUrl.searchParams.get('lat')!) : null;
  const lng = req.nextUrl.searchParams.get('lng') ? parseFloat(req.nextUrl.searchParams.get('lng')!) : null;

  let product = id.startsWith('serp-') ? cacheGet(id) : getProductById(id);

  // Cache miss for serp product — reconstruct query from the slug and re-search
  if (!product && id.startsWith('serp-')) {
    const query = id.replace(/^serp-/, '').replace(/-/g, ' ');
    const results = await searchGoogleShopping(query);
    product = results.find(p => p.id === id) || results[0] || null;
  }

  if (!product) {
    return NextResponse.json({ data: null, error: 'Product not found' }, { status: 404 });
  }

  let enrichedPrices = product.storePrices;
  if (lat && lng && !id.startsWith('serp-')) {
    enrichedPrices = product.storePrices.map(sp => {
      const store = MOCK_STORES.find(s => s.id === sp.storeId);
      if (store?.lat && store?.lng) {
        const km = distanceKm(lat, lng, store.lat, store.lng);
        return { ...sp, distanceKm: km, distanceMiles: km * 0.621371 };
      }
      return sp;
    }).sort((a, b) => {
      const aOnline = a.storeType === 'online';
      const bOnline = b.storeType === 'online';
      if (aOnline && !bOnline) return 1;
      if (!aOnline && bOnline) return -1;
      const aDist = (a as typeof a & { distanceKm?: number }).distanceKm ?? Infinity;
      const bDist = (b as typeof b & { distanceKm?: number }).distanceKm ?? Infinity;
      return aDist - bDist;
    });
  }

  return NextResponse.json({
    data: { ...product, storePrices: enrichedPrices },
    error: null,
  });
}
