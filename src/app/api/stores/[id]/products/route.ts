import { NextRequest, NextResponse } from 'next/server';
import { searchGoogleShopping } from '@/lib/serpapi';
import { getRetailerById, isCuratedRetailerId } from '@/lib/retailers';

export const dynamic = 'force-dynamic';

const CATEGORY_TERMS: Record<string, string> = {
  audio: 'headphones',
  computing: 'laptops',
  tvs: 'television',
  home: 'appliances',
  kitchen: 'kitchen',
  furniture: 'furniture',
  diy: 'tools',
  sports: 'fitness',
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const q = req.nextUrl.searchParams.get('q') || 'electronics';
  const category = req.nextUrl.searchParams.get('category');
  const country = req.nextUrl.searchParams.get('country') || 'gb';
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '12');

  let searchPrefix = '';
  let storeName = '';

  if (isCuratedRetailerId(id)) {
    const retailer = getRetailerById(id);
    if (!retailer) return NextResponse.json({ data: [], error: 'Store not found' }, { status: 404 });
    searchPrefix = retailer.searchPrefix;
    storeName = retailer.name;
  } else {
    // Physical store - use the store name passed as a param or the ID
    const nameParam = req.nextUrl.searchParams.get('storeName');
    storeName = nameParam || '';
    searchPrefix = storeName;
  }

  // Build a focused query: use category terms or the explicit q
  const baseTerms = category ? (CATEGORY_TERMS[category] || q) : q;
  // For online retailers, include the store name in the query for relevance.
  // For physical stores, just use the category terms.
  const fullQuery = searchPrefix ? `${searchPrefix} ${baseTerms}` : baseTerms;

  try {
    const products = await searchGoogleShopping(fullQuery, country);
    const sliced = products.slice(0, limit);
    return NextResponse.json({
      data: sliced,
      error: null,
      meta: { storeName, total: sliced.length },
    });
  } catch {
    return NextResponse.json({ data: [], error: 'Failed to fetch store products' }, { status: 500 });
  }
}
