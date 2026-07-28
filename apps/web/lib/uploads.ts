// Single source of truth for client-side photo upload size limits.
//
// This limit was previously duplicated as a hardcoded literal across four upload
// components (gallery UploadForm, MemberGallery, PinsMap, ProfileEditor). Raising
// it in one place left the others at 5 MB — which is why the cap "kept coming
// back." Import from here so there is one value to change.
//
// Server side: the pin-photos and avatars Supabase buckets are set to 10 MB; the
// gallery buckets inherit the project default. Keep this at or below those.
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_UPLOAD_LABEL = '10 MB';

// Accepted image types — the same list everywhere a photo can be picked.
// This was previously five hand-copied `accept="image/jpeg,..."` literals (and
// one bare `image/*` on the public gallery form that silently let HEIC into the
// review queue). GIF is deliberately included; HEIC/HEIF is deliberately NOT —
// browsers can't render it, so it must be rejected before upload, not after an
// admin approves a photo nobody can see.
export const ACCEPTED_IMAGE_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

// Value for <input accept=...> — keep it derived so the picker filter and the
// validator can never disagree.
export const ACCEPTED_IMAGE_ACCEPT = ACCEPTED_IMAGE_MIME.join(',');

// Returns a user-facing error message, or null if the file is uploadable.
// Callers surface the message however they surface errors (setError, alert).
// The size message must keep matching /or smaller/i — e2e/upload.spec.ts
// asserts on that phrase for the size gate.
export function validateUploadFile(file: File): string | null {
  if (!(ACCEPTED_IMAGE_MIME as readonly string[]).includes(file.type)) {
    return 'Please upload a JPEG, PNG, or WebP image. HEIC/HEIF files are not supported by web browsers.';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `File must be ${MAX_UPLOAD_LABEL} or smaller.`;
  }
  return null;
}
