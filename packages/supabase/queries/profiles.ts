import { createClient } from '../client';

export async function getProfile(userId: string) {
  const sb = createClient();
  const { data, error } = await sb.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: { display_name?: string; avatar_url?: string }) {
  const sb = createClient();
  const { data, error } = await sb.from('profiles').update(updates).eq('id', userId).select().single();
  if (error) throw error;
  return data;
}
