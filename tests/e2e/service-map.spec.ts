import { test, expect } from '@playwright/test';
import path from 'node:path';

// Run against a local build with TEST_MAPS=1 and placeholder public config.
// All SDK requests are intercepted: no Google quota or real credentials used.
test.describe('configured map integration (test provider)', () => {
  test.skip(process.env.TEST_MAPS !== '1', 'Requires isolated configured map build');
  test('deferred SDK, town selection, ZIP transfer and one map instance', async ({ page }) => {
    let sdkLoads = 0;
    await page.route('https://maps.googleapis.com/maps/api/js?**', async route => {
      sdkLoads++;
      await route.fulfill({ path: path.resolve('tests/fixtures/maps-provider.js'), contentType: 'text/javascript' });
    });
    await page.goto('/');
    expect(sdkLoads).toBe(0);
    await page.locator('.town-map').scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'Show all', exact: true })).toBeEnabled();
    await expect(page.locator('.town-pin')).toHaveCount(19);
    await expect(page.locator('.town-pin-primary')).toHaveCount(4);
    await expect(page.locator('.town-pin-logo')).toHaveCount(19);
    await expect(page.locator('.town-map-legend')).toContainText('Approx. service area');
    await page.getByRole('button', { name: 'Appliance repair in Greenville, SC', exact: true }).click();
    await expect(page.locator('.town-map-details')).toContainText('Greenville, SC');
    await expect(page.locator('.town-map-call')).toHaveAttribute('href', 'tel:+18649244349');
    await page.locator('#coverage-zip').fill('29349');
    await expect(page.locator('.town-map-details')).toContainText('Inman, SC');
    await page.locator('[name=problem]').fill('Keep this description');
    await page.locator('.town-map-actions button').click();
    await expect(page.locator('[name=zipCode]')).toHaveValue('29349');
    await expect(page.locator('[name=problem]')).toHaveValue('Keep this description');
    await expect(page.locator('[name=name]')).toBeFocused();
    await page.locator('#coverage-zip').fill('29601-1234');
    await page.locator('.town-map-actions button').click();
    await expect(page.locator('[name=zipCode]')).toHaveValue('29601-1234');
    await page.getByRole('button', { name: 'Show all', exact: true }).click();
    await expect(page.locator('.town-map-details')).toHaveCount(0);
    await expect(page.locator('.town-map-hint')).toContainText('Tap a branded pin');
    await page.locator('#coverage-zip').fill('99999');
    await expect(page.locator('.coverage-result')).toContainText('Please contact');
    await expect(page.locator('.town-pin.is-selected')).toHaveCount(0);
    expect(await page.evaluate(() => (window as Window & { __mapTest?: { creates: number } }).__mapTest?.creates)).toBe(1);
    expect(await page.evaluate(() => Boolean((window as Window & { __mapTest?: { polygon?: unknown } }).__mapTest?.polygon))).toBe(true);
    expect(sdkLoads).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
  test('mobile expanded map opens, keeps actions available and closes', async ({ page }) => {
    await page.route('https://maps.googleapis.com/maps/api/js?**', route => route.fulfill({ path: path.resolve('tests/fixtures/maps-provider.js'), contentType: 'text/javascript' }));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/'); await page.locator('.town-map').scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'Expand map', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: 'Expand map', exact: true }).click();
    await expect(page.locator('.town-map')).toHaveClass(/is-expanded/);
    await page.getByRole('button', { name: 'Appliance repair in Greer, SC', exact: true }).click();
    await expect(page.locator('.town-map-details')).toContainText('Greer, SC');
    await expect(page.getByRole('button', { name: 'Request repair', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Close map', exact: true }).click();
    await expect(page.locator('.town-map')).not.toHaveClass(/is-expanded/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
  test('blocked SDK falls back to classic map and working ZIP checker', async ({ page }) => {
    await page.route('https://maps.googleapis.com/maps/api/js?**', route => route.abort());
    await page.goto('/'); await page.locator('.town-map').scrollIntoViewIfNeeded();
    await expect(page.locator('.classic-map-frame iframe')).toBeVisible({ timeout: 20000 });
    await page.locator('#coverage-zip').fill('29601');
    await expect(page.locator('.coverage-result')).toContainText('Greenville');
  });
  test('authentication failure restores classic embed', async ({ page }) => {
    await page.route('https://maps.googleapis.com/maps/api/js?**', route => route.fulfill({ path: path.resolve('tests/fixtures/maps-provider.js'), contentType: 'text/javascript' }));
    await page.goto('/'); await page.locator('.town-map').scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'Show all', exact: true })).toBeEnabled();
    await page.evaluate(() => (window as Window & { gm_authFailure?: () => void }).gm_authFailure?.());
    await expect(page.locator('.classic-map-frame iframe')).toBeVisible();
    await expect(page.locator('.town-map-details')).toHaveCount(0);
  });
});
