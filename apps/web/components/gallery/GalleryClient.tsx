'use client';

// GalleryClient — Client Component
// Receives pre-fetched events + submissions from the Server Component parent.
// Manages event tab state and secondary Photos/Videos filter.

import { useState, useEffect, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import type { Database } from '@bayou/supabase/types';
import GalleryGrid, { GALLERY_IMAGES, GALLERY_VIDEOS } from './GalleryGrid';
import GalleryFilter, { type GalleryTab } from './GalleryFilter';
import Lightbox from './Lightbox';
import UploadForm from './UploadForm';
import { createClient } from '@bayou/supabase';
import type { User } from '@supabase/supabase-js';

type GalleryEvent = Database['public']['Tables']['gallery_events']['Row'];
type GallerySubmission = Database['public']['Tables']['gallery_submissions']['Row'];

interface GalleryClientProps {
  events: GalleryEvent[];
  submissions: GallerySubmission[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function GalleryClient({ events }: GalleryClientProps) {
  const [activeEventId, setActiveEventId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<GalleryTab>('photos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Resolve auth session client-side — UploadForm only shown when signed in
  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });
    return () => { mounted = false; };
  }, []);

  // IntersectionObserver for lazy video autoplay
  useEffect(() => {
    if (activeTab !== 'videos') return;

    const videos = document.querySelectorAll<HTMLVideoElement>('video[data-lazy]');

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            void video.play().catch(() => {/* autoplay blocked — user gesture required */});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.3 },
    );

    videos.forEach((v) => observerRef.current?.observe(v));
    return () => observerRef.current?.disconnect();
  }, [activeTab]);

  function handlePrev() {
    setLightboxIndex((i) =>
      i !== null && GALLERY_IMAGES.length > 0
        ? (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
        : null,
    );
  }

  function handleNext() {
    setLightboxIndex((i) =>
      i !== null && GALLERY_IMAGES.length > 0
        ? (i + 1) % GALLERY_IMAGES.length
        : null,
    );
  }

  return (
    <section id="gallery" className="py-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="glass-card p-10 md:p-14">

          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="mb-10 text-center md:text-left"
          >
            <p className="font-handwritten text-amber dark:text-gold text-lg mb-1">
              BFF Memories
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-green-deep dark:text-cream mb-3">
              Life on the Bayou
            </h1>
            <p className="font-serif text-text-mid dark:text-cream/70 max-w-2xl mx-auto md:mx-0">
              Thank you for making memories with Bayou Charity. Select tabs below and upload
              pictures and videos. Click any photo to view full size.
            </p>
          </motion.div>

          {/* Event tab strip — "All" first, then one pill per event */}
          {events.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="mb-4"
            >
              <div
                role="tablist"
                aria-label="Gallery event tabs"
                className="flex flex-wrap gap-2"
              >
                {/* All pill — always first */}
                <button
                  role="tab"
                  aria-selected={activeEventId === 'all'}
                  onClick={() => setActiveEventId('all')}
                  className={[
                    'relative px-4 py-2 rounded-full text-sm font-serif whitespace-nowrap transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber',
                    activeEventId === 'all'
                      ? 'bg-gold text-green-deep font-semibold'
                      : 'text-text-mid dark:text-cream/70 hover:text-amber dark:hover:text-amber',
                  ].join(' ')}
                >
                  {activeEventId === 'all' && (
                    <motion.span
                      layoutId="gallery-event-pill"
                      className="absolute inset-0 rounded-full bg-gold"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">All</span>
                </button>

                {/* One pill per event */}
                {events.map((event) => {
                  const isActive = activeEventId === event.id;
                  return (
                    <button
                      key={event.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveEventId(event.id)}
                      className={[
                        'relative px-4 py-2 rounded-full text-sm font-serif whitespace-nowrap transition-colors',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber',
                        isActive
                          ? 'bg-gold text-green-deep font-semibold'
                          : 'text-text-mid dark:text-cream/70 hover:text-amber dark:hover:text-amber',
                      ].join(' ')}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="gallery-event-pill"
                          className="absolute inset-0 rounded-full bg-gold"
                          style={{ zIndex: -1 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative">{event.name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Secondary Photos/Videos filter */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <GalleryFilter activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>

          {/* Photos grid */}
          {activeTab === 'photos' && (
            <motion.div
              key="photos"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <GalleryGrid onImageClick={setLightboxIndex} />
            </motion.div>
          )}

          {/* Videos grid */}
          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {GALLERY_VIDEOS.map((video) => (
                <div key={video.src} className="rounded-xl overflow-hidden bg-green-water dark:bg-green-deep/80 shadow-md">
                  {video.controls ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      controls
                      preload="metadata"
                      className="w-full rounded-lg"
                    >
                      <source src={video.src} type="video/mp4" />
                    </video>
                  ) : (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      data-lazy
                      src={video.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full aspect-video object-cover"
                      aria-label={video.label}
                    />
                  )}
                  <p className="px-4 py-3 font-serif text-sm text-cream/80 dark:text-cream/70">
                    {video.label}
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Upload form — auth gated */}
          {user && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="mt-16 max-w-lg"
            >
              <UploadForm userId={user.id} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
}
