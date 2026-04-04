import { createClient } from '../client';

export async function getGalleryEvents() {
  const sb = createClient();
  const { data, error } = await sb.from('gallery_events').select('*').order('event_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getGallerySubmissions(status: 'pending' | 'approved' = 'approved') {
  const sb = createClient();
  const { data, error } = await sb.from('gallery_submissions').select('*').eq('status', status);
  if (error) throw error;
  return data;
}
