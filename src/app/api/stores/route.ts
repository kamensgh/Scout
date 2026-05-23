import { NextRequest, NextResponse } from 'next/server';
import type { Store } from '@/types';

export const dynamic = 'force-dynamic';

const KNOWN_DOMAINS: Record<string, string> = {
  amazon: 'amazon.com',
  currys: 'currys.co.uk',
  'john lewis': 'johnlewis.com',
  argos: 'argos.co.uk',
  ikea: 'ikea.com',
  'ao.com': 'ao.com',
  ao: 'ao.com',
  ebay: 'ebay.com',
  screwfix: 'screwfix.com',
  'b&q': 'diy.com',
  halfords: 'halfords.com',
  wickes: 'wickes.co.uk',
  apple: 'apple.com',
  samsung: 'samsung.com',
  'best buy': 'bestbuy.com',
  bestbuy: 'bestbuy.com',
  target: 'target.com',
  walmart: 'walmart.com',
  costco: 'costco.com',
  'home depot': 'homedepot.com',
  "lowe's": 'lowes.com',
  lowes: 'lowes.com',
  mediamarkt: 'mediamarkt.com',
  fnac: 'fnac.com',
  boots: 'boots.com',
  tesco: 'tesco.com',
  "sainsbury's": 'sainsburys.co.uk',
  sainsburys: 'sainsburys.co.uk',
  'marks and spencer': 'marksandspencer.com',
  next: 'next.co.uk',
};

function guessLogoUrl(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, domain] of Object.entries(KNOWN_DOMAINS)) {
    if (lower.includes(key)) return `https://img.logo.dev/${domain}`;
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://img.logo.dev/${slug}.com`;
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

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lng = req.nextUrl.searchParams.get('lng');

  if (!lat || !lng) return NextResponse.json({ data: [], error: null });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ data: [], error: 'Maps API not configured' });

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  const keywords = ['electronics store', 'department store', 'home goods store', 'shopping mall'];
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

  // First pass: 8km
  await Promise.all(keywords.map(kw => fetchKeyword(kw, 8000)));

  // Widen to 20km if too few results
  if (seen.size < 4) {
    await Promise.all(keywords.map(kw => fetchKeyword(kw, 20000)));
  }

  const stores: (Store & { distanceKm: number })[] = Array.from(seen.values())
    .map((p) => {
      const geo = p.geometry as { location: { lat: number; lng: number } };
      const placeLat = geo.location.lat;
      const placeLng = geo.location.lng;
      return {
        id: p.place_id as string,
        name: p.name as string,
        logo: guessLogoUrl(p.name as string),
        abbreviation: makeAbbreviation(p.name as string),
        type: 'physical' as const,
        country: '',
        lat: placeLat,
        lng: placeLng,
        address: p.vicinity as string | undefined,
        verified: false,
        rating: (p.rating as number) || 4.0,
        distanceKm: haversineKm(latNum, lngNum, placeLat, placeLng),
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 12);

  return NextResponse.json({ data: stores, error: null });
}
