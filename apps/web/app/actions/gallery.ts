'use server';

import { createClient } from '@supabase/supabase-js';
import { GALLERY_PENDING_BUCKET, GALLERY_PUBLIC_BUCKET } from '@/lib/gallery';

// Auth note: /members/admin/* is protected by middleware — only verified admins
// reach this action. next/headers cookies() is not available in CF Workers Edge
// runtime, so we rely on middleware auth + service role key for the operation.

export async function deleteGalleryPhoto(id: string, storagePath: string) {
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Clean both buckets — approval COPIES pending→public (see lib/gallery.ts),
  // so an approved photo's object exists in both places.
  const { error: pubErr } = await adminClient.storage.from(GALLERY_PUBLIC_BUCKET).remove([storagePath]);
  const { error: pendingErr } = await adminClient.storage.from(GALLERY_PENDING_BUCKET).remove([storagePath]);
  if (pubErr && pendingErr) {
    console.error('[deleteGalleryPhoto] storage delete failed both buckets:', pubErr.message, pendingErr.message);
  }

  const { error } = await adminClient.from('gallery_submissions').delete().eq('id', id);
  if (error) {
    console.error('[deleteGalleryPhoto] DB delete error:', error.message);
    throw new Error(error.message);
  }
}
