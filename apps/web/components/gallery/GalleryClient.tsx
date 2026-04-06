'use client';

// GalleryClient — Client Component
// Receives pre-fetched events + submissions from the Gallery index component.
// Manages event tab state, filters submissions by active tab, handles Fish Pics.

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import type { Database } from '@bayou/supabase/types';
import GalleryGrid from './GalleryGrid';
import type { GalleryImage } from './GalleryGrid';
import GalleryFilter, { type GalleryTab } from './GalleryFilter';
import Lightbox from './Lightbox';
import UploadForm from './UploadForm';
import { createClient } from '@bayou/supabase';
import type { User } from '@supabase/supabase-js';

type GalleryEvent = Database['public']['Tables']['gallery_events']['Row'];
type GallerySubmission = Database['public']['Tables']['gallery_submissions']['Row'];

// Fish Pics tab uses a special sentinel value (not a real event UUID)
const FISH_PICS_TAB = 'fish';

const SUPABASE_STORAGE_URL =
  'https://osiramhnynhwmlfyuqcp.supabase.co/storage/v1/object/public/gallery-public';

function submissionToImage(sub: GallerySubmission, index: number): GalleryImage {
  return {
    src: `${SUPABASE_STORAGE_URL}/${sub.storage_path}`,
    alt: sub.caption || 'BFF club photo',
    caption: sub.caption || undefined,
    width: 1200,
    height: 900,
    index,
  };
}

interface GalleryClientProps {
  events: GalleryEvent[];
  submissions: GallerySubmission[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function GalleryClient({ events, submissions }: GalleryClientProps) {
  const [activeEventId, setActiveEventId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<GalleryTab>('photos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [fishPins, setFishPins] = useState<GalleryImage[]>([]);
  const [fishLoading, setFishLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Auth check
  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });
    return () => { mounted = false; };
  }, []);

  // Lazy-load Fish Pics when that tab is selected
  useEffect(() => {
    if (activeEventId !== FISH_PICS_TAB) return;
    if (fishPins.length > 0 || fishLoading) return;

    setFishLoading(true);
    const supabase = createClient();
    supabase
      .from('pins')
      .select('id, photo_url, caption, species, location_name')
      .eq('flagged', false)
      .is('archived_at', null)
      .not('photo_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        const imgs: GalleryImage[] = (data ?? []).map((pin, i) => ({
          src: pin.photo_url!,
          alt: pin.species
            ? `${pin.species} caught ${pin.location_name ? 'at ' + pin.location_name : 'on the bayou'}`
            : pin.caption || 'BFF member catch',
          caption: pin.caption || undefined,
          width: 1200,
          height: 900,
          index: i,
        }));
        setFishPins(imgs);
        setFishLoading(false);
      });
  }, [activeEventId, fishPins.length, fishLoading]);

  // Derive the displayed images from active tab + active event
  const displayImages = useMemo<GalleryImage[]>(() => {
    if (activeEventId === FISH_PICS_TAB) return fishPins;
    const filtered =
      activeEventId === 'all'
        ? submissions
        : submissions.filter((s) => s.event_id === activeEventId);
    return filtered.map((s, i) => submissionToImage(s, i));
  }, [activeEventId, submissions, fishPins]);

  // IntersectionObserver for lazy video autoplay
  useEffect(() => {
    if (activeTab !== 'videos') return;
    const videos = document.querySelectorAll<HTMLVideoElement>('video[data-lazy]');
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            void video.play().catch(() => { /* autoplay blocked */ });
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
      i !== null && displayImages.length > 0
        ? (i - 1 + displayImages.length) % displayImages.length
        : null,
    );
  }

  function handleNext() {
    setLightboxIndex((i) =>
      i !== null && displayImages.length > 0
        ? (i + 1) % displayImages.length
        : null,
    );
  }

  // Videos — for now always show all static videos regardless of tab
  const GALLERY_VIDEOS = [
    { src: '/Photos/club member casting video (gallery).mp4', label: 'Club member casting on the bayou' },
    { src: '/Photos/fishing knots class video (gallery).mp4', label: 'Fishing knots class' },
    { src: '/Photos/BFF club page header video.mp4',          label: 'BFF club overview' },
    { src: '/Photos/check-twice-video-boat.mp4',              label: 'The Check Twice on the Bayou' },
  ];

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

          {/* Event tab strip */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            className="mb-4"
          >
            <div role="tablist" aria-label="Gallery event tabs" className="flex flex-wrap gap-2">
              {/* All pill */}
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

              {/* Event pills from DB */}
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

              {/* Fish Pics — hardcoded last */}
              <button
                role="tab"
                aria-selected={activeEventId === FISH_PICS_TAB}
                onClick={() => setActiveEventId(FISH_PICS_TAB)}
                className={[
                  'relative px-4 py-2 rounded-full text-sm font-serif whitespace-nowrap transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber',
                  activeEventId === FISH_PICS_TAB
                    ? 'bg-gold text-green-deep font-semibold'
                    : 'text-text-mid dark:text-cream/70 hover:text-amber dark:hover:text-amber',
                ].join(' ')}
              >
                {activeEventId === FISH_PICS_TAB && (
                  <motion.span
                    layoutId="gallery-event-pill"
                    className="absolute inset-0 rounded-full bg-gold"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">Fish Pics</span>
              </button>
            </div>
          </motion.div>

          {/* Photos/Videos filter */}
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
            <motion.div key="photos" initial="hidden" animate="visible" variants={fadeUp}>
              {activeEventId === FISH_PICS_TAB && fishLoading ? (
                <p className="font-serif text-sm text-text-mid dark:text-cream/60 py-8 text-center">
                  Loading fish pics…
                </p>
              ) : displayImages.length === 0 ? (
                <p className="font-serif text-sm text-text-mid dark:text-cream/60 py-8 text-center">
                  No photos yet for this event.
                </p>
              ) : (
                <GalleryGrid images={displayImages} onImageClick={setLightboxIndex} />
              )}
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
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video controls preload="metadata" className="w-full rounded-lg">
                    <source src={video.src} type="video/mp4" />
                  </video>
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
        images={displayImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
}
