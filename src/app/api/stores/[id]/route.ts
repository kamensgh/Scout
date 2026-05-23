import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ data: null, error: 'Not configured' }, { status: 500 });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${params.id}&fields=name,rating,formatted_address,formatted_phone_number,website,opening_hours&key=${apiKey}`,
    { next: { revalidate: 3600 } }
  );
  const json = await res.json();

  if (json.status !== 'OK') {
    return NextResponse.json({ data: null, error: 'Store not found' }, { status: 404 });
  }

  const p = json.result;
  return NextResponse.json({
    data: {
      id: params.id,
      name: p.name,
      address: p.formatted_address,
      phoneNumber: p.formatted_phone_number,
      website: p.website,
      rating: p.rating,
      openNow: p.opening_hours?.open_now,
      inventory: [],
    },
    error: null,
  });
}
