'use client';

// /members/map — Auth enforced by middleware
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@bayou/supabase';

// Leaflet is ~140KB — isolate to /members/map chunk only
const PinsMap = dynamic(
  () => import('@/components/members/PinsMap').then((m) => ({ default: m.PinsMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 animate-pulse rounded-xl bg-green-deep/20" />
    ),
  }
);

export default function MapPage() {
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
  return <PinsMap userId={state.userId} role={state.role} />;
}
