import { NextRequest, NextResponse } from 'next/server';
import { cacheGet } from '@/lib/serp-cache';
import { searchGoogleShopping, getImmersiveProductData, getStorePricesForProduct } from '@/lib/serpapi';

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

  if (!product) {
    return NextResponse.json({ data: null, error: 'Product not found' }, { status: 404 });
  }

  // Prefer immersive product data — it has direct retailer links, real description, and multiple images
  if (product.immersiveProductToken) {
    const immersive = await getImmersiveProductData(product.immersiveProductToken);
    if (immersive && immersive.storePrices.length > 0) {
      const prices = immersive.storePrices;
      product = {
        ...product,
        storePrices: prices,
        lowestPricePence: prices[0].pricePence,
        highestPricePence: prices[prices.length - 1].pricePence,
        ...(immersive.description && { description: immersive.description }),
        ...(immersive.brand && { brand: immersive.brand }),
        ...(immersive.images.length > 0 && { images: immersive.images, imageUrl: immersive.images[0] }),
      };
      return NextResponse.json({ data: product, error: null });
    }
  }

  // Fallback: search google_shopping for the product name to get multi-retailer prices
  const sellers = await getStorePricesForProduct(product.name, country);
  if (sellers.length > 0) {
    product = {
      ...product,
      storePrices: sellers,
      lowestPricePence: sellers[0].pricePence,
      highestPricePence: sellers[sellers.length - 1].pricePence,
    };
  }

  return NextResponse.json({ data: product, error: null });
}
