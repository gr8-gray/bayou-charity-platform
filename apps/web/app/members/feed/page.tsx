'use client';

// /members/feed — Auth enforced by middleware
import { useState, useEffect } from 'react';
import { createClient } from '@bayou/supabase';
import SocialFeed from '@/components/members/SocialFeed';

export default function FeedPage() {
  const [state, setState] = useState<{ userId: string; role: 'member' | 'guide' | 'admin' } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/sign-in'; return; }
      supabase.from('profiles').select('role').eq('id', session.user.id).single()
        .then(({ data }) => setState({
          userId: session.user.id,
          role: (data?.role ?? 'member') as 'member' | 'guide' | 'admin',
        }));
    });
  }, []);

  if (!state) return null;
  return <SocialFeed userId={state.userId} role={state.role} />;
}
