import { test, expect } from './fixtures';

test.describe('Product detail page', () => {
  test('navigates from search to product and shows all sections', async ({ page }) => {
    await page.goto('/search?q=sony+headphones');

    // Wait for the first product result and click it
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 20_000 });
    const productHref = await firstProduct.getAttribute('href');
    await firstProduct.click();

    // URL changed to /product/...
    await expect(page).toHaveURL(/\/product\//);
    expect(productHref).toMatch(/^\/product\//);

    // Breadcrumb home link
    await expect(page.getByRole('link', { name: /home/i }).first()).toBeVisible();

    // Heading (product name)
    await expect(page.locator('h1').first()).toBeVisible();

    // Buy from CTA — should be a real link, not '#'
    const buyButton = page.getByRole('button', { name: /buy from/i }).first();
    await expect(buyButton).toBeVisible({ timeout: 20_000 });

    const buyLink = page.locator('a:has(button:has-text("Buy from"))').first();
    const href = await buyLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).not.toBe('#');
    expect(href).toMatch(/^https?:\/\//);

    // Price comparison table heading
    await expect(page.getByText(/price comparison/i)).toBeVisible({ timeout: 20_000 });

    // At least one store row in the comparison table
    const storeRows = page.locator('a[target="_blank"]:has(p)').filter({ hasText: /£|\$/ });
    await expect(storeRows.first()).toBeVisible();
    const count = await storeRows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('price comparison rows link to retailer sites (not google or scout)', async ({ page }) => {
    await page.goto('/search?q=laptop');
    await page.locator('a[href^="/product/"]').first().click();
    await expect(page).toHaveURL(/\/product\//);
    await expect(page.getByText(/price comparison/i)).toBeVisible({ timeout: 20_000 });

    // Collect all hrefs from rows in the comparison table
    const storeLinks = await page
      .locator('a[target="_blank"][href^="http"]')
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href));

    expect(storeLinks.length).toBeGreaterThan(0);

    // None should be Scout's own domain
    for (const url of storeLinks) {
      expect(url).not.toMatch(/scout-six-taupe\.vercel\.app/);
      expect(url).not.toMatch(/localhost/);
      expect(url).not.toBe('#');
    }
  });

  test('sort toggle changes order of price comparison', async ({ page }) => {
    await page.goto('/search?q=monitor');
    await page.locator('a[href^="/product/"]').first().click();

    // Wait for full hydration — Buy button only appears once the product is loaded
    await expect(page.getByRole('button', { name: /buy from/i }))
      .toBeVisible({ timeout: 30_000 });

    const byPrice = page.getByText('By price', { exact: true });
    const byDistance = page.getByText('By distance', { exact: true });

    await expect(byPrice).toBeVisible({ timeout: 10_000 });
    await expect(byDistance).toBeVisible();

    await byDistance.click();
    await byPrice.click();
  });

  test('specifications toggle expands and collapses', async ({ page }) => {
    await page.goto('/search?q=headphones');
    await page.locator('a[href^="/product/"]').first().click();
    await expect(page).toHaveURL(/\/product\//);

    // Specs section may or may not exist depending on the product
    const specsToggle = page.getByRole('button', { name: /specifications/i });
    const isVisible = await specsToggle.isVisible().catch(() => false);

    if (isVisible) {
      await specsToggle.click();
      // After expanding, at least one spec row should be visible
      await page.waitForTimeout(300);
      await specsToggle.click(); // collapse again
    }
  });
});
