import { NextRequest, NextResponse } from 'next/server';
import { getRetailerById, isCuratedRetailerId } from '@/lib/retailers';

export const dynamic = 'force-dynamic';

export interface StoreCategory {
  id: string;
  label: string;
  description: string;
  externalUrl: string;
  searchQuery: string;
}

interface SerpResult {
  title?: string;
  link?: string;
  snippet?: string;
  sitelinks?: {
    inline?: { title: string; link?: string; snippet?: string }[];
    expanded?: { title: string; link?: string; snippet?: string }[];
  };
}

// Words that definitively indicate a non-category page
const SKIP_WORDS = [
  'cart', 'login', 'signin', 'register', 'account', 'profile',
  'help', 'support', 'about', 'contact', 'press', 'careers', 'jobs',
  'blog', 'news', 'article', 'track', 'order', 'checkout', 'faq',
  'policy', 'terms', 'privacy', 'sitemap', 'wishlist', 'favourite',
  'vendor', 'seller', 'promotion', 'deal', 'flash', 'test', 'counterfeits',
  'vendorhub', 'business', 'techtalk', 'store-finder', 'bruhm',
  'insurance', 'voucher', 'gift-card', 'gift-vouche', 'credit', 'finance', 'loan',
  '/p/', '/pd/', '/product/', '/products/', '/item/', '/items/', '/prd/', '/prod/',
];

// URL path segments that indicate a category page
const CATEGORY_PATH_HINTS = [
  '/categories/', '/category/', '/departments/', '/department/',
  '/collections/', '/collection/', '/shop/', '/browse/', '/cat/', '/c/',
];

function hasCategoryPath(url: string): boolean {
  const lower = url.toLowerCase();
  return CATEGORY_PATH_HINTS.some(p => lower.includes(p));
}

function isProductTitle(title: string): boolean {
  // Weight/volume/size units → product
  if (/\b\d+\s*(g|kg|ml|cl|l|mg|oz|lb|lbs|watt|w)\b/i.test(title)) return true;
  // Pack/unit counts → product
  if (/\b\d+\s*(pack|pcs|pieces|units|count|ct|pk)\b/i.test(title)) return true;
  // Product attribute prefixes
  if (/\b(brand|net weight|weight|model|sku|ref)\s*:/i.test(title)) return true;
  // More than 5 words → product description, not a category name
  if (title.trim().split(/\s+/).length > 5) return true;
  return false;
}

function matchesMainDomain(url: string, domain: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host === domain || host === `www.${domain}`;
  } catch { return false; }
}

function getPathSegments(url: string): string[] {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\.html?$/, '').replace(/\/$/, '');
    return path.split('/').filter(Boolean);
  } catch { return []; }
}

function isSkipped(url: string): boolean {
  const lower = url.toLowerCase();
  return SKIP_WORDS.some(w => lower.includes(w));
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*[-–|]\s*(CATEGORIES|CATEGORY|DEPARTMENTS?|CATALOG|SHOP|BROWSE)\s*$/i, '')
    .replace(/\s*[-–|]\s*[A-Z][A-Z ]{3,}\s*$/g, '')  // strip trailing ALLCAPS brand suffix
    .replace(/\s*\|\s*.*$/, '')
    .trim();
}

function domainOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

async function googleSearch(q: string, gl: string, apiKey: string): Promise<SerpResult[]> {
  const params = new URLSearchParams({
    engine: 'google', q, hl: 'en', gl, api_key: apiKey, num: '20',
  });
  try {
    const res = await fetch(`https://serpapi.com/search.json?${params}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.organic_results || [];
  } catch { return []; }
}

function extractCategories(
  results: SerpResult[],
  domain: string,
  storeName: string,
  seen: Set<string>,
  out: StoreCategory[],
  maxDepth: number,
  requireCategoryPath: boolean,
) {
  for (const r of results) {
    const link = r.link || '';
    if (!link || isSkipped(link)) continue;
    if (!matchesMainDomain(link, domain)) continue;
    if (requireCategoryPath && !hasCategoryPath(link)) continue;

    const segments = getPathSegments(link);
    if (segments.length === 0 || segments.length > maxDepth) continue;

    const cleanUrl = link.split('?')[0].replace(/\/$/, '');
    const key = cleanUrl.toLowerCase();
    if (seen.has(key)) continue;

    const label = cleanTitle(r.title || segments[segments.length - 1].replace(/-/g, ' '));
    if (!label || label.length < 2) continue;
    if (isProductTitle(label)) continue;

    // Reject pages that look like products (numeric slug, very long slug)
    const lastSeg = segments[segments.length - 1];
    if (/^\d+$/.test(lastSeg)) continue;
    if (lastSeg.length > 60) continue;

    seen.add(key);
    out.push({
      id: `cat-${out.length}`,
      label,
      description: '',
      externalUrl: cleanUrl,
      searchQuery: `${storeName} ${label}`,
    });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const country = req.nextUrl.searchParams.get('country') || 'gb';
  const gl = country.toLowerCase();

  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) return NextResponse.json({ data: [], error: 'API not configured' });

  let storeName = '';
  let storeDomain = '';

  if (isCuratedRetailerId(id)) {
    const retailer = getRetailerById(id);
    if (!retailer) return NextResponse.json({ data: [], error: 'Store not found' }, { status: 404 });
    storeName = retailer.name;
    storeDomain = domainOf(retailer.url);
  } else {
    storeName = req.nextUrl.searchParams.get('storeName') || '';
    const website = req.nextUrl.searchParams.get('website') || '';
    storeDomain = domainOf(website);
  }

  if (!storeName) return NextResponse.json({ data: [], error: 'Store name required' });

  const categories: StoreCategory[] = [];
  const seen = new Set<string>();

  // Run up to 3 parallel searches with different strategies
  const queries: string[] = [storeName];
  if (storeDomain) {
    queries.push(`${storeDomain} categories`);
    queries.push(`site:${storeDomain}`);
  }

  const allSearches = await Promise.all(
    queries.map(q => googleSearch(q, gl, apiKey))
  );

  // Strategy A: sitelinks from branded search (first result of first query)
  // These are Google-curated and exactly what we want — trust them completely.
  const firstResult = allSearches[0]?.[0];
  const sitelinks = [
    ...(firstResult?.sitelinks?.inline || []),
    ...(firstResult?.sitelinks?.expanded || []),
  ];
  for (const sl of sitelinks) {
    if (!sl.title || !sl.link) continue;
    if (isSkipped(sl.link)) continue;
    const label = cleanTitle(sl.title);
    // Skip generic index pages like "Categories" or "Departments"
    if (!label || /^(categories|category|departments?|all products?|shop all)$/i.test(label)) continue;
    if (isProductTitle(label)) continue;
    const key = sl.link.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    categories.push({
      id: `sl-${categories.length}`,
      label,
      description: '',
      externalUrl: sl.link,
      searchQuery: `${storeName} ${label}`,
    });
  }

  // If sitelinks gave us 3+ categories, they are authoritative — stop here.
  // Running organic fallbacks risks adding product pages that share the same URL patterns.
  if (categories.length >= 3) {
    return NextResponse.json({ data: categories.slice(0, 10), error: null });
  }

  const combined = allSearches.flat();

  // Fallback B: only URLs with explicit category path patterns (depth ≤ 3)
  extractCategories(combined, storeDomain, storeName, seen, categories, 3, true);

  // Fallback C: depth-1 paths if still sparse
  if (categories.length < 3) {
    extractCategories(combined, storeDomain, storeName, seen, categories, 1, false);
  }

  return NextResponse.json({ data: categories.slice(0, 10), error: null });
}
