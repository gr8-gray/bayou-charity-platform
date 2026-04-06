'use client';

// /members/admin — Admin role enforced by middleware + client check
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@bayou/supabase';
import { AdminPanel } from '@/components/members/AdminPanel';

export default function AdminPage() {
  const [adminId, setAdminId] = useState<string | null>(null);
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
      if (data?.role !== 'admin') { window.location.href = '/members/feed'; return; }
      setAdminId(session.user.id);
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

  if (!adminId) {
    return (
      <div className="text-center py-12">
        <p className="font-serif text-text-mid dark:text-cream/60">Loading admin panel…</p>
      </div>
    );
  }

  return <AdminPanel adminId={adminId} />;
}
