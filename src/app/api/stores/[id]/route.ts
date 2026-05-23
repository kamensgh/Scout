import { NextResponse } from 'next/server';
import { MOCK_STORES, ALL_PRODUCTS } from '@/lib/mock-data';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const store = MOCK_STORES.find(s => s.id === params.id);
  if (!store) return NextResponse.json({ data: null, error: 'Store not found' }, { status: 404 });

  const inventory = ALL_PRODUCTS.filter(p =>
    p.storePrices.some(sp => sp.storeId === params.id && sp.inStock)
  ).slice(0, 20);

  return NextResponse.json({ data: { ...store, inventory }, error: null });
}
