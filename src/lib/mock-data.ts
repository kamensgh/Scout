import type { Store, Product, StorePrice, ProductCategory } from '@/types';
import { distanceKm } from '@/lib/utils';

export const MOCK_STORES: Store[] = [
  { id: 'currys', name: "Curry's", logo: 'https://img.logo.dev/currys.co.uk', abbreviation: 'CR', type: 'both', lat: 51.5194, lng: -0.1330, address: '214 Oxford St, London W1C 1DQ', deliveryDays: 1, deliveryFee: 0, verified: true, rating: 4.2 },
  { id: 'johnlewis', name: 'John Lewis', logo: 'https://img.logo.dev/johnlewis.com', abbreviation: 'JL', type: 'both', lat: 51.5153, lng: -0.1420, address: '300 Oxford St, London W1C 1DX', deliveryDays: 2, deliveryFee: 0, verified: true, rating: 4.6 },
  { id: 'argos', name: 'Argos', logo: 'https://img.logo.dev/argos.co.uk', abbreviation: 'AR', type: 'both', lat: 51.5098, lng: -0.1180, address: '125 Oxford St, London W1D 2HT', deliveryDays: 1, deliveryFee: 395, verified: true, rating: 3.9 },
  { id: 'ikea', name: 'IKEA', logo: 'https://img.logo.dev/ikea.com', abbreviation: 'IK', type: 'physical', lat: 51.5586, lng: -0.2796, address: 'Valley Park, Wembley HA9 0HB', deliveryDays: 7, deliveryFee: 3900, verified: true, rating: 4.1 },
  { id: 'ao', name: 'AO', logo: 'https://img.logo.dev/ao.com', abbreviation: 'AO', type: 'online', deliveryDays: 1, deliveryFee: 0, verified: true, rating: 4.4 },
  { id: 'amazon', name: 'Amazon UK', logo: 'https://img.logo.dev/amazon.co.uk', abbreviation: 'AM', type: 'online', deliveryDays: 1, deliveryFee: 0, verified: true, rating: 4.5 },
  { id: 'ebay', name: 'eBay UK', logo: 'https://img.logo.dev/ebay.co.uk', abbreviation: 'EB', type: 'online', deliveryDays: 3, deliveryFee: 0, verified: false, rating: 3.8 },
  { id: 'screwfix', name: 'Screwfix', logo: 'https://img.logo.dev/screwfix.com', abbreviation: 'SF', type: 'both', lat: 51.4738, lng: -0.1524, address: '350 Wandsworth Rd, London SW8', deliveryDays: 1, deliveryFee: 0, verified: true, rating: 4.3 },
  { id: 'bq', name: 'B&Q', logo: 'https://img.logo.dev/diy.com', abbreviation: 'B&', type: 'both', lat: 51.4571, lng: -0.1893, address: 'Garrett La, London SW18 4AB', deliveryDays: 3, deliveryFee: 0, verified: true, rating: 4.0 },
  { id: 'halfords', name: 'Halfords', logo: 'https://img.logo.dev/halfords.com', abbreviation: 'HF', type: 'both', lat: 51.5033, lng: -0.0754, address: '1 Commercial Rd, London E1 1RD', deliveryDays: 2, deliveryFee: 0, verified: true, rating: 4.1 },
  { id: 'wickes', name: 'Wickes', logo: 'https://img.logo.dev/wickes.co.uk', abbreviation: 'WK', type: 'both', lat: 51.5312, lng: -0.0743, address: 'Unit 1, Hackney Rd, London E2 7NX', deliveryDays: 3, deliveryFee: 995, verified: true, rating: 3.9 },
  { id: 'sainsburys', name: "Sainsbury's", logo: 'https://img.logo.dev/sainsburys.co.uk', abbreviation: 'SB', type: 'both', lat: 51.5045, lng: -0.0865, address: '12 Whitechapel Rd, London E1 1EW', deliveryDays: 1, deliveryFee: 100, verified: true, rating: 4.2 },
];

function sp(storeId: string, pricePence: number, inStock = true, extras?: Partial<StorePrice>): StorePrice {
  const store = MOCK_STORES.find(s => s.id === storeId)!;
  return {
    storeId: store.id,
    storeName: store.name,
    storeLogo: store.logo,
    storeAbbreviation: store.abbreviation,
    storeType: store.type,
    pricePence,
    inStock,
    deliveryDays: store.deliveryDays,
    deliveryFeePence: store.deliveryFee,
    collectionAvailable: store.type !== 'online',
    url: `https://${store.id === 'bq' ? 'diy.com' : store.id + '.co.uk'}/product`,
    lastUpdated: new Date().toISOString(),
    ...extras,
  };
}

export const MOCK_PRODUCTS: Product[] = [
  // AUDIO
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    category: 'audio',
    description: 'Industry-leading noise cancelling wireless headphones with up to 30-hour battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    ],
    tags: ['noise-cancelling', 'wireless', 'premium', 'headphones'],
    lowestPricePence: 27500,
    highestPricePence: 33999,
    rrpPence: 33999,
    storePrices: [
      sp('amazon', 27500),
      sp('johnlewis', 27900),
      sp('currys', 28499),
      sp('argos', 29999),
      sp('ebay', 26200),
    ],
    rating: 4.7,
    reviewCount: 2847,
    trending: true,
    trendingRank: 1,
    specs: { 'Battery Life': '30 hours', 'Connectivity': 'Bluetooth 5.2', 'Weight': '250g', 'Foldable': 'Yes' },
  },
  {
    id: 'apple-airpods-pro2',
    name: 'Apple AirPods Pro (2nd Generation)',
    brand: 'Apple',
    category: 'audio',
    description: 'Active Noise Cancellation for immersive sound, Adaptive Transparency.',
    imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80'],
    tags: ['airpods', 'apple', 'earbuds', 'anc'],
    lowestPricePence: 22900,
    highestPricePence: 24900,
    rrpPence: 22900,
    storePrices: [
      sp('amazon', 22900),
      sp('johnlewis', 22900),
      sp('currys', 23499),
      sp('argos', 24900),
    ],
    rating: 4.6,
    reviewCount: 5123,
    trending: true,
    trendingRank: 3,
    specs: { 'Battery Life': '6 hours (30 with case)', 'Chip': 'H2', 'Water Resistance': 'IPX4' },
  },
  {
    id: 'bose-qc45',
    name: 'Bose QuietComfort 45 Headphones',
    brand: 'Bose',
    category: 'audio',
    description: 'World-class noise cancellation with high-fidelity audio.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80'],
    tags: ['bose', 'noise-cancelling', 'wireless'],
    lowestPricePence: 23900,
    highestPricePence: 27900,
    rrpPence: 27900,
    storePrices: [
      sp('currys', 23900),
      sp('johnlewis', 24900),
      sp('amazon', 24500),
    ],
    rating: 4.5,
    reviewCount: 1834,
    trending: false,
    specs: { 'Battery Life': '24 hours', 'Connectivity': 'Bluetooth 5.1', 'Weight': '238g' },
  },
  // COMPUTING
  {
    id: 'apple-macbook-air-m3',
    name: 'Apple MacBook Air 13" M3',
    brand: 'Apple',
    category: 'computing',
    description: 'Supercharged by the M3 chip. With up to 18 hours of battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80',
    ],
    tags: ['apple', 'laptop', 'macbook', 'm3', 'computing'],
    lowestPricePence: 117900,
    highestPricePence: 125000,
    rrpPence: 117900,
    storePrices: [
      sp('amazon', 117900),
      sp('johnlewis', 117900),
      sp('currys', 118999),
      sp('argos', 119900),
    ],
    rating: 4.8,
    reviewCount: 3201,
    trending: true,
    trendingRank: 2,
    specs: { 'Chip': 'Apple M3', 'RAM': '8GB', 'Storage': '256GB SSD', 'Display': '13.6" Liquid Retina', 'Battery': '18 hours' },
  },
  {
    id: 'samsung-galaxy-book4',
    name: 'Samsung Galaxy Book4 Pro 360',
    brand: 'Samsung',
    category: 'computing',
    description: '14" 2-in-1 laptop with AMOLED display and Intel Core Ultra.',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80'],
    tags: ['samsung', 'laptop', '2-in-1', 'amoled'],
    lowestPricePence: 139900,
    highestPricePence: 149900,
    rrpPence: 149900,
    storePrices: [
      sp('currys', 139900),
      sp('johnlewis', 144900),
      sp('amazon', 142000),
    ],
    rating: 4.4,
    reviewCount: 892,
    trending: false,
    specs: { 'Processor': 'Intel Core Ultra 7', 'RAM': '16GB', 'Storage': '512GB', 'Display': '14" AMOLED Touch' },
  },
  {
    id: 'dell-xps-15',
    name: 'Dell XPS 15 (9530)',
    brand: 'Dell',
    category: 'computing',
    description: 'Exceptional 15.6" InfinityEdge display with 13th Gen Intel Core.',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80'],
    tags: ['dell', 'laptop', 'xps', 'professional'],
    lowestPricePence: 159900,
    highestPricePence: 179900,
    rrpPence: 179900,
    storePrices: [
      sp('amazon', 159900),
      sp('currys', 169900),
      sp('johnlewis', 164900),
    ],
    rating: 4.5,
    reviewCount: 1247,
    trending: false,
    specs: { 'Processor': 'Intel Core i7-13700H', 'RAM': '16GB', 'Storage': '512GB NVMe', 'Display': '15.6" OLED' },
  },
  // TVs
  {
    id: 'samsung-65-qn90c',
    name: 'Samsung 65" QN90C Neo QLED TV',
    brand: 'Samsung',
    category: 'tvs',
    description: 'Neo QLED 4K Smart TV with Quantum Matrix Technology.',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80'],
    tags: ['samsung', '65-inch', 'neo-qled', '4k', 'smart-tv'],
    lowestPricePence: 176500,
    highestPricePence: 199900,
    rrpPence: 199900,
    storePrices: [
      sp('amazon', 176500),
      sp('currys', 179999),
      sp('ao', 182000),
      sp('johnlewis', 185000),
    ],
    rating: 4.7,
    reviewCount: 1893,
    trending: true,
    trendingRank: 5,
    specs: { 'Screen Size': '65"', 'Resolution': '4K UHD', 'HDR': 'HDR10+', 'Refresh Rate': '144Hz', 'Smart TV': 'Tizen OS' },
  },
  {
    id: 'lg-c3-55',
    name: 'LG C3 55" OLED TV',
    brand: 'LG',
    category: 'tvs',
    description: 'Self-lit OLED pixels for perfect black and infinite contrast.',
    imageUrl: 'https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=600&q=80'],
    tags: ['lg', 'oled', '55-inch', '4k', 'gaming'],
    lowestPricePence: 89900,
    highestPricePence: 109900,
    rrpPence: 109900,
    storePrices: [
      sp('amazon', 89900),
      sp('currys', 94900),
      sp('johnlewis', 97900),
      sp('ao', 92000),
    ],
    rating: 4.8,
    reviewCount: 2156,
    trending: true,
    trendingRank: 4,
    specs: { 'Screen Size': '55"', 'Resolution': '4K UHD', 'Panel': 'OLED', 'Refresh Rate': '120Hz', 'G-Sync': 'Yes' },
  },
  // HOME
  {
    id: 'dyson-v15',
    name: 'Dyson V15 Detect Cordless Vacuum',
    brand: 'Dyson',
    category: 'home',
    description: 'Laser detects and reveals microscopic dust. Scientifically proves a deep clean.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    tags: ['dyson', 'vacuum', 'cordless', 'laser'],
    lowestPricePence: 56500,
    highestPricePence: 64999,
    rrpPence: 64999,
    storePrices: [
      sp('amazon', 56500),
      sp('johnlewis', 57900),
      sp('currys', 58999),
      sp('ao', 59500),
      sp('argos', 61999),
      sp('ebay', 54900),
    ],
    rating: 4.6,
    reviewCount: 3847,
    trending: true,
    trendingRank: 3,
    specs: { 'Battery': '60 min', 'Bin Volume': '0.77L', 'Weight': '3.1kg', 'Suction': '230 AW' },
  },
  {
    id: 'shark-stratos',
    name: 'Shark Stratos Cordless Vacuum',
    brand: 'Shark',
    category: 'home',
    description: 'IZ420UK with DuoClean PowerFins and anti-hair wrap.',
    imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&q=80'],
    tags: ['shark', 'vacuum', 'cordless', 'anti-hair-wrap'],
    lowestPricePence: 34900,
    highestPricePence: 39900,
    rrpPence: 39900,
    storePrices: [
      sp('amazon', 34900),
      sp('ao', 36500),
      sp('currys', 37999),
    ],
    rating: 4.3,
    reviewCount: 1247,
    trending: false,
    specs: { 'Battery': '45 min', 'Weight': '2.8kg', 'Pet Hair': 'Yes' },
  },
  {
    id: 'philips-hue-starter',
    name: 'Philips Hue White & Colour Starter Kit',
    brand: 'Philips',
    category: 'home',
    description: 'Starter kit with 3 bulbs + Bridge. Millions of colours.',
    imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80'],
    tags: ['philips-hue', 'smart-lighting', 'colour'],
    lowestPricePence: 11900,
    highestPricePence: 14999,
    rrpPence: 14999,
    storePrices: [
      sp('amazon', 11900),
      sp('johnlewis', 12500),
      sp('argos', 13999),
      sp('currys', 12999),
    ],
    rating: 4.4,
    reviewCount: 2103,
    trending: false,
    specs: { 'Bulbs': '3x E27', 'App': 'Hue app', 'Voice': 'Alexa / Google' },
  },
  // KITCHEN
  {
    id: 'sage-barista-express',
    name: 'Sage Barista Express Espresso Machine',
    brand: 'Sage',
    category: 'kitchen',
    description: 'Integrated grinder with dose control. Barista quality at home.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    ],
    tags: ['coffee', 'espresso', 'sage', 'barista'],
    lowestPricePence: 57900,
    highestPricePence: 64999,
    rrpPence: 64999,
    storePrices: [
      sp('amazon', 57900),
      sp('johnlewis', 59900),
      sp('currys', 61999),
      sp('argos', 63499),
    ],
    rating: 4.7,
    reviewCount: 1923,
    trending: false,
    specs: { 'Pressure': '15 bar', 'Grinder': 'Integrated', 'Capacity': '2L', 'Steam Wand': 'Yes' },
  },
  {
    id: 'nespresso-vertuo-next',
    name: 'Nespresso Vertuo Next Coffee Machine',
    brand: 'Nespresso',
    category: 'kitchen',
    description: 'WiFi-connected coffee machine. 5 cup sizes from espresso to carafe.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80'],
    tags: ['nespresso', 'coffee', 'pod', 'capsule'],
    lowestPricePence: 9900,
    highestPricePence: 14999,
    rrpPence: 14999,
    storePrices: [
      sp('amazon', 9900),
      sp('argos', 10999),
      sp('currys', 11499),
      sp('johnlewis', 11999),
    ],
    rating: 4.3,
    reviewCount: 3421,
    trending: false,
    specs: { 'Cup Sizes': '5', 'Connectivity': 'WiFi', 'Tank': '1.1L' },
  },
  {
    id: 'kitchenaid-stand-mixer',
    name: 'KitchenAid Artisan Stand Mixer 4.8L',
    brand: 'KitchenAid',
    category: 'kitchen',
    description: 'Iconic tilt-head stand mixer. 10 speeds, 4.8L bowl.',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'],
    tags: ['kitchenaid', 'stand-mixer', 'baking'],
    lowestPricePence: 44900,
    highestPricePence: 59900,
    rrpPence: 59900,
    storePrices: [
      sp('johnlewis', 44900),
      sp('amazon', 46500),
      sp('currys', 48999),
      sp('argos', 52999),
    ],
    rating: 4.7,
    reviewCount: 4821,
    trending: false,
    specs: { 'Capacity': '4.8L', 'Speeds': '10', 'Motor': '300W', 'Attachments': '3 included' },
  },
  // FURNITURE
  {
    id: 'ikea-malm-bed',
    name: 'IKEA MALM Bed Frame 160cm',
    brand: 'IKEA',
    category: 'furniture',
    description: 'Clean-lined bed frame with storage boxes included. 160x200cm.',
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    ],
    tags: ['ikea', 'bed', 'bedroom', 'storage'],
    lowestPricePence: 19900,
    highestPricePence: 32999,
    rrpPence: 19900,
    storePrices: [
      sp('ikea', 19900),
      sp('ebay', 21500),
      sp('argos', 24999),
      sp('johnlewis', 27900),
      sp('amazon', 32999),
    ],
    rating: 4.4,
    reviewCount: 5672,
    trending: true,
    trendingRank: 4,
    specs: { 'Dimensions': '160x200cm', 'Material': 'Fiberboard', 'Storage': '4 drawers', 'Assembly': 'Required' },
  },
  {
    id: 'made-alba-sofa',
    name: 'Habitat Lyle 3 Seat Sofa',
    brand: 'Habitat',
    category: 'furniture',
    description: 'Modern 3-seat sofa in woven fabric. Deep seat cushions.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'],
    tags: ['sofa', '3-seat', 'living-room', 'habitat'],
    lowestPricePence: 59900,
    highestPricePence: 79900,
    rrpPence: 79900,
    storePrices: [
      sp('argos', 59900),
      sp('ebay', 65000),
    ],
    rating: 4.1,
    reviewCount: 342,
    trending: false,
    specs: { 'Seats': '3', 'Material': 'Woven fabric', 'Legs': 'Solid wood', 'Width': '220cm' },
  },
  // DIY
  {
    id: 'dewalt-drill-combi',
    name: 'DeWalt DCD796 18V Combi Drill',
    brand: 'DeWalt',
    category: 'diy',
    description: '2-speed brushless combi drill with XR battery technology.',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80'],
    tags: ['dewalt', 'drill', 'cordless', '18v', 'diy'],
    lowestPricePence: 10900,
    highestPricePence: 14999,
    rrpPence: 14999,
    storePrices: [
      sp('screwfix', 10900),
      sp('bq', 11999),
      sp('amazon', 11499),
      sp('wickes', 12999),
    ],
    rating: 4.6,
    reviewCount: 2103,
    trending: false,
    specs: { 'Voltage': '18V', 'Chuck': '13mm', 'Torque': '70Nm', 'Speed': '2-speed' },
  },
  {
    id: 'bosch-psb-drill',
    name: 'Bosch PSB 18 LI-2 Cordless Drill',
    brand: 'Bosch',
    category: 'diy',
    description: 'Combi drill for drilling, screwdriving and hammer drilling.',
    imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80'],
    tags: ['bosch', 'drill', 'cordless', '18v'],
    lowestPricePence: 8999,
    highestPricePence: 11999,
    rrpPence: 11999,
    storePrices: [
      sp('screwfix', 8999),
      sp('bq', 9999),
      sp('wickes', 10499),
      sp('amazon', 9500),
    ],
    rating: 4.3,
    reviewCount: 1456,
    trending: false,
    specs: { 'Voltage': '18V', 'Chuck': '10mm', 'Torque': '45Nm', 'Clutch positions': '25' },
  },
  // SPORTS
  {
    id: 'trek-fx3-disc',
    name: 'Trek FX 3 Disc Hybrid Bike',
    brand: 'Trek',
    category: 'sports',
    description: 'Fast, smooth hybrid bike with hydraulic disc brakes. Size S-XL.',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    ],
    tags: ['trek', 'bike', 'hybrid', 'cycling', 'disc-brakes'],
    lowestPricePence: 67500,
    highestPricePence: 89999,
    rrpPence: 89999,
    storePrices: [
      sp('ebay', 67500),
      sp('halfords', 74999),
      sp('johnlewis', 79900),
    ],
    rating: 4.6,
    reviewCount: 891,
    trending: true,
    trendingRank: 2,
    specs: { 'Frame': 'Alpha Silver Aluminium', 'Gears': '24-speed', 'Brakes': 'Hydraulic Disc', 'Weight': '11.2kg' },
  },
  {
    id: 'garmin-forerunner-265',
    name: 'Garmin Forerunner 265 GPS Watch',
    brand: 'Garmin',
    category: 'sports',
    description: 'AMOLED running watch with advanced training metrics and recovery insights.',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80'],
    tags: ['garmin', 'running', 'gps-watch', 'fitness'],
    lowestPricePence: 34900,
    highestPricePence: 39900,
    rrpPence: 39900,
    storePrices: [
      sp('amazon', 34900),
      sp('johnlewis', 36500),
      sp('halfords', 37999),
      sp('currys', 38500),
    ],
    rating: 4.5,
    reviewCount: 1203,
    trending: false,
    specs: { 'Display': '1.3" AMOLED', 'Battery': '13 days', 'GPS': 'Multi-band', 'Heart Rate': 'Wrist-based' },
  },
];

const additionalProducts: Product[] = [
  {
    id: 'jbl-charge5',
    name: 'JBL Charge 5 Portable Speaker',
    brand: 'JBL',
    category: 'audio',
    description: 'Waterproof portable Bluetooth speaker with powerbank functionality.',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'],
    tags: ['jbl', 'bluetooth-speaker', 'waterproof', 'portable'],
    lowestPricePence: 14900,
    highestPricePence: 18999,
    rrpPence: 18999,
    storePrices: [sp('amazon', 14900), sp('currys', 15999), sp('argos', 16999), sp('johnlewis', 17900)],
    rating: 4.6, reviewCount: 4231, trending: false,
    specs: { 'Battery': '20 hours', 'Waterproof': 'IP67', 'Weight': '960g' },
  },
  {
    id: 'nintendo-switch-oled',
    name: 'Nintendo Switch OLED',
    brand: 'Nintendo',
    category: 'computing',
    description: '7-inch OLED screen, enhanced audio, 64GB storage.',
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&q=80'],
    tags: ['nintendo', 'switch', 'gaming', 'oled'],
    lowestPricePence: 29900,
    highestPricePence: 31999,
    rrpPence: 31999,
    storePrices: [sp('amazon', 29900), sp('argos', 30999), sp('currys', 31499), sp('johnlewis', 31999)],
    rating: 4.7, reviewCount: 8921, trending: true, trendingRank: 6,
    specs: { 'Screen': '7" OLED', 'Storage': '64GB', 'Battery': '4.5-9 hours' },
  },
  {
    id: 'instantpot-duo7',
    name: 'Instant Pot Duo 7-in-1',
    brand: 'Instant Pot',
    category: 'kitchen',
    description: '5.7L electric pressure cooker. Replaces 7 kitchen appliances.',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80'],
    tags: ['instant-pot', 'pressure-cooker', 'slow-cooker', 'multicooker'],
    lowestPricePence: 7999,
    highestPricePence: 10999,
    rrpPence: 10999,
    storePrices: [sp('amazon', 7999), sp('currys', 8999), sp('argos', 9499), sp('johnlewis', 9999)],
    rating: 4.6, reviewCount: 12847, trending: false,
    specs: { 'Capacity': '5.7L', 'Functions': '7', 'Programs': '14' },
  },
  {
    id: 'ikea-billy-bookcase',
    name: 'IKEA BILLY Bookcase 80x202cm',
    brand: 'IKEA',
    category: 'furniture',
    description: 'Classic adjustable shelves. In white, birch or black-brown.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'],
    tags: ['ikea', 'bookcase', 'storage', 'shelving'],
    lowestPricePence: 5500,
    highestPricePence: 9900,
    rrpPence: 5500,
    storePrices: [sp('ikea', 5500), sp('ebay', 6999), sp('amazon', 8999)],
    rating: 4.3, reviewCount: 18291, trending: false,
    specs: { 'Width': '80cm', 'Height': '202cm', 'Depth': '28cm', 'Shelves': '5' },
  },
  {
    id: 'weber-master-touch',
    name: 'Weber Master-Touch 57cm Charcoal BBQ',
    brand: 'Weber',
    category: 'sports',
    description: 'Premium charcoal kettle grill. Fits a 12lb turkey.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'],
    tags: ['weber', 'bbq', 'charcoal', 'grill', 'outdoor'],
    lowestPricePence: 22900,
    highestPricePence: 27999,
    rrpPence: 27999,
    storePrices: [sp('amazon', 22900), sp('bq', 23999), sp('johnlewis', 24999), sp('argos', 25999)],
    rating: 4.7, reviewCount: 3847, trending: false,
    specs: { 'Diameter': '57cm', 'Fuel': 'Charcoal', 'Lid': 'Porcelain-enamelled', 'Grate': 'Plated steel' },
  },
  {
    id: 'philips-airfryer-xl',
    name: 'Philips Airfryer XXL HD9650',
    brand: 'Philips',
    category: 'kitchen',
    description: '7.3L family-sized air fryer with Smart Sensing technology.',
    imageUrl: 'https://images.unsplash.com/photo-1648548927540-7ca8e70bd428?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1648548927540-7ca8e70bd428?w=600&q=80'],
    tags: ['air-fryer', 'philips', 'xxl', 'kitchen'],
    lowestPricePence: 24900,
    highestPricePence: 29999,
    rrpPence: 29999,
    storePrices: [sp('amazon', 24900), sp('currys', 26999), sp('johnlewis', 27999), sp('argos', 28499)],
    rating: 4.4, reviewCount: 5821, trending: false,
    specs: { 'Capacity': '7.3L', 'Power': '2225W', 'Presets': '5' },
  },
];

export const ALL_PRODUCTS: Product[] = [...MOCK_PRODUCTS, ...additionalProducts];

export function searchProducts(
  query: string,
  intent?: { category?: string; maxPricePence?: number; brand?: string; nearMe?: boolean },
  userLat?: number | null,
  userLng?: number | null
): Product[] {
  const q = query.toLowerCase().trim();

  let results = ALL_PRODUCTS.filter((p) => {
    const text = `${p.name} ${p.brand} ${p.description} ${p.tags.join(' ')} ${p.category}`.toLowerCase();
    const matchesQuery = !q || text.includes(q) || q.split(' ').some(word => text.includes(word));
    const matchesCategory = !intent?.category || p.category === intent.category;
    const matchesBrand = !intent?.brand || p.brand.toLowerCase().includes(intent.brand.toLowerCase());
    const matchesPrice = !intent?.maxPricePence || p.lowestPricePence <= intent.maxPricePence;
    return matchesQuery && matchesCategory && matchesBrand && matchesPrice;
  });

  if (userLat && userLng) {
    results = results.map((p) => {
      const physicalPrices = p.storePrices.filter(price => {
        const store = MOCK_STORES.find(s => s.id === price.storeId);
        return store?.lat && store?.lng && price.inStock;
      });

      if (physicalPrices.length === 0) return p;

      let nearestKm = Infinity;
      let nearestStore: Store | undefined;
      for (const price of physicalPrices) {
        const store = MOCK_STORES.find(s => s.id === price.storeId);
        if (store?.lat && store?.lng) {
          const km = distanceKm(userLat, userLng, store.lat, store.lng);
          if (km < nearestKm) { nearestKm = km; nearestStore = store; }
        }
      }

      return {
        ...p,
        nearestStoreName: nearestStore?.name,
        nearestStoreDistance: nearestKm === Infinity ? undefined : nearestKm,
        nearestStoreCity: 'London',
      };
    });

    results.sort((a, b) => {
      const aDist = a.nearestStoreDistance ?? Infinity;
      const bDist = b.nearestStoreDistance ?? Infinity;
      return aDist - bDist;
    });
  }

  return results;
}

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export function getTrending(category?: ProductCategory, limit = 8): Product[] {
  let products = ALL_PRODUCTS.filter((p) => p.trending);
  if (category) products = products.filter((p) => p.category === category);
  return products
    .sort((a, b) => (a.trendingRank ?? 999) - (b.trendingRank ?? 999))
    .slice(0, limit);
}

export function getStoresSortedByDistance(
  userLat?: number | null,
  userLng?: number | null
): (Store & { distanceKm?: number; distanceMiles?: number })[] {
  return MOCK_STORES.map((store) => {
    if (!userLat || !userLng || !store.lat || !store.lng) {
      return { ...store, distanceKm: undefined, distanceMiles: undefined };
    }
    const km = distanceKm(userLat, userLng, store.lat, store.lng);
    return { ...store, distanceKm: km, distanceMiles: km * 0.621371 };
  }).sort((a, b) => {
    if (!a.distanceKm && a.type === 'online') return 1;
    if (!b.distanceKm && b.type === 'online') return -1;
    return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
  });
}

export function getCategories() {
  return [
    { id: 'audio' as ProductCategory, label: 'Audio', icon: '🎧', count: 142 },
    { id: 'computing' as ProductCategory, label: 'Computing', icon: '💻', count: 318 },
    { id: 'tvs' as ProductCategory, label: 'TVs', icon: '📺', count: 96 },
    { id: 'home' as ProductCategory, label: 'Home', icon: '🏠', count: 482 },
    { id: 'kitchen' as ProductCategory, label: 'Kitchen', icon: '🍳', count: 211 },
    { id: 'furniture' as ProductCategory, label: 'Furniture', icon: '🛋️', count: 173 },
    { id: 'diy' as ProductCategory, label: 'DIY', icon: '🔧', count: 264 },
    { id: 'sports' as ProductCategory, label: 'Sports', icon: '🚴', count: 187 },
  ];
}
