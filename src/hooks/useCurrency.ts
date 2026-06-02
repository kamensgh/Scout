'use client';

import { useLocationStore } from '@/store/location-store';
import { getCurrencyForCountry } from '@/lib/currency';
import { formatPrice as _formatPrice, formatPriceShort as _formatPriceShort } from '@/lib/utils';

export function useCurrency() {
  const country = useLocationStore(s => s.country);
  const currency = getCurrencyForCountry(country);

  return {
    currency,
    formatPrice: (amount: number) => _formatPrice(amount, currency),
    formatPriceShort: (amount: number) => _formatPriceShort(amount, currency),
  };
}
