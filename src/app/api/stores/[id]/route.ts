import { NextRequest, NextResponse } from 'next/server';
import { getRetailerById, isCuratedRetailerId } from '@/lib/retailers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // Curated online retailer
  if (isCuratedRetailerId(id)) {
    const retailer = getRetailerById(id);
    if (!retailer) return NextResponse.json({ data: null, error: 'Store not found' }, { status: 404 });
    return NextResponse.json({
      data: {
        id: retailer.id,
        name: retailer.name,
        logo: retailer.logo,
        abbreviation: retailer.abbreviation,
        type: 'online',
        website: retailer.url,
        tagline: retailer.tagline,
        verified: retailer.verified,
        deliveryDays: retailer.deliveryDays,
        rating: 4.5,
        categories: retailer.categories || null,
      },
      error: null,
    });
  }

  // Physical store via Google Places
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ data: null, error: 'Not configured' }, { status: 500 });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=name,rating,formatted_address,formatted_phone_number,website,opening_hours&key=${apiKey}`,
    { next: { revalidate: 3600 } }
  );
  const json = await res.json();

  if (json.status !== 'OK') {
    return NextResponse.json({ data: null, error: 'Store not found' }, { status: 404 });
  }

  const p = json.result;
  return NextResponse.json({
    data: {
      id,
      name: p.name,
      type: 'physical',
      address: p.formatted_address,
      phoneNumber: p.formatted_phone_number,
      website: p.website,
      rating: p.rating,
      openNow: p.opening_hours?.open_now,
      verified: true,
    },
    error: null,
  });
}
