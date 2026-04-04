import { createClient } from '../client';

export async function getComments(pinId: string) {
  const sb = createClient();
  const { data, error } = await sb
    .from('comments')
    .select('*, profiles(display_name, avatar_url)')
    .eq('pin_id', pinId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addComment(pinId: string, content: string) {
  const sb = createClient();
  const { data, error } = await sb
    .from('comments')
    .insert({ pin_id: pinId, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}
