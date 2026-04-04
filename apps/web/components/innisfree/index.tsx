'use client'

/**
 * Innisfree — Bayou Charity
 * Phase 1 build. Client Component — next/dynamic with ssr:false requires
 * a Client Component boundary in Next.js 16 / Turbopack.
 * Static content: marshland story, 4-phase build plan, photography.
 * Hero page: pt-0 (no top padding — Nav floats above).
 */

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Leaflet is SSR-unsafe — load only on client
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl bg-green-water/20 dark:bg-green-deep animate-pulse"
      style={{ height: '420px' }}
      aria-label="Map loading…"
    />
  ),
})

// ─── Phase plan data ──────────────────────────────────────────────────────────

const PHASES = [
  {
    label: 'Phase 1 — The Dock',
    items: [
      'Repair and extend usable dock space, and clear debris in the water.',
      'Install fish cleaning station.',
      'Innisfree is ready to host day trips for dock fishing and inspiration.',
    ],
  },
  {
    label: 'Phase 2 — The Hut',
    items: [
      'Replace floor and erect walls on the hut.',
      'Wire for generator power and future solar power.',
      'Install air conditioning.',
      'Innisfree is now an overnight experience.',
    ],
  },
  {
    label: 'Phase 3 — The Catwalk',
    items: [
      'Erect stairs to the marshland.',
      'Build elevated temporary catwalks on the footprint of our future camp community and to the redfish pond beyond.',
      'Begin bulkhead.',
    ],
  },
  {
    label: 'Phase 4 — The Camp',
    items: [
      'Complete all elevated walkways and foundations for camps and central deck, and the observation tower.',
      'Build camps and wire for generators.',
      'Host Plank Owner grand opening of the camps at Innisfree.',
    ],
  },
]

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[480px] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/Photos/header image for INNISFREE tab.jpg"
          alt="INNISFREE marshland at golden hour"
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(13,43,62,0.36) 0%, rgba(26,74,107,0.42) 55%, rgba(13,43,62,0.62) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <span
          className="block text-sm uppercase tracking-[0.4em] mb-4 text-amber"
          style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem' }}
        >
          Bayou Charity
        </span>
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-5 leading-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: '0 2px 18px rgba(13,43,62,0.65)',
          }}
        >
          INNISFREE
        </h1>
        <p
          className="text-lg md:text-xl text-white/85 leading-relaxed"
          style={{ fontFamily: "'Lora', serif", textShadow: '0 1px 8px rgba(13,43,62,0.5)' }}
        >
          Building Up, Together
        </p>
      </div>
    </section>
  )
}

// ─── Story section ────────────────────────────────────────────────────────────

function Story() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <div className="glass-card p-10 md:p-14">
        <span
          className="block text-sm uppercase tracking-[0.3em] mb-4 text-center text-amber"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          Welcome to INNISFREE
        </span>
        <h2
          className="text-3xl md:text-4xl font-bold text-green-deep dark:text-cream mb-8 text-center leading-snug"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Our piece of Louisiana.
        </h2>
        <div
          className="space-y-6 text-text-dark dark:text-cream/80 leading-relaxed text-lg"
          style={{ fontFamily: "'Lora', serif" }}
        >
          <p>
            Innisfree is our piece of Louisiana, named by Big Papa after a poem by W.B. Yeats (
            <a
              href="https://www.poetryfoundation.org/poems/43281/the-lake-isle-of-innisfree"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber underline underline-offset-2 hover:text-gold transition-colors duration-150"
            >
              link
            </a>
            ). The journey is just the beginning. Become a Plank Owner by joining us early as we
            repair existing structures and break ground on our future multifamily campsite. This
            will be the home of Bayou Charity, a hub for fishing, camping, and cultural preservation.
          </p>
          <p>
            It begins with a boat ride and sightseeing trip, but then you stand on the back pier
            whose steps are washed away and look out on the open, free marshland toward the ponds
            beyond — you&apos;ll feel it. Stuck between two worlds on the edge of something special.
          </p>
        </div>
        </div>
      </div>
    </section>
  )
}

// ─── Build phases ─────────────────────────────────────────────────────────────

function BuildPlan() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="glass-card p-10 md:p-14">
        <div className="text-center mb-14">
          <span
            className="block text-sm uppercase tracking-[0.3em] mb-3 text-amber"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            The Plan
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-green-deep dark:text-cream"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Four Phases. One Vision.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PHASES.map((phase, i) => (
            <div
              key={phase.label}
              className="glass-card p-8 transition-shadow duration-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 bg-amber"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {i + 1}
                </span>
                <h3
                  className="font-bold text-green-deep dark:text-cream text-lg"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {phase.label}
                </h3>
              </div>
              <ul className="space-y-2">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-text-mid dark:text-cream/70 text-sm leading-relaxed"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    <span className="text-amber mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/volunteer"
            className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 bg-amber"
            style={{
              fontFamily: "'Lora', serif",
              boxShadow: '0 0 24px rgba(232,146,58,0.38)',
            }}
          >
            Join a Build Day →
          </Link>
        </div>
        </div>
      </div>
    </section>
  )
}

// ─── Map section ──────────────────────────────────────────────────────────────

function MapSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="glass-card p-10">
        <div className="text-center mb-10">
          <span
            className="block text-sm uppercase tracking-[0.3em] mb-3 text-amber"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Find Us
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-green-deep dark:text-cream"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Out in the marshland.
          </h2>
        </div>
        <LeafletMap />
        <p
          className="text-center text-xs text-text-mid dark:text-cream/60 mt-3"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Tiles © Esri
        </p>
        </div>
      </div>
    </section>
  )
}

// ─── Skyline gallery strip ────────────────────────────────────────────────────

function SkylineStrip() {
  const skylines = [
    { src: '/Photos/Skyline golden hue.jpg', alt: 'Louisiana skyline golden hue' },
    { src: '/Photos/Skyline Marsh golden hue.jpg', alt: 'Marsh skyline at golden hour' },
    { src: '/Photos/Skyline golden 2.jpg', alt: 'Bayou skyline golden' },
  ]

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skylines.map((img) => (
              <div key={img.src} className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-md">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function Innisfree() {
  return (
    <>
      <Hero />
      <Story />
      <BuildPlan />
      <SkylineStrip />
      <MapSection />
    </>
  )
}
