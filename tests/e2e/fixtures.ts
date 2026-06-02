import { test as base, expect } from '@playwright/test';

// London, UK location — used to seed the location store so the gate doesn't
// block pages that depend on lat/lng/country.
const SEEDED_LOCATION = {
  state: {
    rawInput: 'London, UK',
    lat: 51.5074,
    lng: -0.1278,
    city: 'London',
    country: 'gb',
    countryName: 'United Kingdom',
    displayName: 'London, UK',
    dataRegion: 'rich',
    method: 'text',
    status: 'resolved',
  },
  version: 0,
};

export const test = base.extend({
  context: async ({ context }, use) => {
    await context.addInitScript((loc) => {
      window.localStorage.setItem('scout-location', JSON.stringify(loc));
    }, SEEDED_LOCATION);
    await use(context);
  },
});

export { expect };
