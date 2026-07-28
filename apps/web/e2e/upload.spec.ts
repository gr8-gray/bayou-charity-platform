import { test, expect } from '@playwright/test';

// THE regression test for the upload-size saga (2026-04 → 2026-07).
//
// History: the 5 MB limit was hardcoded separately in four components. "Fixing" it
// touched one and missed three — three separate sessions, months apart, same bug.
// The fix consolidated the limit into lib/uploads.ts (MAX_UPLOAD_BYTES = 10 MB).
// This test pins the gate from the member's point of view, in BOTH directions:
//   - a 6 MB photo (over the old broken 5 MB, under the real 10 MB) must be ACCEPTED
//   - an 11 MB photo must be REJECTED with the size error
// If anyone ever re-adds a hardcoded `file.size > N` literal in a component, the
// 6 MB case fails and this bug cannot silently return.
//
// Prod-safety: the oversized case never leaves the browser (client gate rejects it).
// The 6 MB case asserts the client gate only — we do not press the final submit, so
// nothing is written to storage.

// A minimal valid JPEG header followed by padding — passes `accept=` and file-type
// sniffing, compresses to nothing in the report.
function fakeJpeg(bytes: number): Buffer {
  const buf = Buffer.alloc(bytes, 0x20);
  Buffer.from([0xff, 0xd8, 0xff, 0xe0]).copy(buf, 0);
  buf[bytes - 2] = 0xff;
  buf[bytes - 1] = 0xd9;
  return buf;
}

const MB = 1024 * 1024;
const SIZE_ERROR = /or smaller/i; // both MemberGallery and PinsMap use "…10 MB or smaller."

test('member gallery accepts a 6 MB photo (the bug that kept coming back)', async ({ page }) => {
  await page.goto('/members/gallery');
  // If auth injection broke, we get bounced to /sign-in — fail loudly on that first.
  await expect(page).not.toHaveURL(/sign-in/, { timeout: 15_000 });

  const fileInput = page.locator('input[type="file"]').first();
  await expect(fileInput).toBeAttached({ timeout: 15_000 });
  await fileInput.setInputFiles({
    name: 'e2e-6mb.jpg',
    mimeType: 'image/jpeg',
    buffer: fakeJpeg(6 * MB),
  });

  await expect(page.getByText(SIZE_ERROR)).toHaveCount(0);
});

test('member gallery rejects an 11 MB photo with the size error', async ({ page }) => {
  await page.goto('/members/gallery');
  await expect(page).not.toHaveURL(/sign-in/, { timeout: 15_000 });

  const fileInput = page.locator('input[type="file"]').first();
  await expect(fileInput).toBeAttached({ timeout: 15_000 });
  await fileInput.setInputFiles({
    name: 'e2e-11mb.jpg',
    mimeType: 'image/jpeg',
    buffer: fakeJpeg(11 * MB),
  });

  await expect(page.getByText(SIZE_ERROR).first()).toBeVisible();
});
