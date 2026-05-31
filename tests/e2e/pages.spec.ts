import { test, expect } from './fixtures';

test.describe('Smoke tests — page loads', () => {
  test('home page renders without error', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    const res = await page.goto('/');
    expect(res?.status()).toBeLessThan(400);

    // Header/nav should be present
    await expect(page.locator('header, nav').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('search page returns results for a query', async ({ page }) => {
    await page.goto('/search?q=headphones');
    // Either a result card or an explicit empty state — but no crash
    const hasResults = page.locator('a[href^="/product/"]').first();
    const emptyState = page.getByText(/no results|nothing found|try a different/i);
    await expect(hasResults.or(emptyState)).toBeVisible({ timeout: 20_000 });
  });

  test('trending page loads', async ({ page }) => {
    const res = await page.goto('/trending');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('header, nav').first()).toBeVisible();
  });

  test('saved page loads', async ({ page }) => {
    const res = await page.goto('/saved');
    expect(res?.status()).toBeLessThan(400);
  });

  test('compare page loads', async ({ page }) => {
    const res = await page.goto('/compare');
    expect(res?.status()).toBeLessThan(400);
  });

  test('chat page loads', async ({ page }) => {
    const res = await page.goto('/chat');
    expect(res?.status()).toBeLessThan(400);
  });

  test('map page loads', async ({ page }) => {
    const res = await page.goto('/map');
    expect(res?.status()).toBeLessThan(400);
  });

  test('image-search page loads', async ({ page }) => {
    const res = await page.goto('/image-search');
    expect(res?.status()).toBeLessThan(400);
  });

  test('not-found page renders for unknown route', async ({ page }) => {
    const res = await page.goto('/this-route-does-not-exist-xyz');
    expect(res?.status()).toBe(404);
    await expect(page.getByText(/not found|404/i).first()).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('clicking a product card opens the product detail page', async ({ page }) => {
    await page.goto('/search?q=laptop');
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 20_000 });
    await firstProduct.click();
    await expect(page).toHaveURL(/\/product\//);
    // Price comparison or "Buy from" CTA should appear
    await expect(
      page.getByText(/buy from|price comparison/i).first()
    ).toBeVisible({ timeout: 20_000 });
  });
});

test.describe('API health', () => {
  test('search API responds', async ({ request }) => {
    const res = await request.get('/api/search?q=headphones&country=gb');
    expect(res.status()).toBeLessThan(500);
    const json = await res.json();
    expect(json).toHaveProperty('data');
  });

  test('trending API responds', async ({ request }) => {
    const res = await request.get('/api/trending?country=gb');
    expect(res.status()).toBeLessThan(500);
  });

  test('stores API responds', async ({ request }) => {
    const res = await request.get('/api/stores?country=gb&lat=51.5074&lng=-0.1278');
    expect(res.status()).toBeLessThan(500);
  });
});
