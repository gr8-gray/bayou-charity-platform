import { test, expect } from '@playwright/test';

// Donate is the money path — the page must render its payment routes.
// BFF has no in-app checkout; donations go out via Zeffy embed + payment chips
// (CashApp / Venmo / PayPal). "Customer path covered" here means: page loads,
// the Zeffy form is embedded, and the chip links point at the right handles.
// If Zeffy changes their embed or a chip href gets fat-fingered, this catches it.

test('donate page renders Zeffy embed and payment chips', async ({ page }) => {
  await page.goto('/donate');

  await expect(page.locator('iframe[src*="zeffy"]').first()).toBeAttached({ timeout: 20_000 });

  // The chip row renders twice (desktop + mobile variants) — hence .first(), or
  // strict mode fails on the duplicate. PayPal's href differs between the two
  // renderings (paypal.me vs paypal.com/paypalme), so match on the handle.
  await expect(page.locator('a[href="https://cash.app/$bayoucharity"]').first()).toBeAttached();
  await expect(page.locator('a[href="https://venmo.com/bayoucharity"]').first()).toBeAttached();
  await expect(page.locator('a[href*="paypal"][href*="bayoucharity"]').first()).toBeAttached();
});
