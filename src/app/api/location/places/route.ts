import { NextRequest, NextResponse } from 'next/server';
import type { PlaceResult } from '@/types';

const CATEGORY_KEYWORDS: Record<string, string> = {
  tvs: 'electronics store',
  audio: 'electronics store',
  computing: 'electronics store',
  appliances: 'appliance store',
  furniture: 'furniture store',
  home: 'home goods store',
  kitchen: 'kitchen appliance store',
  fashion: 'clothing store',
  groceries: 'supermarket',
  'building-materials': 'hardware store',
  'car-parts': 'auto parts store',
  diy: 'hardware store',
  sports: 'sporting goods store',
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lng = req.nextUrl.searchParams.get('lng');
  const category = req.nextUrl.searchParams.get('category') || 'electronics';
  const radius = parseInt(req.nextUrl.searchParams.get('radius') || '5000');

  if (!lat || !lng) return NextResponse.json({ data: null, error: 'Missing lat/lng' }, { status: 400 });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ data: null, error: 'Not configured' }, { status: 500 });

  const keyword = CATEGORY_KEYWORDS[category] || 'store';

  const fetchPlaces = async (searchRadius: number) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${searchRadius}&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`;
    const res = await fetch(url);
    return res.json();
  };

  try {
    let json = await fetchPlaces(radius);
    if (json.status === 'ZERO_RESULTS') {
      json = await fetchPlaces(Math.min(radius * 4, 20000));
    }
    if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
      throw new Error(json.status);
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const places: PlaceResult[] = (json.results || []).slice(0, 20).map((p: Record<string, unknown>) => ({
      placeId: p.place_id,
      name: p.name,
      address: p.vicinity,
      lat: (p.geometry as { location: { lat: number; lng: number } }).location.lat,
      lng: (p.geometry as { location: { lat: number; lng: number } }).location.lng,
      rating: p.rating,
      userRatingsTotal: p.user_ratings_total,
      openNow: (p.opening_hours as { open_now?: boolean } | undefined)?.open_now,
      distanceKm: haversineKm(latNum, lngNum, (p.geometry as { location: { lat: number; lng: number } }).location.lat, (p.geometry as { location: { lat: number; lng: number } }).location.lng),
      category,
      types: p.types,
    }));

    return NextResponse.json({ data: places, error: null });
  } catch {
    return NextResponse.json({ data: null, error: 'Places search failed' }, { status: 500 });
  }
}
