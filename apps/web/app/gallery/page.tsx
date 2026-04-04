// Gallery page — App Router Server Component shell
// Nav padding rule: interior page → pt-24
// Interactive gallery (lightbox, upload, tabs) lives in Client Components below

import type { Metadata } from 'next';
import Gallery from '@/components/gallery';
import PageBackground from '@/components/shared/PageBackground';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gallery — Bayou Family Fishing',
  description: 'Life on the bayou — photos and videos from Bayou Family Fishing club events, fishing trips, and community gatherings.',
};

export default function GalleryPage() {
  return (
    <>
      <PageBackground page="gallery" />
      <main className="relative z-10 pt-24">
        <Gallery />
      </main>
    </>
  );
}
