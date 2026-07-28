import { test, expect } from '@playwright/test';

// Cheap tripwires for the public surface: home renders real content and the
// members area actually enforces auth. Not exhaustive — the deep assertions
// live in the per-path specs.

test('home page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/bayou/i);
});

test('sign-in page offers the OAuth providers', async ({ page }) => {
  await page.goto('/sign-in');
  await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
});

test('members area redirects anonymous visitors to sign-in', async ({ page }) => {
  await page.goto('/members/gallery');
  await expect(page).toHaveURL(/sign-in/);
});

test('gallery Fish Pics tab renders member catches', async ({ page }) => {
  // Pins age off the members MAP via a daily archival cron, but the gallery
  // shows them regardless — this tab silently sat empty for two weeks when the
  // query filtered archived pins (2026-07-28). Data-dependency: asserts >=1
  // catch, which holds as long as any member has ever pinned a photo (4 in prod
  // at time of writing; pins are never deleted, only archived).
  await page.goto('/gallery');
  await page.locator('button:has-text("Fish Pics"), [role="tab"]:has-text("Fish Pics")').first().click();
  await expect(page.locator('img[src*="pin-photos"]').first()).toBeVisible({ timeout: 15_000 });
});
