'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@bayou/supabase';

const baseTabs = [
  { href: '/members/feed',      label: '📸 Feed' },
  { href: '/members/community', label: '💬 Community' },
  { href: '/members/map',       label: '🗺️ Map' },
  { href: '/members/gallery',   label: '🌊 Gallery' },
  { href: '/members/profile',   label: '🎣 Profile' },
];

const adminTab = { href: '/members/admin', label: '⚙️ Admin' };

export function MembersNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<'member' | 'guide' | 'admin'>('member');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          if (data?.role) setRole(data.role as 'member' | 'guide' | 'admin');
        });
    });
  }, []);

  const tabs = role === 'admin' ? [...baseTabs, adminTab] : baseTabs;

  return (
    <nav className="sticky top-20 z-30 bg-cream/90 dark:bg-green-deep/90 backdrop-blur-md border-b border-gold/20 dark:border-gold/10">
      <div className="container mx-auto px-4">
        <ul className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={[
                    'relative px-4 py-2 rounded-full text-sm font-serif whitespace-nowrap transition-colors',
                    isActive
                      ? 'bg-gold text-green-deep font-semibold'
                      : 'text-text-mid dark:text-cream/70 hover:text-amber dark:hover:text-amber',
                  ].join(' ')}
                >
                  {isActive && (
                    <motion.span
                      layoutId="members-nav-pill"
                      className="absolute inset-0 rounded-full bg-gold"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
