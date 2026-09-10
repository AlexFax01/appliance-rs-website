import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('appliance-rs-consent-v1', JSON.stringify({ analytics: false, advertising: false })));
  await page.goto('/');
  // Filling waits for the form to hydrate before simulating a lost connection.
  await page.locator('[name=name]').fill('Mobile QA');
});

test('missing fields remain actionable when additional script downloads fail', async ({ page }) => {
  await page.locator('[name=phone]').fill('123');
  await page.locator('[name=zipCode]').fill('123');
  await page.locator('[name=problem]').fill('Broken');
  await page.route('**/_next/static/chunks/*.js', route => route.abort('failed'));
  await page.getByRole('button', { name: 'Review request' }).click();

  const summary = page.locator('.form-notice-error');
  await expect(summary).toHaveAttribute('role', 'alert');
  await expect(summary).not.toContainText('could not finish loading');
  await expect(summary.locator('li')).toHaveCount(5);
  await expect(summary).toContainText('Phone number: Please enter a valid phone number.');
  await expect(summary).toContainText('Service address: Please enter the service address.');
  await expect(summary).toContainText('ZIP code: Please enter a valid ZIP code.');
  await expect(summary).toContainText('at least 10 characters');
  await expect(summary).toContainText('Contact permission: Please confirm we may contact you.');
  await expect(page.locator('[name=phone]')).toBeFocused();
  await expect(page.locator('[name=phone]')).toBeInViewport();
  await expect(page.locator('[name=phone]')).toHaveAttribute('aria-describedby', 'request-phone-error');
  await expect(page.locator('#request-phone-error')).toBeInViewport();

  await summary.getByRole('button', { name: /Service address:/ }).click();
  await expect(page.locator('[name=address]')).toBeFocused();
  await expect(page.locator('[name=address]')).toBeInViewport();
  await page.locator('[name=address]').fill('123 Main St, Greenville, SC');
  await page.locator('[name=phone]').fill('8645550123');
  await page.locator('[name=zipCode]').fill('29601');
  await page.locator('[name=problem]').fill('The appliance is not working.');
  await summary.getByRole('button', { name: /Contact permission:/ }).click();
  await expect(page.locator('[name=consent]')).toBeFocused();
  await page.locator('[name=consent]').check();
  await page.getByRole('button', { name: 'Review request' }).click();
  await expect(page.locator('#sms-ready-link')).toBeVisible();
  await expect(page.locator('.form-notice-error')).toHaveCount(0);
  await expect(page.locator('.field-error')).toHaveCount(0);
  await expect(page.locator('[name=name]')).toHaveValue('Mobile QA');
  await expect(page.locator('#sms-ready-link')).toHaveAttribute('href', /^sms:\+18644976563[?&]body=/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('an unavailable QR download does not delay a valid SMS review', async ({ page }) => {
  await page.locator('[name=phone]').fill('8645550123');
  await page.locator('[name=address]').fill('123 Main St, Greenville, SC');
  await page.locator('[name=zipCode]').fill('29601');
  await page.locator('[name=problem]').fill('The appliance is not working.');
  await page.locator('[name=consent]').check();
  // Keep subsequent chunks pending, as on a stalled mobile connection.
  let releaseDownload!: () => void;
  const pending = new Promise<void>(resolve => { releaseDownload = resolve; });
  await page.route('**/_next/static/chunks/*.js', async route => {
    await pending;
    await route.abort('failed');
  });
  try {
    await page.getByRole('button', { name: 'Review request' }).click();
    await expect(page.locator('#sms-ready-link')).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole('button', { name: 'Copy message' })).toBeVisible();
    await expect(page.locator('.sms-review')).toContainText('Mobile QA');
  } finally {
    releaseDownload();
    await page.unrouteAll({ behavior: 'wait' });
  }
});
