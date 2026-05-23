import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/mock-data';
import { parseSearchIntent } from '@/lib/claude';
import { searchGoogleShopping } from '@/lib/serpapi';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q') || '';
  const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  try {
    let intent;
    if (q.trim().length > 2) {
      try {
        intent = await parseSearchIntent(q);
      } catch {
        intent = { query: q, nearMe: false, sortBy: 'relevance' as const, filters: {} };
      }
    }

    let results;
    const serpResults = await searchGoogleShopping(q);

    if (serpResults.length > 0) {
      results = serpResults;
    } else {
      results = searchProducts(q, intent, lat, lng);
    }

    const start = (page - 1) * pageSize;
    const paginated = results.slice(start, start + pageSize);

    return NextResponse.json({
      data: paginated,
      error: null,
      meta: { total: results.length, page, pageSize },
    });
  } catch {
    return NextResponse.json({ data: null, error: 'Search failed' }, { status: 500 });
  }
}
