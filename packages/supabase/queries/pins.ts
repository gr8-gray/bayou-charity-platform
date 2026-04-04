import { createClient } from '../client';

export async function getPins() {
  const sb = createClient();
  const { data, error } = await sb.from('pins').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createPin(pin: { title: string; lat: number; lng: number; description?: string }) {
  const sb = createClient();
  const { data, error } = await sb.from('pins').insert(pin).select().single();
  if (error) throw error;
  return data;
}
