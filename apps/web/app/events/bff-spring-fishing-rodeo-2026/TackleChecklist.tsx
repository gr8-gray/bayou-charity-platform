'use client';

import { useState } from 'react';

interface Category {
  icon: string;
  label: string;
  items: string[];
}

const CATEGORIES: Category[] = [
  {
    icon: '🎣',
    label: 'Gear',
    items: ['Rods & reels', 'Bait', 'Cash for fresh shrimp'],
  },
  {
    icon: '🦺',
    label: 'Safety',
    items: ['Life jackets (adults)', 'Life jackets for kids'],
  },
  {
    icon: '👕',
    label: 'Wear',
    items: ['Light, loose-fitting clothes', 'Hat', 'Sunglasses'],
  },
  {
    icon: '💧',
    label: 'Vitals',
    items: ['Sunscreen', 'Bug spray', 'Water & drinks'],
  },
  {
    icon: '🍖',
    label: 'Food',
    items: ['Grill food', 'Snacks'],
  },
  {
    icon: '💛',
    label: 'Appreciation',
    items: ['Cash tips for the guides'],
  },
];

export function TackleChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className="mt-10 pt-8 border-t border-cream/10">
      <h4 className="font-display text-[1.1rem] text-cream mb-5">
        🎒 Pack Your Tackle — The Full Checklist
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.label}
            className="rounded-[10px] border border-cream/10 bg-cream/5 p-4"
          >
            <h5 className="text-[0.72rem] font-bold tracking-[0.1em] uppercase text-gold mb-3">
              {cat.icon} {cat.label}
            </h5>
            {cat.items.map((item) => {
              const key = `${cat.label}:${item}`;
              const isChecked = checked.has(key);
              return (
                <label
                  key={key}
                  className={`flex items-start gap-2 mb-1.5 text-[0.82rem] cursor-pointer leading-snug select-none transition-opacity ${
                    isChecked ? 'line-through opacity-40' : 'text-cream/90'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(key)}
                    className="mt-0.5 flex-shrink-0 accent-gold"
                  />
                  {item}
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
