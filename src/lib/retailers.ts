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
    logo: '/logos/jumia-gh.svg',
    url: 'https://www.jumia.com.gh',
    countries: ['gh'], searchPrefix: 'jumia',
    priority: 100, verified: true, deliveryDays: 3,
    tagline: "Ghana's #1 online store",
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'melcom', name: 'Melcom', abbreviation: 'MC',
    logo: '/logos/melcom.svg',
    url: 'https://melcom.com',
    countries: ['gh'], searchPrefix: 'melcom',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Electronics & appliances',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'diy', 'sports'],
  },
  {
    id: 'telefonika', name: 'Telefonika', abbreviation: 'TF',
    logo: '/logos/telefonika.svg',
    url: 'https://telefonika.com',
    countries: ['gh'], searchPrefix: 'telefonika',
    priority: 80, verified: true, deliveryDays: 1,
    tagline: 'Phones & accessories',
    categories: ['computing', 'audio'],
  },
  {
    id: 'electromart-gh', name: 'Electromart', abbreviation: 'EM',
    logo: '/logos/electromart-gh.svg',
    url: 'https://electromart.com.gh',
    countries: ['gh'], searchPrefix: '',
    priority: 70, verified: false, deliveryDays: 3,
    tagline: 'Electronics & gadgets',
    categories: ['computing', 'audio', 'tvs', 'home'],
  },
  {
    id: 'tonaton', name: 'Tonaton', abbreviation: 'TN',
    logo: '/logos/tonaton.svg',
    url: 'https://tonaton.com',
    countries: ['gh'], searchPrefix: '',
    priority: 60, verified: false, deliveryDays: 5,
    tagline: 'Buy & sell locally',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'franko-gh', name: 'Franko Trading', abbreviation: 'FR',
    logo: '/logos/franko-gh.svg',
    url: 'https://frankotradingenterprise.com',
    countries: ['gh'], searchPrefix: '',
    priority: 55, verified: false, deliveryDays: 2,
    tagline: 'Official phone distributor',
    categories: ['computing'],
  },

  // ── Nigeria ─────────────────────────────────────────────────
  {
    id: 'jumia-ng', name: 'Jumia', abbreviation: 'JU',
    logo: '/logos/jumia-ng.svg',
    url: 'https://www.jumia.com.ng',
    countries: ['ng'], searchPrefix: 'jumia',
    priority: 100, verified: true, deliveryDays: 3,
    tagline: "Nigeria's #1 online store",
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'konga', name: 'Konga', abbreviation: 'KG',
    logo: '/logos/konga.svg',
    url: 'https://www.konga.com',
    countries: ['ng'], searchPrefix: 'konga',
    priority: 90, verified: true, deliveryDays: 3,
    tagline: 'Shop smarter, live better',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture'],
  },
  {
    id: 'slot-ng', name: 'Slot Systems', abbreviation: 'SL',
    logo: '/logos/slot-ng.svg',
    url: 'https://www.slot.ng',
    countries: ['ng'], searchPrefix: 'slot phones',
    priority: 80, verified: true, deliveryDays: 1,
    tagline: 'Phones & accessories',
    categories: ['computing', 'audio'],
  },

  // ── South Africa ────────────────────────────────────────────
  {
    id: 'takealot', name: 'Takealot', abbreviation: 'TA',
    logo: '/logos/takealot.svg',
    url: 'https://www.takealot.com',
    countries: ['za'], searchPrefix: 'takealot',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: "South Africa's largest online store",
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'game-za', name: 'Game Stores', abbreviation: 'GM',
    logo: '/logos/game-za.svg',
    url: 'https://www.game.co.za',
    countries: ['za'], searchPrefix: '',
    priority: 90, verified: true, deliveryDays: 3,
    tagline: 'Electronics & home',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'incredible-connection', name: 'Incredible Connection', abbreviation: 'IC',
    logo: '/logos/incredible-connection.svg',
    url: 'https://www.incredible.co.za',
    countries: ['za'], searchPrefix: '',
    priority: 80, verified: true, deliveryDays: 2,
    tagline: 'Technology superstore',
    categories: ['computing', 'audio', 'tvs'],
  },

  // ── Kenya ───────────────────────────────────────────────────
  {
    id: 'jumia-ke', name: 'Jumia', abbreviation: 'JU',
    logo: '/logos/jumia-ke.svg',
    url: 'https://www.jumia.co.ke',
    countries: ['ke'], searchPrefix: 'jumia',
    priority: 100, verified: true, deliveryDays: 3,
    tagline: "Kenya's #1 online store",
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'kilimall', name: 'Kilimall', abbreviation: 'KM',
    logo: '/logos/kilimall.svg',
    url: 'https://www.kilimall.co.ke',
    countries: ['ke'], searchPrefix: '',
    priority: 80, verified: false, deliveryDays: 4,
    tagline: 'Online shopping in Kenya',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen'],
  },

  // ── United Kingdom ──────────────────────────────────────────
  {
    id: 'amazon-uk', name: 'Amazon', abbreviation: 'AMZ',
    logo: '/logos/amazon-uk.svg',
    url: 'https://www.amazon.co.uk',
    countries: ['gb', 'ie'], searchPrefix: 'amazon uk',
    priority: 100, verified: true, deliveryDays: 1,
    tagline: 'Fast & free delivery on millions of items',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'diy', 'sports'],
  },
  {
    id: 'currys', name: 'Currys', abbreviation: 'CU',
    logo: '/logos/currys.svg',
    url: 'https://www.currys.co.uk',
    countries: ['gb', 'ie'], searchPrefix: 'currys',
    priority: 95, verified: true, deliveryDays: 1,
    tagline: "UK's largest electronics retailer",
    categories: ['audio', 'computing', 'tvs', 'home', 'kitchen'],
  },
  {
    id: 'johnlewis', name: 'John Lewis', abbreviation: 'JL',
    logo: '/logos/johnlewis.svg',
    url: 'https://www.johnlewis.com',
    countries: ['gb'], searchPrefix: 'john lewis',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Quality & value, never knowingly undersold',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'argos', name: 'Argos', abbreviation: 'AR',
    logo: '/logos/argos.svg',
    url: 'https://www.argos.co.uk',
    countries: ['gb'], searchPrefix: 'argos uk',
    priority: 85, verified: true, deliveryDays: 1,
    tagline: 'Fast home delivery or store collection',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'diy', 'sports'],
  },
  {
    id: 'ao', name: 'AO', abbreviation: 'AO',
    logo: '/logos/ao.svg',
    url: 'https://ao.com',
    countries: ['gb', 'de'], searchPrefix: 'ao.com',
    priority: 75, verified: true, deliveryDays: 1,
    tagline: 'Large appliances & TVs',
    categories: ['home', 'kitchen', 'tvs'],
  },
  {
    id: 'very', name: 'Very', abbreviation: 'VR',
    logo: '/logos/very.svg',
    url: 'https://www.very.co.uk',
    countries: ['gb'], searchPrefix: 'very.co.uk',
    priority: 70, verified: true, deliveryDays: 2,
    tagline: 'Fashion, tech & homeware',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'scan', name: 'Scan', abbreviation: 'SC',
    logo: '/logos/scan.svg',
    url: 'https://www.scan.co.uk',
    countries: ['gb'], searchPrefix: 'scan.co.uk',
    priority: 65, verified: false, deliveryDays: 1,
    tagline: 'PC components & tech',
    categories: ['computing'],
  },

  // ── Germany ─────────────────────────────────────────────────
  {
    id: 'amazon-de', name: 'Amazon', abbreviation: 'AMZ',
    logo: '/logos/amazon-de.svg',
    url: 'https://www.amazon.de',
    countries: ['de', 'at', 'ch'], searchPrefix: 'amazon',
    priority: 100, verified: true, deliveryDays: 1,
    tagline: 'Schnelle Lieferung, riesige Auswahl',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'diy', 'sports'],
  },
  {
    id: 'mediamarkt-de', name: 'MediaMarkt', abbreviation: 'MM',
    logo: '/logos/mediamarkt-de.svg',
    url: 'https://www.mediamarkt.de',
    countries: ['de', 'at', 'nl', 'be', 'es', 'pt'], searchPrefix: 'mediamarkt',
    priority: 95, verified: true, deliveryDays: 2,
    tagline: 'Electronics & tech Europe',
    categories: ['audio', 'computing', 'tvs', 'home', 'kitchen'],
  },
  {
    id: 'saturn', name: 'Saturn', abbreviation: 'SA',
    logo: '/logos/saturn.svg',
    url: 'https://www.saturn.de',
    countries: ['de', 'at'], searchPrefix: 'saturn electronics',
    priority: 85, verified: true, deliveryDays: 2,
    tagline: 'Geiz ist geil',
    categories: ['audio', 'computing', 'tvs', 'home'],
  },

  // ── France ──────────────────────────────────────────────────
  {
    id: 'amazon-fr', name: 'Amazon', abbreviation: 'AMZ',
    logo: '/logos/amazon-fr.svg',
    url: 'https://www.amazon.fr',
    countries: ['fr'], searchPrefix: 'amazon',
    priority: 100, verified: true, deliveryDays: 1,
    tagline: 'Livraison rapide, vaste sélection',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'diy', 'sports'],
  },
  {
    id: 'fnac', name: 'Fnac', abbreviation: 'FN',
    logo: '/logos/fnac.svg',
    url: 'https://www.fnac.com',
    countries: ['fr', 'be', 'pt', 'es'], searchPrefix: 'fnac',
    priority: 95, verified: true, deliveryDays: 2,
    tagline: 'Cultura & tech',
    categories: ['audio', 'computing', 'tvs'],
  },
  {
    id: 'cdiscount', name: 'Cdiscount', abbreviation: 'CD',
    logo: '/logos/cdiscount.svg',
    url: 'https://www.cdiscount.com',
    countries: ['fr'], searchPrefix: 'cdiscount',
    priority: 80, verified: true, deliveryDays: 3,
    tagline: 'Prix bas garantis',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture'],
  },

  // ── United States ───────────────────────────────────────────
  {
    id: 'amazon-us', name: 'Amazon', abbreviation: 'AMZ',
    logo: '/logos/amazon-us.svg',
    url: 'https://www.amazon.com',
    countries: ['us'], searchPrefix: 'amazon',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: 'Fast, free delivery with Prime',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'diy', 'sports'],
  },
  {
    id: 'bestbuy', name: 'Best Buy', abbreviation: 'BB',
    logo: '/logos/bestbuy.svg',
    url: 'https://www.bestbuy.com',
    countries: ['us'], searchPrefix: 'best buy',
    priority: 95, verified: true, deliveryDays: 2,
    tagline: "America's leading tech retailer",
    categories: ['audio', 'computing', 'tvs', 'home', 'kitchen'],
  },
  {
    id: 'walmart', name: 'Walmart', abbreviation: 'WM',
    logo: '/logos/walmart.svg',
    url: 'https://www.walmart.com',
    countries: ['us'], searchPrefix: 'walmart',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Save money. Live better.',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'diy', 'sports'],
  },
  {
    id: 'target', name: 'Target', abbreviation: 'TG',
    logo: '/logos/target.svg',
    url: 'https://www.target.com',
    countries: ['us'], searchPrefix: 'target.com',
    priority: 80, verified: true, deliveryDays: 2,
    tagline: 'Expect more. Pay less.',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'bh-photo', name: 'B&H Photo', abbreviation: 'BH',
    logo: '/logos/bh-photo.svg',
    url: 'https://www.bhphotovideo.com',
    countries: ['us'], searchPrefix: 'bhphotovideo',
    priority: 70, verified: true, deliveryDays: 3,
    tagline: 'Cameras, audio & pro tech',
    categories: ['computing', 'audio', 'tvs'],
  },
  {
    id: 'newegg', name: 'Newegg', abbreviation: 'NE',
    logo: '/logos/newegg.svg',
    url: 'https://www.newegg.com',
    countries: ['us', 'ca'], searchPrefix: 'newegg',
    priority: 65, verified: true, deliveryDays: 3,
    tagline: 'PC components & electronics',
    categories: ['computing'],
  },

  // ── Canada ──────────────────────────────────────────────────
  {
    id: 'amazon-ca', name: 'Amazon', abbreviation: 'AMZ',
    logo: '/logos/amazon-ca.svg',
    url: 'https://www.amazon.ca',
    countries: ['ca'], searchPrefix: 'amazon',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: 'Fast delivery across Canada',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'diy', 'sports'],
  },
  {
    id: 'bestbuy-ca', name: 'Best Buy', abbreviation: 'BB',
    logo: '/logos/bestbuy-ca.svg',
    url: 'https://www.bestbuy.ca',
    countries: ['ca'], searchPrefix: 'best buy',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Canada\'s electronics superstore',
    categories: ['audio', 'computing', 'tvs', 'home'],
  },

  // ── Australia ───────────────────────────────────────────────
  {
    id: 'jbhifi', name: 'JB Hi-Fi', abbreviation: 'JB',
    logo: '/logos/jbhifi.svg',
    url: 'https://www.jbhifi.com.au',
    countries: ['au', 'nz'], searchPrefix: 'jb hifi',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: "Australia's home of entertainment",
    categories: ['audio', 'computing', 'tvs', 'home'],
  },
  {
    id: 'harvey-norman', name: 'Harvey Norman', abbreviation: 'HN',
    logo: '/logos/harvey-norman.svg',
    url: 'https://www.harveynorman.com.au',
    countries: ['au', 'nz', 'ie'], searchPrefix: 'harvey norman',
    priority: 90, verified: true, deliveryDays: 3,
    tagline: 'Electronics, furniture & appliances',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture'],
  },
  {
    id: 'kogan', name: 'Kogan', abbreviation: 'KO',
    logo: '/logos/kogan.svg',
    url: 'https://www.kogan.com',
    countries: ['au', 'nz'], searchPrefix: 'kogan',
    priority: 80, verified: true, deliveryDays: 3,
    tagline: 'Unbeatable prices online',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen'],
  },

  // ── India ───────────────────────────────────────────────────
  {
    id: 'flipkart', name: 'Flipkart', abbreviation: 'FK',
    logo: '/logos/flipkart.svg',
    url: 'https://www.flipkart.com',
    countries: ['in'], searchPrefix: 'flipkart',
    priority: 100, verified: true, deliveryDays: 3,
    tagline: "India's leading marketplace",
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'amazon-in', name: 'Amazon', abbreviation: 'AMZ',
    logo: '/logos/amazon-in.svg',
    url: 'https://www.amazon.in',
    countries: ['in'], searchPrefix: 'amazon',
    priority: 95, verified: true, deliveryDays: 2,
    tagline: 'Fast delivery across India',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'diy', 'sports'],
  },
  {
    id: 'croma', name: 'Croma', abbreviation: 'CR',
    logo: '/logos/croma.svg',
    url: 'https://www.croma.com',
    countries: ['in'], searchPrefix: 'croma electronics',
    priority: 80, verified: true, deliveryDays: 2,
    tagline: 'Tata electronics superstore',
    categories: ['audio', 'computing', 'tvs', 'home', 'kitchen'],
  },

  // ── UAE ─────────────────────────────────────────────────────
  {
    id: 'noon-ae', name: 'Noon', abbreviation: 'NN',
    logo: '/logos/noon-ae.svg',
    url: 'https://www.noon.com',
    countries: ['ae', 'sa', 'eg'], searchPrefix: 'noon',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: "The Middle East's marketplace",
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'sharaf-dg', name: 'Sharaf DG', abbreviation: 'DG',
    logo: '/logos/sharaf-dg.svg',
    url: 'https://www.sharafdg.com',
    countries: ['ae', 'sa', 'eg'], searchPrefix: 'sharaf dg',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Electronics & tech UAE',
    categories: ['audio', 'computing', 'tvs', 'home'],
  },
  {
    id: 'amazon-ae', name: 'Amazon', abbreviation: 'AMZ',
    logo: '/logos/amazon-ae.svg',
    url: 'https://www.amazon.ae',
    countries: ['ae'], searchPrefix: 'amazon',
    priority: 85, verified: true, deliveryDays: 2,
    tagline: 'Fast delivery across UAE',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'diy', 'sports'],
  },

  // ── Singapore ───────────────────────────────────────────────
  {
    id: 'lazada-sg', name: 'Lazada', abbreviation: 'LZ',
    logo: '/logos/lazada-sg.svg',
    url: 'https://www.lazada.sg',
    countries: ['sg'], searchPrefix: 'lazada',
    priority: 100, verified: true, deliveryDays: 2,
    tagline: "Southeast Asia's #1 marketplace",
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'shopee-sg', name: 'Shopee', abbreviation: 'SH',
    logo: '/logos/shopee-sg.svg',
    url: 'https://shopee.sg',
    countries: ['sg'], searchPrefix: 'shopee',
    priority: 90, verified: true, deliveryDays: 2,
    tagline: 'Shop everything online',
    categories: ['computing', 'audio', 'tvs', 'home', 'kitchen', 'furniture', 'sports'],
  },
  {
    id: 'courts-sg', name: 'Courts', abbreviation: 'CT',
    logo: '/logos/courts-sg.svg',
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
