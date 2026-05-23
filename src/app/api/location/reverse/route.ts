import { NextRequest, NextResponse } from 'next/server';

const RICH_COUNTRIES = ['GB', 'US', 'CA', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'IE'];

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lng = req.nextUrl.searchParams.get('lng');
  if (!lat || !lng) return NextResponse.json({ data: null, error: 'Missing lat/lng' }, { status: 400 });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ data: null, error: 'Not configured' }, { status: 500 });

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const json = await res.json();
    if (json.status !== 'OK' || !json.results?.[0]) {
      return NextResponse.json({ data: null, error: 'Reverse geocoding failed' }, { status: 404 });
    }
    const result = json.results[0];
    const components = result.address_components as Array<{ types: string[]; long_name: string; short_name: string }>;
    const city = components.find(c => c.types.includes('locality'))?.long_name
      || components.find(c => c.types.includes('administrative_area_level_2'))?.long_name
      || 'Unknown';
    const countryComp = components.find(c => c.types.includes('country'));
    const country = countryComp?.short_name || 'US';
    const countryName = countryComp?.long_name || '';
    const displayName = [
      components.find(c => c.types.includes('sublocality'))?.long_name,
      city,
    ].filter(Boolean).join(', ');
    return NextResponse.json({
      data: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        city,
        country,
        countryName,
        displayName,
        dataRegion: RICH_COUNTRIES.includes(country) ? 'rich' : 'sparse',
      },
      error: null,
    });
  } catch {
    return NextResponse.json({ data: null, error: 'Reverse geocoding failed' }, { status: 500 });
  }
}
