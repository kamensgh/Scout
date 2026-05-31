import { NextRequest, NextResponse } from 'next/server';
import { cacheGet } from '@/lib/serp-cache';
import { searchGoogleShopping, getImmersiveProductData } from '@/lib/serpapi';

// Redirect endpoint that resolves a product ID to its cheapest direct
// retailer URL and 302-redirects there. Used by the search/leaderboard
// Buy buttons so a single click lands the user on the retailer page.
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const country = (req.nextUrl.searchParams.get('country') || 'gb').toLowerCase();

  let product = cacheGet(id);
  if (!product) {
    const query = id.replace(/^serp-/, '').replace(/-/g, ' ');
    const results = await searchGoogleShopping(query, country);
    product = results.find(p => p.id === id) || results[0] || null;
  }

  const isReal = (u?: string) =>
    !!u && u !== '#' && /^https?:\/\//i.test(u) && !/google\.com\/search/i.test(u);

  // Prefer the immersive product data — stores[].link is always a direct retailer URL
  if (product?.immersiveProductToken) {
    const immersive = await getImmersiveProductData(product.immersiveProductToken);
    const target = immersive?.storePrices.find(sp => isReal(sp.url))?.url;
    if (target) return NextResponse.redirect(target, 302);
  }

  // Fallback: any direct retailer URL we already have on the cached product
  const direct = product?.storePrices.find(sp => isReal(sp.url))?.url;
  if (direct) return NextResponse.redirect(direct, 302);

  // Last resort: send them to the Scout product page where they can pick a store
  return NextResponse.redirect(new URL(`/product/${id}`, req.url), 302);
}
