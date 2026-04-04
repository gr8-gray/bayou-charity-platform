'use client';

// GalleryFilter — Client Component
// Tab bar for switching between Photos and Videos tabs

import { motion } from 'framer-motion';

export type GalleryTab = 'photos' | 'videos';

interface GalleryFilterProps {
  activeTab: GalleryTab;
  onTabChange: (tab: GalleryTab) => void;
}

const TABS: { value: GalleryTab; label: string }[] = [
  { value: 'photos', label: 'Photos' },
  { value: 'videos', label: 'Videos' },
];

export default function GalleryFilter({ activeTab, onTabChange }: GalleryFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Gallery content tabs"
      className="flex gap-2 mb-8"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.value)}
            className={[
              'relative px-6 py-2 rounded-full font-serif text-sm font-medium',
              'transition-colors duration-200 focus:outline-none focus-visible:ring-2',
              'focus-visible:ring-amber',
              isActive
                ? 'text-white dark:text-green-deep'
                : 'text-text-mid dark:text-cream/70 hover:text-text-dark dark:hover:text-cream',
            ].join(' ')}
          >
            {isActive && (
              <motion.span
                layoutId="gallery-tab-pill"
                className="absolute inset-0 rounded-full bg-amber dark:bg-gold"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
