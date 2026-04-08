// Innisfree page — App Router Server Component
// Nav padding rule: hero page → pt-0

import type { Metadata } from 'next';
import Innisfree from '@/components/innisfree';
import PageBackground from '@/components/shared/PageBackground';

export const metadata: Metadata = {
  title: 'INNISFREE — Bayou Charity',
  description: 'Meet INNISFREE — the heart of Bayou Family Fishing. A 22-foot vessel built for the bayous of Plaquemines Parish.',
  openGraph: {
    title: 'INNISFREE — The Heart of Bayou Family Fishing',
    description: 'Meet INNISFREE — a 22-foot vessel built for the bayous of Plaquemines Parish, carrying veterans and youth onto the water.',
    url: 'https://bayoucharity.org/innisfree',
    images: [
      {
        url: 'https://bayoucharity.org/Photos/header%20image%20for%20INNISFREE%20tab.jpg',
        width: 1200,
        height: 630,
        alt: 'INNISFREE — Bayou Family Fishing vessel on the Louisiana bayou',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INNISFREE — The Heart of Bayou Family Fishing',
    description: 'A 22-foot vessel built for the bayous of Plaquemines Parish.',
    images: ['https://bayoucharity.org/Photos/header%20image%20for%20INNISFREE%20tab.jpg'],
  },
};

export default function InnisfreePage() {
  return (
    <>
      <PageBackground page="innisfree" />
      <main className="relative z-10 pt-0">
        <Innisfree />
      </main>
    </>
  );
}
