import { NextRequest, NextResponse } from 'next/server';
import { searchGoogleShopping } from '@/lib/serpapi';
import type { ProductCategory } from '@/types';

export const dynamic = 'force-dynamic';

const CATEGORY_QUERIES: Record<string, string> = {
  audio: 'best selling headphones earbuds speakers',
  computing: 'best selling laptops computers tablets',
  tvs: 'best selling 4K TVs OLED QLED',
  home: 'best selling home appliances vacuum cleaner',
  kitchen: 'best selling kitchen appliances coffee machine',
  furniture: 'best selling furniture sofa bed',
  diy: 'best selling power tools drill',
  sports: 'best selling sports fitness equipment',
};

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') as ProductCategory | null;
  const countryCode = req.nextUrl.searchParams.get('country') || 'gb';
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '8');
  const queryOverride = req.nextUrl.searchParams.get('q');

  try {
    const query = queryOverride
      || (category ? (CATEGORY_QUERIES[category] || `best selling ${category} products`) : 'best selling electronics trending gadgets');

    const products = await searchGoogleShopping(query, countryCode);
    const sliced = products.slice(0, limit);
    return NextResponse.json({ data: sliced, error: null, meta: { total: sliced.length } });
  } catch {
    return NextResponse.json({ data: null, error: 'Failed to fetch trending' }, { status: 500 });
  }
}
