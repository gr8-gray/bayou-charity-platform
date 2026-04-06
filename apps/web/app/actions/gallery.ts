'use server';

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@bayou/supabase/server';
import { createClient } from '@supabase/supabase-js';

export async function deleteGalleryPhoto(id: string, storagePath: string) {
  // Verify caller is an authenticated admin
  const cookieStore = await cookies();
  const authClient = createServerSupabaseClient(cookieStore);

  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { data: profile } = await authClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') throw new Error('Forbidden');

  // Service role client for privileged storage + DB operations
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Try both buckets — pending photos live in gallery-pending, approved in gallery-public
  const { error: pubErr } = await adminClient.storage.from('gallery-public').remove([storagePath]);
  const { error: pendingErr } = await adminClient.storage.from('gallery-pending').remove([storagePath]);
  if (pubErr && pendingErr) {
    console.error('Storage delete: file not found in either bucket', pubErr.message);
  }

  const { error } = await adminClient.from('gallery_submissions').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
