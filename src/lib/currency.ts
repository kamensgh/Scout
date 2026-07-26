// Maps ISO 3166-1 alpha-2 country codes to ISO 4217 currency codes
const COUNTRY_CURRENCY: Record<string, string> = {
  // English-speaking
  US: 'USD', GB: 'GBP', CA: 'CAD', AU: 'AUD', NZ: 'NZD', IE: 'EUR',
  // Eurozone
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR',
  AT: 'EUR', PT: 'EUR', FI: 'EUR', GR: 'EUR', LU: 'EUR', MT: 'EUR',
  CY: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR', LV: 'EUR', LT: 'EUR',
  // Other European
  SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', CH: 'CHF', CZ: 'CZK',
  HU: 'HUF', RO: 'RON', HR: 'EUR', RS: 'RSD',
  // Americas
  BR: 'BRL', MX: 'MXN', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN',
  // Asia-Pacific
  JP: 'JPY', CN: 'CNY', IN: 'INR', SG: 'SGD', HK: 'HKD', KR: 'KRW',
  TH: 'THB', MY: 'MYR', PH: 'PHP', ID: 'IDR', TW: 'TWD', VN: 'VND',
  // Middle East
  AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR',
  IL: 'ILS', TR: 'TRY',
  // Africa
  ZA: 'ZAR', NG: 'NGN', KE: 'KES', GH: 'GHS', EG: 'EGP', MA: 'MAD',
  ET: 'ETB', TZ: 'TZS', UG: 'UGX', SN: 'XOF',
};

// Countries where Google Shopping actually returns results via SerpAPI.
// For any country NOT in this set, prices come from the US fallback,
// so we show USD instead of the local currency.
const SHOPPING_SUPPORTED = new Set([
  'us', 'gb', 'ca', 'au', 'nz', 'de', 'fr', 'it', 'es', 'nl', 'be',
  'at', 'ch', 'se', 'no', 'dk', 'fi', 'pl', 'pt', 'ie', 'sg', 'in',
  'jp', 'br', 'mx', 'za', 'ng', 'ke', 'gh', 'eg', 'ae', 'sa',
]);

export function getCurrencyForCountry(countryCode: string | null): string {
  if (!countryCode) return 'USD';
  const lower = countryCode.toLowerCase();
  const upper = countryCode.toUpperCase();
  // If not supported, prices were fetched from the US fallback → show USD
  if (!SHOPPING_SUPPORTED.has(lower)) return 'USD';
  return COUNTRY_CURRENCY[upper] ?? 'USD';
}
