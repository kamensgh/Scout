import { NextRequest, NextResponse } from 'next/server';
import { getStoresSortedByDistance } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat') ? parseFloat(req.nextUrl.searchParams.get('lat')!) : null;
  const lng = req.nextUrl.searchParams.get('lng') ? parseFloat(req.nextUrl.searchParams.get('lng')!) : null;

  const stores = getStoresSortedByDistance(lat, lng);
  return NextResponse.json({ data: stores, error: null });
}
