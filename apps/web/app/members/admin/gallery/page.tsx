'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@bayou/supabase';
import { AdminGalleryManager } from '@/components/members/AdminGalleryManager';

export default function AdminGalleryPage() {
  const [verified, setVerified] = useState(false);
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
      setVerified(true);
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

  if (!verified) {
    return (
      <div className="text-center py-12">
        <p className="font-serif text-text-mid dark:text-cream/60">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/members/admin"
          className="font-serif text-sm text-text-mid dark:text-cream/60 hover:text-amber transition-colors"
        >
          ← Admin Panel
        </Link>
        <h1 className="font-display text-2xl text-green-deep dark:text-cream">Gallery Photos</h1>
      </div>
      <AdminGalleryManager />
    </div>
  );
}
