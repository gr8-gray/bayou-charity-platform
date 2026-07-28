'use client';

// CommunityTab — shell for /members/community.
//
// Owns the sub-tab strip and mounts exactly one panel at a time via React.lazy
// so a visit to Trips never downloads Forum/Leaderboard/Weather code. Resolves
// the viewer's userId + role from the session ONCE here and passes both down —
// panels deliberately never re-query auth, so if a panel needs the role it
// must come through props. The five content panels (Trips/Guides/Gear/Forum/
// Recipes) are intentional near-twins; read the SIBLING ALERT header in any
// panel before changing one.

import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@bayou/supabase';

type SubTab = 'trips' | 'guides' | 'gear' | 'forum' | 'leaderboard' | 'recipes';

const TAB_LABELS: Record<SubTab, string> = {
  trips: '🚤 Trips',
  guides: '🎣 Guides',
  gear: '🛒 Gear',
  forum: '💬 Forum',
  leaderboard: '🏆 Leaderboard',
  recipes: '🍳 Recipes',
};

const TABS: SubTab[] = ['trips', 'guides', 'gear', 'forum', 'leaderboard', 'recipes'];

const TripsPanel = React.lazy(() => import('./community/TripsPanel'));
const GuidesPanel = React.lazy(() => import('./community/GuidesPanel'));
const GearPanel = React.lazy(() => import('./community/GearPanel'));
const ForumPanel = React.lazy(() => import('./community/ForumPanel'));
const LeaderboardPanel = React.lazy(() => import('./community/LeaderboardPanel'));
const RecipesPanel = React.lazy(() => import('./community/RecipesPanel'));
const WeatherWidget = React.lazy(() => import('./community/WeatherWidget'));

const PanelFallback = (
  <div className="py-8 text-center text-text-mid font-serif">Loading…</div>
);

type Role = 'member' | 'guide' | 'admin';

export default function CommunityTab() {
  const [activeTab, setActiveTab] = useState<SubTab>('trips');
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<Role>('member');
  const [error, setError] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
      if (cancelled) return;
      if (sessionErr || !session) { setError(true); return; }

      const uid = session.user.id;
      setUserId(uid);

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', uid)
        .single();

      if (!cancelled && data?.role) {
        const r = data.role as string;
        if (r === 'guide' || r === 'admin') {
          setRole(r as Role);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [supabase]);

  const renderPanel = () => {
    const props = { userId: userId ?? '', role };
    switch (activeTab) {
      case 'trips':       return <TripsPanel {...props} />;
      case 'guides':      return <GuidesPanel {...props} />;
      case 'gear':        return <GearPanel {...props} />;
      case 'forum':       return <ForumPanel {...props} />;
      case 'leaderboard': return <LeaderboardPanel {...props} />;
      case 'recipes':     return <RecipesPanel {...props} />;
    }
  };

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top row: sub-tabs + weather */}
      <div className="flex justify-between items-start gap-4 mb-6">
        {/* Sub-tab nav */}
        <nav className="glass-card rounded-xl p-1 flex gap-1 flex-wrap" aria-label="Community sections">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'px-4 py-2 rounded-lg text-sm font-serif whitespace-nowrap transition-colors',
                activeTab === tab
                  ? 'bg-gold text-green-deep font-semibold'
                  : 'text-text-mid dark:text-cream/70 hover:text-amber dark:hover:text-amber',
              ].join(' ')}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </nav>

        {/* Weather widget */}
        <div className="max-w-[200px] shrink-0">
          <React.Suspense fallback={<div className="w-[200px]" />}>
            <WeatherWidget />
          </React.Suspense>
        </div>
      </div>

      {/* Panel area */}
      <React.Suspense fallback={PanelFallback}>
        {renderPanel()}
      </React.Suspense>
    </div>
  );
}
