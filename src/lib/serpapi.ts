import type { Product, StorePrice, ProductCategory } from '@/types';
import { cachePut, makeStableId } from './serp-cache';

interface SerpApiShoppingResult {
  title: string;
  price?: string;
  extracted_price?: number;
  link?: string;
  product_link?: string;
  immersive_product_page_token?: string;
  serpapi_immersive_product_api?: string;
  source?: string;
  thumbnail?: string;
  rating?: number;
  reviews?: number;
  delivery?: string;
  position?: number;
  product_id?: string;
  multiple_sources?: boolean;
}

interface SerpApiResponse {
  shopping_results?: SerpApiShoppingResult[];
  error?: string;
}

interface ImmersiveStore {
  name?: string;
  logo?: string;
  link?: string;
  title?: string;
  rating?: number;
  reviews?: number;
  tag?: string;
  details_and_offers?: string[];
  price?: string;
  extracted_price?: number;
  shipping?: string;
  total?: string;
  extracted_total?: number;
}

interface ImmersiveProductResponse {
  product_results?: {
    title?: string;
    brand?: string;
    rating?: number;
    reviews?: number;
    thumbnails?: string[];
    about_the_product?: {
      title?: string;
      description?: string;
      link?: string;
    };
    stores?: ImmersiveStore[];
    stores_next_page_token?: string;
  };
  error?: string;
}

export const STORE_DOMAIN_MAP: Record<string, { id: string; name: string; abbreviation: string; logo: string }> = {
  'amazon': { id: 'amazon', name: 'Amazon', abbreviation: 'AMZ', logo: 'https://img.logo.dev/amazon.co.uk' },
  'currys': { id: 'currys', name: 'Currys', abbreviation: 'CU', logo: 'https://img.logo.dev/currys.co.uk' },
  'johnlewis': { id: 'johnlewis', name: 'John Lewis', abbreviation: 'JL', logo: 'https://img.logo.dev/johnlewis.com' },
  'john lewis': { id: 'johnlewis', name: 'John Lewis', abbreviation: 'JL', logo: 'https://img.logo.dev/johnlewis.com' },
  'argos': { id: 'argos', name: 'Argos', abbreviation: 'AR', logo: 'https://img.logo.dev/argos.co.uk' },
  'ebay': { id: 'ebay', name: 'eBay', abbreviation: 'EB', logo: 'https://img.logo.dev/ebay.co.uk' },
  'ao.com': { id: 'ao', name: 'AO', abbreviation: 'AO', logo: 'https://img.logo.dev/ao.com' },
  'very': { id: 'very', name: 'Very', abbreviation: 'VR', logo: 'https://img.logo.dev/very.co.uk' },
  'screwfix': { id: 'screwfix', name: 'Screwfix', abbreviation: 'SF', logo: 'https://img.logo.dev/screwfix.com' },
  'b&q': { id: 'bq', name: "B&Q", abbreviation: 'BQ', logo: 'https://img.logo.dev/diy.com' },
  'halfords': { id: 'halfords', name: 'Halfords', abbreviation: 'HF', logo: 'https://img.logo.dev/halfords.com' },
  'ikea': { id: 'ikea', name: 'IKEA', abbreviation: 'IK', logo: 'https://img.logo.dev/ikea.com' },
  'apple': { id: 'apple', name: 'Apple', abbreviation: 'AP', logo: 'https://img.logo.dev/apple.com' },
  'samsung': { id: 'samsung', name: 'Samsung', abbreviation: 'SM', logo: 'https://img.logo.dev/samsung.com' },
  'costco': { id: 'costco', name: 'Costco', abbreviation: 'CS', logo: 'https://img.logo.dev/costco.co.uk' },
  'box': { id: 'box', name: 'Box', abbreviation: 'BX', logo: 'https://img.logo.dev/box.co.uk' },
  'scan': { id: 'scan', name: 'Scan', abbreviation: 'SC', logo: 'https://img.logo.dev/scan.co.uk' },
  'brown thomas': { id: 'brownthomas', name: 'Brown Thomas', abbreviation: 'BT', logo: 'https://img.logo.dev/brownthomas.com' },
  'idealo': { id: 'idealo', name: 'idealo', abbreviation: 'ID', logo: 'https://img.logo.dev/idealo.co.uk' },
  'boots': { id: 'boots', name: 'Boots', abbreviation: 'BO', logo: 'https://img.logo.dev/boots.com' },
  'tesco': { id: 'tesco', name: 'Tesco', abbreviation: 'TE', logo: 'https://img.logo.dev/tesco.com' },
  'next': { id: 'next', name: 'Next', abbreviation: 'NX', logo: 'https://img.logo.dev/next.co.uk' },
  'target': { id: 'target', name: 'Target', abbreviation: 'TG', logo: 'https://img.logo.dev/target.com' },
  'walmart': { id: 'walmart', name: 'Walmart', abbreviation: 'WM', logo: 'https://img.logo.dev/walmart.com' },
  'best buy': { id: 'bestbuy', name: 'Best Buy', abbreviation: 'BB', logo: 'https://img.logo.dev/bestbuy.com' },
  'jumia': { id: 'jumia', name: 'Jumia', abbreviation: 'JU', logo: 'https://img.logo.dev/jumia.com' },
  'konga': { id: 'konga', name: 'Konga', abbreviation: 'KG', logo: 'https://img.logo.dev/konga.com' },
  'takealot': { id: 'takealot', name: 'Takealot', abbreviation: 'TA', logo: 'https://img.logo.dev/takealot.com' },
  'flipkart': { id: 'flipkart', name: 'Flipkart', abbreviation: 'FK', logo: 'https://img.logo.dev/flipkart.com' },
  'noon': { id: 'noon', name: 'Noon', abbreviation: 'NN', logo: 'https://img.logo.dev/noon.com' },
  'lazada': { id: 'lazada', name: 'Lazada', abbreviation: 'LZ', logo: 'https://img.logo.dev/lazada.com' },
  'shopee': { id: 'shopee', name: 'Shopee', abbreviation: 'SH', logo: 'https://img.logo.dev/shopee.com' },
  'mediamarkt': { id: 'mediamarkt', name: 'MediaMarkt', abbreviation: 'MM', logo: 'https://img.logo.dev/mediamarkt.de' },
  'fnac': { id: 'fnac', name: 'Fnac', abbreviation: 'FN', logo: 'https://img.logo.dev/fnac.com' },
};

export function guessStoreFromSource(source: string) {
  const lower = source.toLowerCase();
  for (const [key, info] of Object.entries(STORE_DOMAIN_MAP)) {
    if (lower.includes(key)) return info;
  }
  const abbr = source.slice(0, 2).toUpperCase();
  const domain = source.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  return {
    id: source.toLowerCase().replace(/\s+/g, '-'),
    name: source,
    abbreviation: abbr,
    logo: `https://img.logo.dev/${domain}`,
  };
}

function guessCategoryFromTitle(title: string): ProductCategory {
  const t = title.toLowerCase();
  if (/(headphone|earbud|speaker|audio|sound|music|bose|sony wh|airpods)/i.test(t)) return 'audio';
  if (/(laptop|macbook|computer|pc|monitor|keyboard|mouse|ssd|ram|cpu|gpu)/i.test(t)) return 'computing';
  if (/(tv|television|oled|qled|4k|8k|screen|display|projector)/i.test(t)) return 'tvs';
  if (/(coffee|espresso|kettle|blender|air fryer|microwave|toaster|kitchen)/i.test(t)) return 'kitchen';
  if (/(sofa|bed|wardrobe|chair|table|desk|shelf|furniture|mattress)/i.test(t)) return 'furniture';
  if (/(drill|saw|screwdriver|paint|plumbing|diy|tool|power tool)/i.test(t)) return 'diy';
  if (/(bike|cycling|gym|fitness|treadmill|yoga|sport|football|running)/i.test(t)) return 'sports';
  return 'home';
}


async function fetchShopping(query: string, countryCode: string): Promise<Product[]> {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    engine: 'google_shopping',
    q: query,
    gl: countryCode,
    hl: 'en',
    api_key: apiKey,
    num: '20',
  });

  const res = await fetch(`https://serpapi.com/search.json?${params}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return [];

  const data: SerpApiResponse = await res.json();
  if (!data.shopping_results?.length) return [];

  const grouped = new Map<string, { result: SerpApiShoppingResult; storePrices: StorePrice[] }>();

  for (const item of data.shopping_results) {
    const normalizedTitle = item.title.replace(/\s+/g, ' ').trim();
    const priceInPence = item.extracted_price ? Math.round(item.extracted_price * 100) : 0;
    if (!priceInPence) continue;

    const source = item.source || 'Unknown';
    const storeInfo = guessStoreFromSource(source);

    const storePrice: StorePrice = {
      storeId: storeInfo.id,
      storeName: storeInfo.name,
      storeAbbreviation: storeInfo.abbreviation,
      storeLogo: storeInfo.logo,
      pricePence: priceInPence,
      inStock: true,
      url: item.link || item.product_link || '#',
      deliveryDays: 1,
      deliveryFeePence: 0,
      storeType: 'online',
      lastUpdated: new Date().toISOString(),
    };

    if (grouped.has(normalizedTitle)) {
      grouped.get(normalizedTitle)!.storePrices.push(storePrice);
    } else {
      grouped.set(normalizedTitle, { result: item, storePrices: [storePrice] });
    }
  }

  const products: Product[] = [];
  let idx = 0;

  for (const [title, { result, storePrices }] of Array.from(grouped)) {
    const sorted = storePrices.sort((a, b) => a.pricePence - b.pricePence);
    const lowestPricePence = sorted[0].pricePence;
    const highestPricePence = sorted[sorted.length - 1].pricePence;
    const rrpPence = Math.round(highestPricePence * 1.15);
    const storeCount = sorted.length;
    idx++;

    products.push({
      id: makeStableId(title),
      name: title,
      brand: sorted[0].storeName,
      description: `Compare prices across ${storeCount} retailer${storeCount > 1 ? 's' : ''}. Click any store below to buy at their current price.`,
      category: guessCategoryFromTitle(title),
      imageUrl: result.thumbnail || '',
      images: result.thumbnail ? [result.thumbnail] : [],
      rrpPence,
      lowestPricePence,
      highestPricePence,
      storePrices: sorted,
      rating: result.rating || 4.0,
      reviewCount: result.reviews || 0,
      trending: idx <= 3,
      specs: {},
      tags: [query],
      nearestStoreName: sorted[0].storeName,
      nearestStoreDistance: 0.5,
      googleProductId: result.product_id,
      immersiveProductToken: result.immersive_product_page_token,
    });
  }

  cachePut(products);
  return products;
}

// Countries with verified Google Shopping support
const SUPPORTED_COUNTRIES = new Set([
  'us', 'gb', 'ca', 'au', 'de', 'fr', 'it', 'es', 'nl', 'be', 'at', 'ch',
  'se', 'no', 'dk', 'fi', 'pl', 'pt', 'ie', 'nz', 'sg', 'in', 'jp', 'br',
  'mx', 'za', 'ng', 'ke', 'eg', 'ae', 'sa',
]);

const FALLBACK_CHAIN = ['us', 'gb'];

export async function searchGoogleShopping(query: string, countryCode = 'gb'): Promise<Product[]> {
  const code = countryCode.toLowerCase();

  if (SUPPORTED_COUNTRIES.has(code)) {
    const results = await fetchShopping(query, code);
    if (results.length > 0) return results;
  }

  for (const fallback of FALLBACK_CHAIN) {
    if (fallback === code) continue;
    const results = await fetchShopping(query, fallback);
    if (results.length > 0) return results;
  }

  return [];
}

// Fetch all buying options by searching for the exact product name across all retailers
export async function getStorePricesForProduct(productName: string, countryCode = 'gb'): Promise<StorePrice[]> {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey || !productName) return [];

  // Try requested country; fall back to gb/us for unsupported ones
  const code = SUPPORTED_COUNTRIES.has(countryCode) ? countryCode : 'gb';

  const params = new URLSearchParams({
    engine: 'google_shopping',
    q: productName,
    gl: code,
    hl: 'en',
    api_key: apiKey,
    num: '40',
  });

  try {
    const res = await fetch(`https://serpapi.com/search.json?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const data: SerpApiResponse = await res.json();
    const items = data.shopping_results || [];
    if (items.length === 0) return [];

    // Compute median price to filter obvious accessories/off-target listings
    const allPrices = items
      .map(i => i.extracted_price)
      .filter((p): p is number => typeof p === 'number' && p > 0)
      .sort((a, b) => a - b);
    const medianPrice = allPrices.length
      ? allPrices[Math.floor(allPrices.length / 2)]
      : 0;
    const priceFloor = medianPrice * 0.25; // drop anything below 25% of median

    // De-duplicate by store — keep the cheapest listing per store
    const byStore = new Map<string, StorePrice>();

    for (const item of items) {
      const pricePence = item.extracted_price ? Math.round(item.extracted_price * 100) : 0;
      if (!pricePence) continue;
      // Skip clearly off-target listings (e.g. phone cases when searching for a phone)
      if (priceFloor > 0 && item.extracted_price! < priceFloor) continue;

      const source = item.source || 'Unknown';
      const storeInfo = guessStoreFromSource(source);

      // Skip if we already have a cheaper price from this store
      const existing = byStore.get(storeInfo.id);
      if (existing && existing.pricePence <= pricePence) continue;

      byStore.set(storeInfo.id, {
        storeId: storeInfo.id,
        storeName: source.split(' - ')[0], // strip "Amazon - Seller" → "Amazon"
        storeAbbreviation: storeInfo.abbreviation,
        storeLogo: storeInfo.logo,
        pricePence,
        inStock: true,
        url: item.link || item.product_link || '#',
        storeType: 'online',
        listingName: item.title !== productName ? item.title : undefined,
        shippingText: item.delivery || undefined,
        deliveryFeePence: 0,
        deliveryDays: 1,
        lastUpdated: new Date().toISOString(),
      });
    }

    return Array.from(byStore.values()).sort((a, b) => a.pricePence - b.pricePence);
  } catch {
    return [];
  }
}

export async function getImmersiveProductData(pageToken: string): Promise<{
  description?: string;
  brand?: string;
  images: string[];
  storePrices: StorePrice[];
} | null> {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey || !pageToken) return null;

  try {
    const params = new URLSearchParams({
      engine: 'google_immersive_product',
      page_token: pageToken,
      api_key: apiKey,
    });

    const res = await fetch(`https://serpapi.com/search.json?${params}`, {
      next: { revalidate: 3600 }, // immersive data changes rarely
    });
    if (!res.ok) return null;

    const data: ImmersiveProductResponse = await res.json();
    const pr = data.product_results;
    if (!pr) return null;

    const storePrices: StorePrice[] = (pr.stores || [])
      .filter(s => s.extracted_price && s.link)
      .map(s => {
        const storeInfo = guessStoreFromSource(s.name || '');
        const offers = s.details_and_offers || [];
        const inStock = offers.some(o => /in stock/i.test(o));
        const freeDelivery = offers.some(o => /free delivery/i.test(o));
        const shippingText = offers.join(' · ') || undefined;
        return {
          storeId: storeInfo.id,
          storeName: s.name || storeInfo.name,
          storeAbbreviation: storeInfo.abbreviation,
          storeLogo: s.logo || storeInfo.logo,
          pricePence: Math.round((s.extracted_total ?? s.extracted_price ?? 0) * 100),
          inStock: inStock || true,
          url: s.link!,
          storeType: 'online' as const,
          deliveryFeePence: freeDelivery ? 0 : undefined,
          shippingText,
          badge: s.tag,
          lastUpdated: new Date().toISOString(),
        };
      })
      .sort((a, b) => a.pricePence - b.pricePence);

    return {
      description: pr.about_the_product?.description,
      brand: pr.brand,
      images: pr.thumbnails || [],
      storePrices,
    };
  } catch {
    return null;
  }
}
