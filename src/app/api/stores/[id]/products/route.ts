import { NextRequest, NextResponse } from 'next/server';
import { searchGoogleShopping } from '@/lib/serpapi';
import { getRetailerById, isCuratedRetailerId } from '@/lib/retailers';

export const dynamic = 'force-dynamic';

const CATEGORY_TERMS: Record<string, string> = {
  audio: 'headphones speakers earbuds',
  computing: 'laptops computers tablets phones',
  tvs: 'television 4K OLED',
  home: 'home appliances',
  kitchen: 'kitchen appliances',
  furniture: 'furniture',
  diy: 'power tools',
  sports: 'fitness equipment',
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
  let retailerName = ''; // used to match store prices

  if (isCuratedRetailerId(id)) {
    const retailer = getRetailerById(id);
    if (!retailer) return NextResponse.json({ data: [], error: 'Store not found' }, { status: 404 });
    searchPrefix = retailer.searchPrefix;
    storeName = retailer.name;
    retailerName = retailer.name.toLowerCase();
  } else {
    const nameParam = req.nextUrl.searchParams.get('storeName');
    storeName = nameParam || '';
    searchPrefix = storeName;
    retailerName = storeName.toLowerCase();
  }

  const baseTerms = category ? (CATEGORY_TERMS[category] || q) : q;
  // Prefix the query with the retailer name so SerpAPI surfaces that retailer's listings
  const fullQuery = searchPrefix ? `${searchPrefix} ${baseTerms}` : baseTerms;

  try {
    const products = await searchGoogleShopping(fullQuery, country);

    // For curated retailers: filter each product's storePrices to only that store,
    // and only return products where that store has a listing.
    let processed = products;
    if (retailerName) {
      processed = products
        .map(product => {
          const matchingPrices = product.storePrices.filter(sp =>
            sp.storeName.toLowerCase().includes(retailerName) ||
            sp.storeId.includes(retailerName.replace(/\s+/g, '-'))
          );
          if (matchingPrices.length === 0) return null;
          const lowestPricePence = Math.min(...matchingPrices.map(sp => sp.pricePence));
          const highestPricePence = Math.max(...matchingPrices.map(sp => sp.pricePence));
          return {
            ...product,
            storePrices: matchingPrices,
            lowestPricePence,
            highestPricePence,
            rrpPence: Math.round(highestPricePence * 1.1),
          };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);

      // If filtering leaves too few results, fall back to all products from this search
      if (processed.length < 3) {
        processed = products;
      }
    }

    const sliced = processed.slice(0, limit);
    return NextResponse.json({
      data: sliced,
      error: null,
      meta: { storeName, total: sliced.length },
    });
  } catch {
    return NextResponse.json({ data: [], error: 'Failed to fetch store products' }, { status: 500 });
  }
}
