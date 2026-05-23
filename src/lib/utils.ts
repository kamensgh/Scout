import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// amount is stored in 1/100 of the main currency unit (e.g. pence, cents, etc.)
export function formatPrice(amount: number, currency = 'GBP'): string {
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)}`;
  }
}

export function formatPriceShort(amount: number, currency = 'GBP'): string {
  const value = amount / 100;
  try {
    const formatter = new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    });
    if (value >= 1_000_000) {
      return formatter.format(value / 1_000_000).replace(/[\d,]+/, n => n + 'M');
    }
    if (value >= 1_000) {
      return formatter.format(value / 1_000).replace(/[\d,]+/, n => n + 'k');
    }
    return formatter.format(value);
  } catch {
    return `${value.toFixed(0)}`;
  }
}

export function discountPercent(rrpPence: number, salePence: number): number {
  return Math.round(((rrpPence - salePence) / rrpPence) * 100);
}

export function distanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function distanceMiles(km: number): number {
  return km * 0.621371;
}

export function formatDistance(km: number): string {
  const miles = distanceMiles(km);
  if (miles < 0.1) return 'nearby';
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
