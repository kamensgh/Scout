import { NextRequest, NextResponse } from 'next/server';
import { generateProductDetails } from '@/lib/claude';

export async function POST(req: NextRequest) {
  try {
    const { name, category, lowestPricePence, storeCount } = await req.json();
    if (!name) return NextResponse.json({ data: null, error: 'Missing name' }, { status: 400 });

    const details = await generateProductDetails(name, category ?? 'home', lowestPricePence ?? 0, storeCount ?? 1);
    return NextResponse.json({ data: details, error: null });
  } catch {
    return NextResponse.json({ data: null, error: 'Failed' }, { status: 500 });
  }
}
