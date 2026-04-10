'use server';

import { createClient } from '@supabase/supabase-js';

// Auth note: /members/admin/* is protected by middleware — only verified admins
// reach this action. next/headers cookies() is not available in CF Workers Edge
// runtime, so we rely on middleware auth + service role key for the operation.

export async function deleteGalleryPhoto(id: string, storagePath: string) {
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Try both buckets — pending photos in gallery-pending, approved in gallery-public
  const { error: pubErr } = await adminClient.storage.from('gallery-public').remove([storagePath]);
  const { error: pendingErr } = await adminClient.storage.from('gallery-pending').remove([storagePath]);
  if (pubErr && pendingErr) {
    console.error('[deleteGalleryPhoto] storage delete failed both buckets:', pubErr.message, pendingErr.message);
  }

  const { error } = await adminClient.from('gallery_submissions').delete().eq('id', id);
  if (error) {
    console.error('[deleteGalleryPhoto] DB delete error:', error.message);
    throw new Error(error.message);
  }
}
