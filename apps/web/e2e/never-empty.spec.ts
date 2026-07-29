import { test, expect } from '@playwright/test';

// Never-empty feed backfill (design decision 2026-07-28, lib/backfill.ts).
//
// The ~90-day archival cron had emptied almost everything: at time of writing prod
// holds 0 active / 4 archived pins, 0 active / 1 archived trip, 3 active forum
// threads, and empty classifieds/recipes/guide_postings. Under the old
// `archived_at IS NULL` filters the feed and trips list rendered blank pages.
// The rule under test: every member content list shows at least
// min(3, total rows for that list) items, topping up with the most recent
// archived items — with no "ARCHIVED" stigma on the backfilled cards.
//
// Prod-safe: read-only page assertions, no writes. Runs in the `authenticated`
// project (storageState from auth.setup.ts; credentials come only from the
// E2E_EMAIL / E2E_PASSWORD secrets).

test.describe('never-empty backfill', () => {
  test('member feed backfills archived pins instead of an empty state', async ({ page }) => {
    await page.goto('/members/feed');

    // Feed posts render as <article> cards. All pins are archived, and 4 exist,
    // so the backfill floor is min(3, 4) = 3.
    const posts = page.locator('article');
    await expect(posts.first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/No posts yet/)).toHaveCount(0);
    expect(await posts.count()).toBeGreaterThanOrEqual(3);

    // Backfilled items must not be stigmatized — no ARCHIVED badge/banner.
    // (Exact match so member-written captions can't false-positive.)
    await expect(page.getByText('ARCHIVED', { exact: true })).toHaveCount(0);
  });

  test('community trips tab backfills the archived trip instead of an empty state', async ({ page }) => {
    await page.goto('/members/community');

    // Trips is the default sub-tab. Prod has 1 trip total (archived), so the
    // floor is min(3, 1) = 1 — one card, not "No trips posted yet."
    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/No trips posted yet/)).toHaveCount(0);
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });

  test('forum tab still shows its active threads', async ({ page }) => {
    await page.goto('/members/community');

    // Forum has 3 active threads — the backfill helper must pass them through
    // untouched (active items first, no archived rows needed).
    await page.getByRole('button', { name: /Forum/ }).click();
    const threads = page.locator('article');
    await expect(threads.first()).toBeVisible({ timeout: 20_000 });
    expect(await threads.count()).toBeGreaterThanOrEqual(3);
  });
});
