import { NextRequest, NextResponse } from 'next/server';
import { getTrending } from '@/lib/mock-data';
import type { ProductCategory } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') as ProductCategory | null;
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '8');

  try {
    const products = getTrending(category || undefined, limit);
    return NextResponse.json({ data: products, error: null, meta: { total: products.length } });
  } catch {
    return NextResponse.json({ data: null, error: 'Failed to fetch trending' }, { status: 500 });
  }
}
