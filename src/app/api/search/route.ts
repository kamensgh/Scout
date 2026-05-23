import { NextRequest, NextResponse } from 'next/server';
import { parseSearchIntent } from '@/lib/claude';
import { searchGoogleShopping } from '@/lib/serpapi';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q') || '';
  const countryCode = searchParams.get('country') || 'gb';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  try {
    if (q.trim().length > 2) {
      try { await parseSearchIntent(q); } catch { /* ignore */ }
    }

    const results = await searchGoogleShopping(q, countryCode);

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
