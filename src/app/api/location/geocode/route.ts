import { NextRequest, NextResponse } from 'next/server';

const cache = new Map<string, { data: object; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

function dataRegionFromCountry(code: string): 'rich' | 'sparse' {
  const rich = ['GB', 'US', 'CA', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'IE'];
  return rich.includes(code) ? 'rich' : 'sparse';
}

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get('input')?.trim();
  if (!input) return NextResponse.json({ data: null, error: 'Missing input' }, { status: 400 });

  const key = input.toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({ data: cached.data, error: null });
  }

  try {
    // UK postcode: try postcodes.io first (free, faster)
    if (UK_POSTCODE.test(input)) {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(input)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === 200 && json.result) {
          const r = json.result;
          const data = {
            lat: r.latitude,
            lng: r.longitude,
            city: r.admin_district || r.parliamentary_constituency || 'London',
            country: 'GB',
            countryName: 'United Kingdom',
            displayName: `${r.admin_ward || ''}, ${r.admin_district || 'London'}`.replace(/^, /, ''),
            dataRegion: 'rich',
          };
          cache.set(key, { data, ts: Date.now() });
          return NextResponse.json({ data, error: null });
        }
      }
    }

    // Fallback: Google Geocoding API
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ data: null, error: 'Geocoding not configured' }, { status: 500 });
    }
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(input)}&key=${apiKey}`
    );
    const geoJson = await geoRes.json();
    if (geoJson.status !== 'OK' || !geoJson.results?.[0]) {
      return NextResponse.json({ data: null, error: "Couldn't find that location" }, { status: 404 });
    }
    const result = geoJson.results[0];
    const loc = result.geometry.location;
    const components = result.address_components as Array<{ types: string[]; long_name: string; short_name: string }>;
    const city = components.find(c => c.types.includes('locality'))?.long_name
      || components.find(c => c.types.includes('administrative_area_level_2'))?.long_name
      || components.find(c => c.types.includes('administrative_area_level_1'))?.long_name
      || input;
    const countryComp = components.find(c => c.types.includes('country'));
    const country = countryComp?.short_name || 'US';
    const countryName = countryComp?.long_name || 'United States';
    const data = {
      lat: loc.lat,
      lng: loc.lng,
      city,
      country,
      countryName,
      displayName: result.formatted_address,
      dataRegion: dataRegionFromCountry(country),
    };
    cache.set(key, { data, ts: Date.now() });
    return NextResponse.json({ data, error: null });
  } catch {
    return NextResponse.json({ data: null, error: 'Geocoding failed' }, { status: 500 });
  }
}
