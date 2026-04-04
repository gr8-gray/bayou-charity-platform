'use client';

// /members/profile — Auth enforced by middleware
import { useState, useEffect } from 'react';
import { createClient } from '@bayou/supabase';
import { ProfileEditor } from '@/components/members/ProfileEditor';
import type { Database } from '@bayou/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/sign-in'; return; }
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => {
          if (!data) { window.location.href = '/sign-in'; return; }
          setProfile(data);
        });
    });
  }, []);

  if (!profile) return null;
  return <ProfileEditor profile={profile} />;
}
