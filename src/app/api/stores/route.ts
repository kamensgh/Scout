import { NextRequest, NextResponse } from 'next/server';
import type { Store } from '@/types';
import { getRetailersForCountry } from '@/lib/retailers';

export const dynamic = 'force-dynamic';

// img.logo.dev now requires a paid API token (returns 401 unconditionally without one,
// even for real domains) — there's no token configured, so every lookup is a guaranteed
// failure. Skip the request entirely and let callers render the initials badge fallback.
function guessLogoUrl(): string {
  return '';
}

function makeAbbreviation(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchPhysicalStores(lat: string, lng: string, apiKey: string): Promise<(Store & { distanceKm: number })[]> {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const keywords = ['electronics store', 'department store', 'phone shop', 'computer store', 'home appliances store'];
  const seen = new Map<string, Record<string, unknown>>();

  const fetchKeyword = async (keyword: string, radius: number) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      const json = await res.json();
      for (const p of json.results || []) {
        if (!seen.has(p.place_id)) seen.set(p.place_id, p);
      }
    } catch { /* ignore */ }
  };

  await Promise.all(keywords.map(kw => fetchKeyword(kw, 8000)));
  if (seen.size < 3) await Promise.all(keywords.map(kw => fetchKeyword(kw, 25000)));

  return Array.from(seen.values())
    .map((p) => {
      const geo = p.geometry as { location: { lat: number; lng: number } };
      const placeLat = geo.location.lat;
      const placeLng = geo.location.lng;
      return {
        id: p.place_id as string,
        name: p.name as string,
        logo: guessLogoUrl(),
        abbreviation: makeAbbreviation(p.name as string),
        type: 'physical' as const,
        country: '',
        lat: placeLat,
        lng: placeLng,
        address: p.vicinity as string | undefined,
        verified: (p.business_status as string) === 'OPERATIONAL',
        rating: (p.rating as number) || 4.0,
        distanceKm: haversineKm(latNum, lngNum, placeLat, placeLng),
        openNow: (p.opening_hours as { open_now?: boolean } | undefined)?.open_now,
      } as Store & { distanceKm: number; openNow?: boolean };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 10);
}

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lng = req.nextUrl.searchParams.get('lng');
  const country = req.nextUrl.searchParams.get('country') || '';

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ data: [], error: 'Maps API not configured' });

  // Fetch physical stores and online retailers in parallel
  const [physicalStores, onlineRetailers] = await Promise.all([
    lat && lng ? fetchPhysicalStores(lat, lng, apiKey) : Promise.resolve([]),
    Promise.resolve(
      getRetailersForCountry(country).map(r => ({
        id: r.id,
        name: r.name,
        logo: r.logo,
        abbreviation: r.abbreviation,
        type: 'online' as const,
        country: country,
        verified: r.verified,
        rating: 4.5,
        deliveryDays: r.deliveryDays,
        deliveryFee: 0,
        website: r.url,
        tagline: r.tagline,
        categories: r.categories,
      } as Store & { website?: string; tagline?: string }))
    ),
  ]);

  return NextResponse.json({
    data: [...physicalStores, ...onlineRetailers],
    error: null,
  });
}
