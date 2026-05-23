import { NextRequest, NextResponse } from 'next/server';
import { parseSearchIntent } from '@/lib/claude';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ data: null, error: 'Missing query' }, { status: 400 });
    const intent = await parseSearchIntent(query);
    return NextResponse.json({ data: intent, error: null });
  } catch {
    return NextResponse.json({ data: null, error: 'Parse failed' }, { status: 500 });
  }
}
