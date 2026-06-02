export interface Retailer {
  id: string;
  name: string;
  abbreviation: string;
  logo: string;
  url: string;
  countries: string[]; // ISO 3166-1 alpha-2 lowercase
  searchPrefix: string; // prepended to SerpAPI query
  searchSuffix?: string; // appended (e.g. location hint)
  priority: number; // higher = shown first within country
  verified: boolean;
  deliveryDays?: number;
  tagline?: string;
  categories?: string[]; // null = all categories
}

export const ONLINE_RETAILERS: Retailer[] = [
  // ── Ghana ──────────────────────────────────────────────────
  {
    id: 'jumia-gh', name: 'Jumia', abbreviation: 'JU',
    logo: 'https://img.logo.dev/jumia.com.gh',
    url: 'https://www.jumia.com.gh',
    countries: ['gh'], searchPrefix: 'jumia',
    priority: 100, verified: true, deliveryDays: 3,
    tagline: "Ghana's #1 online store",
  },
  {
    id: 'melcom', name: 'Melcom', abbreviation: 'MC',
    logo: 'https://img.logo.dev/melcom.com.gh',
    url: 'https://melcom.com',
    countries: ['gh'], searchPrefix: 'melcom',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Electronics & appliances',
  },
  {
    id: 'telefonika', name: 'Telefonika', abbreviation: 'TF',
    logo: 'https://img.logo.dev/telefonika.com',
    url: 'https://telefonika.com',
    countries: ['gh'], searchPrefix: 'telefonika',
    priority: 80, verified: true, deliveryDays: 1,
    tagline: 'Phones & accessories',
    categories: ['computing', 'audio'],
  },
  {
    id: 'electromart-gh', name: 'Electromart', abbreviation: 'EM',
    logo: 'https://img.logo.dev/electromart.com.gh',
    url: 'https://electromart.com.gh',
    countries: ['gh'], searchPrefix: '',
    priority: 70, verified: false, deliveryDays: 3,
    tagline: 'Electronics & gadgets',
  },
  {
    id: 'tonaton', name: 'Tonaton', abbreviation: 'TN',
    logo: 'https://img.logo.dev/tonaton.com',
    url: 'https://tonaton.com',
    countries: ['gh'], searchPrefix: '',
    priority: 60, verified: false, deliveryDays: 5,
    tagline: 'Buy & sell locally',
  },
  {
    id: 'franko-gh', name: 'Franko Trading', abbreviation: 'FR',
    logo: 'https://img.logo.dev/frankotradingenterprise.com',
    url: 'https://frankotradingenterprise.com',
    countries: ['gh'], searchPrefix: '',
    priority: 55, verified: false, deliveryDays: 2,
    tagline: 'Official phone distributor',
    categories: ['computing'],
  },

  // ── Nigeria ─────────────────────────────────────────────────
  {
    id: 'jumia-ng', name: 'Jumia', abbreviation: 'JU',
    logo: 'https://img.logo.dev/jumia.com.ng',
    url: 'https://www.jumia.com.ng',
    countries: ['ng'], searchPrefix: 'jumia',
    priority: 100, verified: true, deliveryDays: 3,
    tagline: "Nigeria's #1 online store",
  },
  {
    id: 'konga', name: 'Konga', abbreviation: 'KG',
    logo: 'https://img.logo.dev/konga.com',
    url: 'https://www.konga.com',
    countries: ['ng'], searchPrefix: 'konga',
    priority: 90, verified: true, deliveryDays: 3,
    tagline: 'Shop smarter, live better',
  },
  {
    id: 'slot-ng', name: 'Slot Systems', abbreviation: 'SL',
    logo: 'https://img.logo.dev/slot.ng',
    url: 'https://www.slot.ng',
    countries: ['ng'], searchPrefix: 'slot phones',
    priority: 80, verified: true, deliveryDays: 1,
    tagline: 'Phones & accessories',
    categories: ['computing', 'audio'],
  },

  // ── South Africa ────────────────────────────────────────────
  {
    id: 'takealot', name: 'Takealot', abbreviation: 'TA',
    logo: 'https://img.logo.dev/takealot.com',
    url: 'https://www.takealot.com',
    countries: ['za'], searchPrefix: 'takealot',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: "South Africa's largest online store",
  },
  {
    id: 'game-za', name: 'Game Stores', abbreviation: 'GM',
    logo: 'https://img.logo.dev/game.co.za',
    url: 'https://www.game.co.za',
    countries: ['za'], searchPrefix: '',
    priority: 90, verified: true, deliveryDays: 3,
    tagline: 'Electronics & home',
  },
  {
    id: 'incredible-connection', name: 'Incredible Connection', abbreviation: 'IC',
    logo: 'https://img.logo.dev/incredible.co.za',
    url: 'https://www.incredible.co.za',
    countries: ['za'], searchPrefix: '',
    priority: 80, verified: true, deliveryDays: 2,
    tagline: 'Technology superstore',
  },

  // ── Kenya ───────────────────────────────────────────────────
  {
    id: 'jumia-ke', name: 'Jumia', abbreviation: 'JU',
    logo: 'https://img.logo.dev/jumia.co.ke',
    url: 'https://www.jumia.co.ke',
    countries: ['ke'], searchPrefix: 'jumia',
    priority: 100, verified: true, deliveryDays: 3,
    tagline: "Kenya's #1 online store",
  },
  {
    id: 'kilimall', name: 'Kilimall', abbreviation: 'KM',
    logo: 'https://img.logo.dev/kilimall.co.ke',
    url: 'https://www.kilimall.co.ke',
    countries: ['ke'], searchPrefix: '',
    priority: 80, verified: false, deliveryDays: 4,
    tagline: 'Online shopping in Kenya',
  },

  // ── United Kingdom ──────────────────────────────────────────
  {
    id: 'amazon-uk', name: 'Amazon', abbreviation: 'AMZ',
    logo: 'https://img.logo.dev/amazon.co.uk',
    url: 'https://www.amazon.co.uk',
    countries: ['gb', 'ie'], searchPrefix: 'amazon uk',
    priority: 100, verified: true, deliveryDays: 1,
    tagline: 'Fast & free delivery on millions of items',
  },
  {
    id: 'currys', name: 'Currys', abbreviation: 'CU',
    logo: 'https://img.logo.dev/currys.co.uk',
    url: 'https://www.currys.co.uk',
    countries: ['gb', 'ie'], searchPrefix: 'currys',
    priority: 95, verified: true, deliveryDays: 1,
    tagline: "UK's largest electronics retailer",
    categories: ['audio', 'computing', 'tvs', 'home', 'kitchen'],
  },
  {
    id: 'johnlewis', name: 'John Lewis', abbreviation: 'JL',
    logo: 'https://img.logo.dev/johnlewis.com',
    url: 'https://www.johnlewis.com',
    countries: ['gb'], searchPrefix: 'john lewis',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Quality & value, never knowingly undersold',
  },
  {
    id: 'argos', name: 'Argos', abbreviation: 'AR',
    logo: 'https://img.logo.dev/argos.co.uk',
    url: 'https://www.argos.co.uk',
    countries: ['gb'], searchPrefix: 'argos uk',
    priority: 85, verified: true, deliveryDays: 1,
    tagline: 'Fast home delivery or store collection',
  },
  {
    id: 'ao', name: 'AO', abbreviation: 'AO',
    logo: 'https://img.logo.dev/ao.com',
    url: 'https://ao.com',
    countries: ['gb', 'de'], searchPrefix: 'ao.com',
    priority: 75, verified: true, deliveryDays: 1,
    tagline: 'Large appliances & TVs',
    categories: ['home', 'kitchen', 'tvs'],
  },
  {
    id: 'very', name: 'Very', abbreviation: 'VR',
    logo: 'https://img.logo.dev/very.co.uk',
    url: 'https://www.very.co.uk',
    countries: ['gb'], searchPrefix: 'very.co.uk',
    priority: 70, verified: true, deliveryDays: 2,
    tagline: 'Fashion, tech & homeware',
  },
  {
    id: 'scan', name: 'Scan', abbreviation: 'SC',
    logo: 'https://img.logo.dev/scan.co.uk',
    url: 'https://www.scan.co.uk',
    countries: ['gb'], searchPrefix: 'scan.co.uk',
    priority: 65, verified: false, deliveryDays: 1,
    tagline: 'PC components & tech',
    categories: ['computing'],
  },

  // ── Germany ─────────────────────────────────────────────────
  {
    id: 'amazon-de', name: 'Amazon', abbreviation: 'AMZ',
    logo: 'https://img.logo.dev/amazon.de',
    url: 'https://www.amazon.de',
    countries: ['de', 'at', 'ch'], searchPrefix: 'amazon',
    priority: 100, verified: true, deliveryDays: 1,
    tagline: 'Schnelle Lieferung, riesige Auswahl',
  },
  {
    id: 'mediamarkt-de', name: 'MediaMarkt', abbreviation: 'MM',
    logo: 'https://img.logo.dev/mediamarkt.de',
    url: 'https://www.mediamarkt.de',
    countries: ['de', 'at', 'nl', 'be', 'es', 'pt'], searchPrefix: 'mediamarkt',
    priority: 95, verified: true, deliveryDays: 2,
    tagline: 'Electronics & tech Europe',
    categories: ['audio', 'computing', 'tvs', 'home', 'kitchen'],
  },
  {
    id: 'saturn', name: 'Saturn', abbreviation: 'SA',
    logo: 'https://img.logo.dev/saturn.de',
    url: 'https://www.saturn.de',
    countries: ['de', 'at'], searchPrefix: 'saturn electronics',
    priority: 85, verified: true, deliveryDays: 2,
    tagline: 'Geiz ist geil',
    categories: ['audio', 'computing', 'tvs', 'home'],
  },

  // ── France ──────────────────────────────────────────────────
  {
    id: 'amazon-fr', name: 'Amazon', abbreviation: 'AMZ',
    logo: 'https://img.logo.dev/amazon.fr',
    url: 'https://www.amazon.fr',
    countries: ['fr'], searchPrefix: 'amazon',
    priority: 100, verified: true, deliveryDays: 1,
    tagline: 'Livraison rapide, vaste sélection',
  },
  {
    id: 'fnac', name: 'Fnac', abbreviation: 'FN',
    logo: 'https://img.logo.dev/fnac.com',
    url: 'https://www.fnac.com',
    countries: ['fr', 'be', 'pt', 'es'], searchPrefix: 'fnac',
    priority: 95, verified: true, deliveryDays: 2,
    tagline: 'Cultura & tech',
    categories: ['audio', 'computing', 'tvs'],
  },
  {
    id: 'cdiscount', name: 'Cdiscount', abbreviation: 'CD',
    logo: 'https://img.logo.dev/cdiscount.com',
    url: 'https://www.cdiscount.com',
    countries: ['fr'], searchPrefix: 'cdiscount',
    priority: 80, verified: true, deliveryDays: 3,
    tagline: 'Prix bas garantis',
  },

  // ── United States ───────────────────────────────────────────
  {
    id: 'amazon-us', name: 'Amazon', abbreviation: 'AMZ',
    logo: 'https://img.logo.dev/amazon.com',
    url: 'https://www.amazon.com',
    countries: ['us'], searchPrefix: 'amazon',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: 'Fast, free delivery with Prime',
  },
  {
    id: 'bestbuy', name: 'Best Buy', abbreviation: 'BB',
    logo: 'https://img.logo.dev/bestbuy.com',
    url: 'https://www.bestbuy.com',
    countries: ['us'], searchPrefix: 'best buy',
    priority: 95, verified: true, deliveryDays: 2,
    tagline: "America's leading tech retailer",
    categories: ['audio', 'computing', 'tvs', 'home', 'kitchen'],
  },
  {
    id: 'walmart', name: 'Walmart', abbreviation: 'WM',
    logo: 'https://img.logo.dev/walmart.com',
    url: 'https://www.walmart.com',
    countries: ['us'], searchPrefix: 'walmart',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Save money. Live better.',
  },
  {
    id: 'target', name: 'Target', abbreviation: 'TG',
    logo: 'https://img.logo.dev/target.com',
    url: 'https://www.target.com',
    countries: ['us'], searchPrefix: 'target.com',
    priority: 80, verified: true, deliveryDays: 2,
    tagline: 'Expect more. Pay less.',
  },
  {
    id: 'bh-photo', name: 'B&H Photo', abbreviation: 'BH',
    logo: 'https://img.logo.dev/bhphotovideo.com',
    url: 'https://www.bhphotovideo.com',
    countries: ['us'], searchPrefix: 'bhphotovideo',
    priority: 70, verified: true, deliveryDays: 3,
    tagline: 'Cameras, audio & pro tech',
    categories: ['computing', 'audio', 'tvs'],
  },
  {
    id: 'newegg', name: 'Newegg', abbreviation: 'NE',
    logo: 'https://img.logo.dev/newegg.com',
    url: 'https://www.newegg.com',
    countries: ['us', 'ca'], searchPrefix: 'newegg',
    priority: 65, verified: true, deliveryDays: 3,
    tagline: 'PC components & electronics',
    categories: ['computing'],
  },

  // ── Canada ──────────────────────────────────────────────────
  {
    id: 'amazon-ca', name: 'Amazon', abbreviation: 'AMZ',
    logo: 'https://img.logo.dev/amazon.ca',
    url: 'https://www.amazon.ca',
    countries: ['ca'], searchPrefix: 'amazon',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: 'Fast delivery across Canada',
  },
  {
    id: 'bestbuy-ca', name: 'Best Buy', abbreviation: 'BB',
    logo: 'https://img.logo.dev/bestbuy.ca',
    url: 'https://www.bestbuy.ca',
    countries: ['ca'], searchPrefix: 'best buy',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Canada\'s electronics superstore',
    categories: ['audio', 'computing', 'tvs', 'home'],
  },

  // ── Australia ───────────────────────────────────────────────
  {
    id: 'jbhifi', name: 'JB Hi-Fi', abbreviation: 'JB',
    logo: 'https://img.logo.dev/jbhifi.com.au',
    url: 'https://www.jbhifi.com.au',
    countries: ['au', 'nz'], searchPrefix: 'jb hifi',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: "Australia's home of entertainment",
    categories: ['audio', 'computing', 'tvs', 'home'],
  },
  {
    id: 'harvey-norman', name: 'Harvey Norman', abbreviation: 'HN',
    logo: 'https://img.logo.dev/harveynorman.com.au',
    url: 'https://www.harveynorman.com.au',
    countries: ['au', 'nz', 'ie'], searchPrefix: 'harvey norman',
    priority: 90, verified: true, deliveryDays: 3,
    tagline: 'Electronics, furniture & appliances',
  },
  {
    id: 'kogan', name: 'Kogan', abbreviation: 'KO',
    logo: 'https://img.logo.dev/kogan.com',
    url: 'https://www.kogan.com',
    countries: ['au', 'nz'], searchPrefix: 'kogan',
    priority: 80, verified: true, deliveryDays: 3,
    tagline: 'Unbeatable prices online',
  },

  // ── India ───────────────────────────────────────────────────
  {
    id: 'flipkart', name: 'Flipkart', abbreviation: 'FK',
    logo: 'https://img.logo.dev/flipkart.com',
    url: 'https://www.flipkart.com',
    countries: ['in'], searchPrefix: 'flipkart',
    priority: 100, verified: true, deliveryDays: 3,
    tagline: "India's leading marketplace",
  },
  {
    id: 'amazon-in', name: 'Amazon', abbreviation: 'AMZ',
    logo: 'https://img.logo.dev/amazon.in',
    url: 'https://www.amazon.in',
    countries: ['in'], searchPrefix: 'amazon',
    priority: 95, verified: true, deliveryDays: 2,
    tagline: 'Fast delivery across India',
  },
  {
    id: 'croma', name: 'Croma', abbreviation: 'CR',
    logo: 'https://img.logo.dev/croma.com',
    url: 'https://www.croma.com',
    countries: ['in'], searchPrefix: 'croma electronics',
    priority: 80, verified: true, deliveryDays: 2,
    tagline: 'Tata electronics superstore',
    categories: ['audio', 'computing', 'tvs', 'home', 'kitchen'],
  },

  // ── UAE ─────────────────────────────────────────────────────
  {
    id: 'noon-ae', name: 'Noon', abbreviation: 'NN',
    logo: 'https://img.logo.dev/noon.com',
    url: 'https://www.noon.com',
    countries: ['ae', 'sa', 'eg'], searchPrefix: 'noon',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: "The Middle East's marketplace",
  },
  {
    id: 'sharaf-dg', name: 'Sharaf DG', abbreviation: 'DG',
    logo: 'https://img.logo.dev/sharafdg.com',
    url: 'https://www.sharafdg.com',
    countries: ['ae', 'sa', 'eg'], searchPrefix: 'sharaf dg',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Electronics & tech UAE',
    categories: ['audio', 'computing', 'tvs', 'home'],
  },
  {
    id: 'amazon-ae', name: 'Amazon', abbreviation: 'AMZ',
    logo: 'https://img.logo.dev/amazon.ae',
    url: 'https://www.amazon.ae',
    countries: ['ae'], searchPrefix: 'amazon',
    priority: 85, verified: true, deliveryDays: 2,
    tagline: 'Fast delivery across UAE',
  },

  // ── Singapore ───────────────────────────────────────────────
  {
    id: 'lazada-sg', name: 'Lazada', abbreviation: 'LZ',
    logo: 'https://img.logo.dev/lazada.sg',
    url: 'https://www.lazada.sg',
    countries: ['sg'], searchPrefix: 'lazada',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: "Southeast Asia's #1 marketplace",
  },
  {
    id: 'shopee-sg', name: 'Shopee', abbreviation: 'SH',
    logo: 'https://img.logo.dev/shopee.sg',
    url: 'https://shopee.sg',
    countries: ['sg'], searchPrefix: 'shopee',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Shop everything online',
  },
  {
    id: 'courts-sg', name: 'Courts', abbreviation: 'CT',
    logo: 'https://img.logo.dev/courts.com.sg',
    url: 'https://www.courts.com.sg',
    countries: ['sg'], searchPrefix: 'courts electronics',
    priority: 80, verified: true, deliveryDays: 3,
    tagline: 'Electronics & furniture',
    categories: ['audio', 'computing', 'tvs', 'home', 'kitchen', 'furniture'],
  },
];

export function getRetailersForCountry(countryCode: string): Retailer[] {
  const code = countryCode.toLowerCase();
  return ONLINE_RETAILERS
    .filter(r => r.countries.includes(code))
    .sort((a, b) => b.priority - a.priority);
}

export function getRetailerById(id: string): Retailer | undefined {
  return ONLINE_RETAILERS.find(r => r.id === id);
}

// Returns true if the ID looks like a curated retailer (not a Google Places ID)
export function isCuratedRetailerId(id: string): boolean {
  return ONLINE_RETAILERS.some(r => r.id === id);
}
