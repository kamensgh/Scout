import { NextRequest, NextResponse } from 'next/server';
import { cacheGet } from '@/lib/serp-cache';
import { searchGoogleShopping } from '@/lib/serpapi';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  let product = cacheGet(id);

  if (!product) {
    const query = id.replace(/^serp-/, '').replace(/-/g, ' ');
    const results = await searchGoogleShopping(query);
    product = results.find(p => p.id === id) || results[0] || null;
  }

  if (!product) {
    return NextResponse.json({ data: null, error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ data: product, error: null });
}
