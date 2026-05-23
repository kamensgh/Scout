import { NextRequest, NextResponse } from 'next/server';
import { searchGoogleShopping } from '@/lib/serpapi';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    if (!file) return NextResponse.json({ data: null, error: 'No image provided' }, { status: 400 });

    const products = await searchGoogleShopping('trending electronics gadgets');
    return NextResponse.json({ data: products.slice(0, 6), error: null, meta: { method: 'trending-fallback' } });
  } catch {
    return NextResponse.json({ data: null, error: 'Image search failed' }, { status: 500 });
  }
}
