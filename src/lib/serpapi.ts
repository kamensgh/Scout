import type { Product, StorePrice, ProductCategory } from '@/types';
import { cachePut, makeStableId } from './serp-cache';

interface SerpApiShoppingResult {
  title: string;
  price?: string;
  extracted_price?: number;
  link?: string;
  product_link?: string;
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

const STORE_DOMAIN_MAP: Record<string, { id: string; name: string; abbreviation: string; logo: string }> = {
  'amazon': { id: 'amazon', name: 'Amazon', abbreviation: 'AMZ', logo: 'https://img.logo.dev/amazon.co.uk' },
  'currys': { id: 'currys', name: 'Currys', abbreviation: 'CU', logo: 'https://img.logo.dev/currys.co.uk' },
  'johnlewis': { id: 'johnlewis', name: 'John Lewis', abbreviation: 'JL', logo: 'https://img.logo.dev/johnlewis.com' },
  'john lewis': { id: 'johnlewis', name: 'John Lewis', abbreviation: 'JL', logo: 'https://img.logo.dev/johnlewis.com' },
  'argos': { id: 'argos', name: 'Argos', abbreviation: 'AR', logo: 'https://img.logo.dev/argos.co.uk' },
  'ebay': { id: 'ebay', name: 'eBay', abbreviation: 'EB', logo: 'https://img.logo.dev/ebay.co.uk' },
  'aO.com': { id: 'ao', name: 'AO', abbreviation: 'AO', logo: 'https://img.logo.dev/ao.com' },
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
};

function guessStoreFromSource(source: string) {
  const lower = source.toLowerCase();
  for (const [key, info] of Object.entries(STORE_DOMAIN_MAP)) {
    if (lower.includes(key)) return info;
  }
  const abbr = source.slice(0, 2).toUpperCase();
  const domain = source.toLowerCase().replace(/\s+/g, '') + '.com';
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

  // Try the requested country first if it's supported
  if (SUPPORTED_COUNTRIES.has(code)) {
    const results = await fetchShopping(query, code);
    if (results.length > 0) return results;
  }

  // Fall back through the chain until we get results
  for (const fallback of FALLBACK_CHAIN) {
    if (fallback === code) continue;
    const results = await fetchShopping(query, fallback);
    if (results.length > 0) return results;
  }

  return [];
}
