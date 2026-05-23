import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get('input') || '';
  if (input.length < 2) return NextResponse.json({ data: [] });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ data: [] });

  const params = new URLSearchParams({ input, types: 'geocode', key: apiKey });
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`);
  const json = await res.json();

  if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    return NextResponse.json({ data: [] });
  }

  const suggestions = (json.predictions || []).slice(0, 6).map((p: { description: string; place_id: string }) => ({
    description: p.description,
    placeId: p.place_id,
  }));

  return NextResponse.json({ data: suggestions });
}
