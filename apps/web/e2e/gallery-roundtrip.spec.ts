import { test, expect } from '@playwright/test';

// Round-trip proof of the approve-copy contract (see lib/gallery.ts).
//
// Flow: programmatically upload a generated ~100 KB JPEG to gallery-pending and
// insert its gallery_submissions row (the exact shape UploadForm writes), then
// drive the REAL admin UI at /members/admin/gallery to Approve it, then assert
// the gallery-public object URL serves 200 image/*. The Approve click
// exercising copyPendingToPublic IS the point of this spec — never replace it
// with a REST status flip.
//
// Runs in the `authenticated` project (storageState = the e2e admin account).
// Talks to PROD Supabase (there is no staging), so everything created here is
// deleted in the finally block and the deletion is verified: object gone from
// BOTH buckets, row gone from the table. Row deletion relies on the
// `gallery_submissions_admin_delete` RLS policy (added 2026-07-28 — before
// that, only the service-role key could delete rows).

const SUPABASE_URL = 'https://osiramhnynhwmlfyuqcp.supabase.co';
// The anon key is public by design (it ships in every client bundle).
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zaXJhbWhueW5od21sZnl1cWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzk1MTksImV4cCI6MjA4ODc1NTUxOX0.1jMxPIt5t60D8Qvl0lltRLnOgH2vFas0q4Ix2ojpsfM';

// Same trick as upload.spec.ts: valid JPEG magic bytes + EOI marker, junk in
// between — enough for storage to accept it and serve image/jpeg back.
function fakeJpeg(bytes: number): Buffer {
  const buf = Buffer.alloc(bytes, 0x20);
  Buffer.from([0xff, 0xd8, 0xff, 0xe0]).copy(buf, 0);
  buf[bytes - 2] = 0xff;
  buf[bytes - 1] = 0xd9;
  return buf;
}

test('admin approve copies the pending photo into gallery-public', async ({ page }) => {
  test.setTimeout(120_000);

  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  if (!email || !password) {
    throw new Error('E2E_EMAIL / E2E_PASSWORD not set — export them or add GitHub secrets.');
  }

  // REST session for setup/cleanup — the browser storageState only carries
  // cookies, and setup/cleanup must not depend on the UI under test.
  const tokenRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  expect(tokenRes.status, 'password grant should succeed').toBe(200);
  const session = await tokenRes.json();
  const uid: string = session.user.id;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${session.access_token}`,
  };

  const stamp = Date.now();
  const caption = `e2e-roundtrip-${stamp}`;
  // Same path shape UploadForm builds: `${userId}/${Date.now()}.${ext}` — the
  // uid folder prefix is what the gallery-pending INSERT policy checks.
  const storagePath = `${uid}/${stamp}.jpg`;
  const pendingObjectUrl = `${SUPABASE_URL}/storage/v1/object/gallery-pending/${storagePath}`;
  const publicObjectUrl = `${SUPABASE_URL}/storage/v1/object/public/gallery-public/${storagePath}`;
  let rowId: string | null = null;

  try {
    // 1 — Seed: object into gallery-pending, row into gallery_submissions
    //     (same shape as UploadForm's insert: member_id/storage_path/caption/status).
    const uploadRes = await fetch(pendingObjectUrl, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'image/jpeg' },
      // Uint8Array (not Buffer) — the DOM fetch BodyInit typing rejects Buffer.
      body: new Uint8Array(fakeJpeg(100 * 1024)),
    });
    expect(uploadRes.status, 'pending upload should succeed').toBe(200);

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/gallery_submissions`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        member_id: uid,
        storage_path: storagePath,
        caption,
        status: 'pending',
      }),
    });
    expect(insertRes.status, 'submission row insert should succeed').toBe(201);
    rowId = (await insertRes.json())[0].id;

    // 2 — Drive the real admin UI. The tile's <Image> alt is the caption; the
    //     action buttons live in a hover overlay inside the same tile div.
    await page.goto('/members/admin/gallery');
    const img = page.getByAltText(caption);
    await expect(img, 'seeded photo should appear in the admin grid').toBeVisible({ timeout: 20_000 });
    const tile = img.locator('xpath=..');
    await tile.hover();
    await tile.getByRole('button', { name: 'Approve' }).click();
    await expect(page.getByText('Photo approved')).toBeVisible({ timeout: 15_000 });

    // 3 — The whole point: the object must now actually serve from
    //     gallery-public. Before the approve-copy fix this returned 400 —
    //     status flipped, object never copied.
    const publicRes = await page.request.get(publicObjectUrl);
    expect(publicRes.status(), 'gallery-public object should serve after approve').toBe(200);
    expect(publicRes.headers()['content-type']).toMatch(/^image\//);
  } finally {
    // Cleanup — prod data must not outlive the test. Admin storage RLS allows
    // DELETE in both buckets; the row delete uses the admin delete policy.
    await fetch(pendingObjectUrl, { method: 'DELETE', headers });
    await fetch(`${SUPABASE_URL}/storage/v1/object/gallery-public/${storagePath}`, {
      method: 'DELETE',
      headers,
    });
    if (rowId) {
      await fetch(`${SUPABASE_URL}/rest/v1/gallery_submissions?id=eq.${rowId}`, {
        method: 'DELETE',
        headers,
      });
    }

    // Verify the cleanup actually happened — a silent leak here pollutes the
    // live gallery. Public bucket: anonymous URL must no longer serve. The
    // cache-buster matters: the success assertion above primed Supabase's CDN,
    // and the cached 200 outlives the delete. The CDN cache key includes the
    // query string, so a fresh param forces an origin hit.
    const pubGone = await fetch(`${publicObjectUrl}?cleanup-check=${Date.now()}`);
    expect(pubGone.status, 'gallery-public object should be gone').toBeGreaterThanOrEqual(400);
    // Pending bucket is private — check with an authenticated GET.
    const pendGone = await fetch(pendingObjectUrl, { headers });
    expect(pendGone.status, 'gallery-pending object should be gone').toBeGreaterThanOrEqual(400);
    if (rowId) {
      const rowGone = await fetch(
        `${SUPABASE_URL}/rest/v1/gallery_submissions?id=eq.${rowId}&select=id`,
        { headers },
      );
      expect(await rowGone.json(), 'submission row should be deleted').toEqual([]);
    }
  }
});
