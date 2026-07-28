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
