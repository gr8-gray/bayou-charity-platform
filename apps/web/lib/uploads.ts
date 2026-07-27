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
