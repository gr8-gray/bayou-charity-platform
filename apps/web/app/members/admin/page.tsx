'use client';

// /members/admin — Admin role enforced by middleware + client check
import { useState, useEffect } from 'react';
import { createClient } from '@bayou/supabase';
import { AdminPanel } from '@/components/members/AdminPanel';

export default function AdminPage() {
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/sign-in'; return; }
      supabase.from('profiles').select('role').eq('id', session.user.id).single()
        .then(({ data }) => {
          if (data?.role !== 'admin') { window.location.href = '/members/feed'; return; }
          setAdminId(session.user.id);
        });
    });
  }, []);

  if (!adminId) return null;
  return <AdminPanel adminId={adminId} />;
}
