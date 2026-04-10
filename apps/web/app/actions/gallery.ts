'use server';

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@bayou/supabase/server';
import { createClient } from '@supabase/supabase-js';

export async function deleteGalleryPhoto(id: string, storagePath: string) {
  // Step 1 — auth
  let cookieStore: Awaited<ReturnType<typeof cookies>>;
  try {
    cookieStore = await cookies();
  } catch (e) {
    console.error('[deleteGalleryPhoto] cookies() failed:', e);
    throw e;
  }

  const authClient = createServerSupabaseClient(cookieStore);

  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError) console.error('[deleteGalleryPhoto] getUser error:', authError.message);
  if (authError || !user) throw new Error('Unauthorized');

  // Step 2 — role check
  const { data: profile, error: profileError } = await authClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) console.error('[deleteGalleryPhoto] profile fetch error:', profileError.message);
  if (profile?.role !== 'admin') {
    console.error('[deleteGalleryPhoto] role check failed — role:', profile?.role);
    throw new Error('Forbidden');
  }

  // Step 3 — admin client
  let adminClient: ReturnType<typeof createClient>;
  try {
    adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  } catch (e) {
    console.error('[deleteGalleryPhoto] createClient failed:', e);
    throw e;
  }

  // Step 4 — storage delete (non-fatal)
  const { error: pubErr } = await adminClient.storage.from('gallery-public').remove([storagePath]);
  const { error: pendingErr } = await adminClient.storage.from('gallery-pending').remove([storagePath]);
  if (pubErr && pendingErr) {
    console.error('[deleteGalleryPhoto] storage delete failed both buckets:', pubErr.message, pendingErr.message);
  }

  // Step 5 — DB delete
  const { error } = await adminClient.from('gallery_submissions').delete().eq('id', id);
  if (error) {
    console.error('[deleteGalleryPhoto] DB delete error:', error.message);
    throw new Error(error.message);
  }
}
