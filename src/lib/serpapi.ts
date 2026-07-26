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
  'amazon': { id: 'amazon-us', name: 'Amazon', abbreviation: 'AMZ', logo: '/logos/amazon-us.svg' },
  'currys': { id: 'currys', name: 'Currys', abbreviation: 'CU', logo: '/logos/currys.svg' },
  'johnlewis': { id: 'johnlewis', name: 'John Lewis', abbreviation: 'JL', logo: '/logos/johnlewis.svg' },
  'john lewis': { id: 'johnlewis', name: 'John Lewis', abbreviation: 'JL', logo: '/logos/johnlewis.svg' },
  'argos': { id: 'argos', name: 'Argos', abbreviation: 'AR', logo: '/logos/argos.svg' },
  'ebay': { id: 'ebay', name: 'eBay', abbreviation: 'EB', logo: '/logos/ebay.svg' },
  'ao.com': { id: 'ao', name: 'AO', abbreviation: 'AO', logo: '/logos/ao.svg' },
  'ao': { id: 'ao', name: 'AO', abbreviation: 'AO', logo: '/logos/ao.svg' },
  'very': { id: 'very', name: 'Very', abbreviation: 'VR', logo: '/logos/very.svg' },
  'scan': { id: 'scan', name: 'Scan', abbreviation: 'SC', logo: '/logos/scan.svg' },
  'ikea': { id: 'ikea', name: 'IKEA', abbreviation: 'IK', logo: '/logos/ikea.svg' },
  'apple': { id: 'apple', name: 'Apple', abbreviation: 'AP', logo: '/logos/apple.svg' },
  'samsung': { id: 'samsung', name: 'Samsung', abbreviation: 'SM', logo: '/logos/samsung.svg' },
  'target': { id: 'target', name: 'Target', abbreviation: 'TG', logo: '/logos/target.svg' },
  'walmart': { id: 'walmart', name: 'Walmart', abbreviation: 'WM', logo: '/logos/walmart.svg' },
  'best buy': { id: 'bestbuy', name: 'Best Buy', abbreviation: 'BB', logo: '/logos/bestbuy.svg' },
  'bestbuy': { id: 'bestbuy', name: 'Best Buy', abbreviation: 'BB', logo: '/logos/bestbuy.svg' },
  'newegg': { id: 'newegg', name: 'Newegg', abbreviation: 'NE', logo: '/logos/newegg.svg' },
  'jumia': { id: 'jumia-gh', name: 'Jumia', abbreviation: 'JU', logo: '/logos/jumia-gh.svg' },
  'konga': { id: 'konga', name: 'Konga', abbreviation: 'KG', logo: '/logos/konga.svg' },
  'melcom': { id: 'melcom', name: 'Melcom', abbreviation: 'MC', logo: '/logos/melcom.svg' },
  'takealot': { id: 'takealot', name: 'Takealot', abbreviation: 'TA', logo: '/logos/takealot.svg' },
  'flipkart': { id: 'flipkart', name: 'Flipkart', abbreviation: 'FK', logo: '/logos/flipkart.svg' },
  'noon': { id: 'noon-ae', name: 'Noon', abbreviation: 'NN', logo: '/logos/noon-ae.svg' },
  'lazada': { id: 'lazada-sg', name: 'Lazada', abbreviation: 'LZ', logo: '/logos/lazada-sg.svg' },
  'shopee': { id: 'shopee-sg', name: 'Shopee', abbreviation: 'SH', logo: '/logos/shopee-sg.svg' },
  'mediamarkt': { id: 'mediamarkt-de', name: 'MediaMarkt', abbreviation: 'MM', logo: '/logos/mediamarkt-de.svg' },
  'fnac': { id: 'fnac', name: 'Fnac', abbreviation: 'FN', logo: '/logos/fnac.svg' },
  'jb hi-fi': { id: 'jbhifi', name: 'JB Hi-Fi', abbreviation: 'JB', logo: '/logos/jbhifi.svg' },
  'harvey norman': { id: 'harvey-norman', name: 'Harvey Norman', abbreviation: 'HN', logo: '/logos/harvey-norman.svg' },
  'slot': { id: 'slot-ng', name: 'Slot', abbreviation: 'SL', logo: '/logos/slot-ng.svg' },
};

export function guessStoreFromSource(source: string) {
  const lower = source.toLowerCase();
  for (const [key, info] of Object.entries(STORE_DOMAIN_MAP)) {
    if (lower.includes(key)) return info;
  }
  // No logo asset available for unrecognized retailers — img.logo.dev now requires
  // a paid API token (returns 401 unconditionally without one), so skip the guaranteed-failed
  // request and let callers render the initials badge directly.
  const abbr = source.slice(0, 2).toUpperCase();
  return {
    id: source.toLowerCase().replace(/\s+/g, '-'),
    name: source,
    abbreviation: abbr,
    logo: '',
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
    // No genuine RRP/"was" price is available from SerpAPI Google Shopping results.
    // Only claim a discount when we have a real second data point (a higher price
    // actually seen at another retailer) — never fabricate a markup.
    const storeCount = sorted.length;
    const rrpPence = storeCount > 1 ? highestPricePence : lowestPricePence;
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
  'mx', 'za', 'ng', 'ke', 'gh', 'eg', 'ae', 'sa',
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
