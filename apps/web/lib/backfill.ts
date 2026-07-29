// Single source of truth for the "never-empty feed" rule (approved 2026-07-28).
//
// A daily cron archives community content (~90 days: sets archived_at on pins,
// trips, classifieds, recipes, guide_postings, forum_threads) to keep lists
// seasonal. In a quiet season that left every list filtering
// `archived_at IS NULL` completely blank — a member landing on the feed saw an
// empty page even though the club has months of real content. The rule: a list
// with fewer than MIN_VISIBLE_ITEMS active items tops itself up with the most
// recent archived items, up to the minimum (or as many as exist).
//
// Usage contract for callers (SocialFeed + the community panels):
//   1. Fetch WITHOUT `.is('archived_at', null)` — the helper needs the archived
//      rows to be able to backfill. Keep the list's normal display ordering in
//      the query.
//   2. Pass the rows through backfillArchived() before setState.
//   3. Do NOT visually stigmatize backfilled rows — no "ARCHIVED" banner. The
//      date already on the card is enough context.
//
// Ordering out: active rows first, in the caller's query order; then archived
// backfill, most recently archived first (archived_at desc). For cron-archived
// content archived_at tracks age, so this is "newest first" regardless of how
// the caller sorts its live rows (e.g. trips sort by upcoming trip_date).
//
// Keep this the ONLY implementation — the sibling panels share a skeleton and
// per-panel copies of this logic are exactly how the upload-size cap drifted
// (see lib/uploads.ts).

export const MIN_VISIBLE_ITEMS = 3;

export function backfillArchived<T extends { archived_at: string | null }>(
  rows: T[],
  minVisible: number = MIN_VISIBLE_ITEMS,
): T[] {
  const active = rows.filter((r) => r.archived_at === null);
  if (active.length >= minVisible) return active;

  const archived = rows
    .filter((r) => r.archived_at !== null)
    .sort(
      (a, b) =>
        new Date(b.archived_at as string).getTime() -
        new Date(a.archived_at as string).getTime(),
    );

  return [...active, ...archived.slice(0, minVisible - active.length)];
}
