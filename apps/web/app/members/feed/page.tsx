'use client';

// /members/feed — Auth enforced by middleware
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@bayou/supabase';
import SocialFeed from '@/components/members/SocialFeed';

export default function FeedPage() {
  const [state, setState] = useState<{ userId: string; role: 'member' | 'guide' | 'admin' } | null>(null);
  const [error, setError] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
      if (cancelled) return;
      if (sessionErr || !session) { setError(true); return; }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (cancelled) return;
      setState({
        userId: session.user.id,
        role: (data?.role ?? 'member') as 'member' | 'guide' | 'admin',
      });
    }

    load();
    return () => { cancelled = true; };
  }, [supabase]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="font-serif text-text-mid dark:text-cream/60">
          Unable to load your session.{' '}
          <a href="/sign-in" className="text-amber hover:text-amber/80 underline">Sign in again</a>
        </p>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="text-center py-12">
        <p className="font-serif text-text-mid dark:text-cream/60">Loading your feed…</p>
      </div>
    );
  }

  return <SocialFeed userId={state.userId} role={state.role} />;
}
