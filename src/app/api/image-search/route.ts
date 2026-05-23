import { NextRequest, NextResponse } from 'next/server';
import { ALL_PRODUCTS } from '@/lib/mock-data';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    if (!file) return NextResponse.json({ data: null, error: 'No image provided' }, { status: 400 });

    // Mock: return a random set of products as "visually similar"
    const shuffled = [...ALL_PRODUCTS].sort(() => Math.random() - 0.5).slice(0, 6);
    return NextResponse.json({ data: shuffled, error: null, meta: { method: 'visual-similarity' } });
  } catch {
    return NextResponse.json({ data: null, error: 'Image search failed' }, { status: 500 });
  }
}
