'use client'

/**
 * Home — Bayou Family Fishing
 * Phase 1 build. Client component for Framer Motion animations.
 * Hero video + "Why We Exist" vision band + services grid + INNISFREE teaser.
 */

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

// ─── Fade-in section wrapper ─────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      id="home-hero"
      className="relative h-screen min-h-[600px] flex items-center justify-center"
    >
      {/* TODO Phase 3: hero ambient video overlay */}

      {/* Hero content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          animate={{ opacity: 1, letterSpacing: '0.4em' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="block text-xs uppercase tracking-[0.4em] mb-4 text-gold"
          style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem' }}
        >
          Bayou Charity
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 16px rgba(13,43,62,0.7)' }}
        >
          Bayou Family Fishing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto"
          style={{ fontFamily: "'Lora', serif", textShadow: '0 1px 8px rgba(13,43,62,0.6)' }}
        >
          Coastal living is hard work, but the rewards are plenty. Our mission is to share
          our way of life with those who serve our nation and our communities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/members"
            className="inline-block px-8 py-3 rounded-full font-semibold text-green-deep transition-all duration-200 hover:scale-105 hover:shadow-lg bg-amber"
            style={{
              fontFamily: "'Lora', serif",
              boxShadow: '0 0 24px rgba(232,146,58,0.4)',
            }}
          >
            Become a Member →
          </Link>
          <Link
            href="/about"
            className="inline-block px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 text-cream"
            style={{
              border: '2px solid rgba(238,246,251,0.6)',
              fontFamily: "'Lora', serif",
              backdropFilter: 'blur(8px)',
            }}
          >
            Our Story
          </Link>
        </motion.div>

        {/* Featured Event banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.9 }}
          className="mt-8 max-w-sm mx-auto"
        >
          <div className="glass-card border border-amber/50 px-6 py-4 text-center">
            <p
              className="text-amber text-sm font-semibold mb-1"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              🎣 Featured Event
            </p>
            <p
              className="font-display text-white text-lg font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              BFF Spring Fishing Rodeo
            </p>
            <p className="font-serif text-white dark:text-cream/90 text-sm mb-3"
               style={{ textShadow: '0 1px 4px rgba(13,43,62,0.5)' }}>
              April 25, 2026 · Plaquemines Parish
            </p>
            <Link
              href="/events/bff-spring-fishing-rodeo-2026"
              className="text-white dark:text-amber font-semibold text-sm hover:underline"
              style={{ textShadow: '0 1px 4px rgba(13,43,62,0.5)', fontFamily: "'Lora', serif" }}
            >
              Sign Up &amp; Learn More →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── Why We Exist vision band ─────────────────────────────────────────────────

function WhyWeExist() {
  return (
    <section
      id="why-we-exist"
      className="py-20 md:py-28"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="glass-card p-10 md:p-16 text-center">
        <FadeIn>
          <span
            className="block text-sm uppercase tracking-[0.3em] mb-4 text-gold"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Why We Exist
          </span>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2
            className="text-3xl md:text-5xl font-bold text-green-deep dark:text-cream mb-8 leading-snug"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Preserving Louisiana&apos;s Coastal Culture
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p
            className="text-lg text-text-dark dark:text-cream/80 leading-relaxed mb-6"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Bayou Charity is here to preserve our coastal culture and share it with families who need it most.
            From fishing and crabbing to hunting and camping, our community runs on the water, the land, and each
            other. We organize trips, maintain a shared fleet, and build Innisfree — our future campsite in the
            heart of Plaquemines Parish.
          </p>
          <p
            className="text-lg text-text-mid dark:text-cream/80 leading-relaxed mb-6"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Every dollar donated goes directly to programs, gear, fuel, and camp infrastructure — Zeffy charges
            us zero platform fees. Members get access to trip planning tools, fishing reports, and our growing
            network of licensed guides and local partners.
          </p>
          <p
            className="text-lg text-text-mid dark:text-cream/65 leading-relaxed mb-6"
            style={{ fontFamily: "'Lora', serif" }}
          >
            We&apos;re not a corporation. We&apos;re a Louisiana nonprofit built by the people who use it. Veterans,
            first responders, families, and anyone who wants to get out on the water — you&apos;re welcome here.
          </p>
          <p
            className="text-lg text-text-mid dark:text-cream/65 leading-relaxed"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Come fish with us. Come build with us. Come home to the bayou.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-10">
            <Link
              href="/about"
              className="inline-block px-7 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 bg-amber"
              style={{ fontFamily: "'Lora', serif" }}
            >
              See the Community →
            </Link>
          </div>
        </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ─── Services grid ────────────────────────────────────────────────────────────

const SERVICES = [
  {
    title: 'Members',
    icon: '🤝',
    description:
      'BFF members can access boats, attend events, get discounts on charters, and support our community.',
    href: '/members',
    cta: 'Join the Club',
  },
  {
    title: 'Volunteer',
    icon: '🎣',
    description:
      'Help us host events, teach a boating or fishing lesson, or join an offshore construction project.',
    href: '/volunteer',
    cta: 'Get Involved',
  },
  {
    title: 'Boating Experiences',
    icon: '⛵',
    description:
      'Love boats? Learn what it takes to keep our fleet running and help us grow the BFF family.',
    href: '/boats',
    cta: 'See the Fleet',
  },
  {
    title: 'INNISFREE',
    icon: '🌿',
    description:
      'Our piece of Louisiana marshland. Help us build it — become a Plank Owner and earn lifetime access.',
    href: '/innisfree',
    cta: 'See INNISFREE →',
  },
  {
    title: 'Donate',
    icon: '❤️',
    description:
      'Support Bayou Family Fishing or one of our partner local businesses with a direct contribution.',
    href: '/donate',
    cta: 'Support Us',
  },
]

function ServicesGrid() {
  return (
    <section
      id="services"
      className="py-20 md:py-28"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="glass-card p-10 md:p-14">
        <FadeIn className="text-center mb-14">
          <span
            className="block text-sm uppercase tracking-[0.3em] mb-3 text-gold"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Everything We Offer
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-green-deep dark:text-cream"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ways to Get Involved
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((svc, i) => (
            <FadeIn key={svc.title} delay={i * 0.1}>
              <Link
                href={svc.href}
                className="glass-card group block p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-amber"
              >
                <div className="text-3xl mb-4">{svc.icon}</div>
                <h3
                  className="text-xl font-bold text-green-deep dark:text-cream mb-3 group-hover:text-amber transition-colors duration-200"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {svc.title}
                </h3>
                <p
                  className="text-text-mid dark:text-cream/70 leading-relaxed mb-4"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {svc.description}
                </p>
                <span
                  className="text-amber font-semibold text-sm"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {svc.cta} →
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}

// ─── INNISFREE teaser band ─────────────────────────────────────────────────

function InnisfreTeaser() {
  return (
    <section
      id="innisfree-teaser"
      className="relative overflow-hidden py-24 md:py-32"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/Photos/header image for INNISFREE tab.jpg"
          alt="INNISFREE marshland"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(13,43,62,0.62) 0%, rgba(26,74,107,0.55) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <span
            className="block text-sm uppercase tracking-[0.35em] mb-4 text-gold"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            New Chapter
          </span>
        </FadeIn>
        <FadeIn delay={0.15}>
          <h2
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 16px rgba(13,43,62,0.6)' }}
          >
            We just bought land.
          </h2>
        </FadeIn>
        <FadeIn delay={0.25}>
          <p
            className="text-lg text-white/85 leading-relaxed mb-10"
            style={{ fontFamily: "'Lora', serif" }}
          >
            INNISFREE is our newly acquired piece of Louisiana marshland — and we need your
            hands to help build it into a community hub for fishing, camping, and cultural preservation.
          </p>
        </FadeIn>
        <FadeIn delay={0.35}>
          <Link
            href="/innisfree"
            className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 bg-amber"
            style={{
              fontFamily: "'Lora', serif",
              boxShadow: '0 0 28px rgba(232,146,58,0.45)',
            }}
          >
            See INNISFREE →
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Who we are photo band ────────────────────────────────────────────────────

function WhoWeAre() {
  return (
    <section
      id="who-we-are"
      className="py-20 md:py-28"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="glass-card p-10 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <FadeIn>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/Photos/who we are.jpg"
              alt="Bayou Family Fishing members on the water"
              fill
              className="object-cover"
            />
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <span
            className="block text-sm uppercase tracking-[0.3em] mb-4 text-gold"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Who We Are
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-green-deep dark:text-cream mb-6 leading-snug"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Keeping the bayou alive — one family, one boat, one cast at a time.
          </h2>
          <blockquote
            className="text-text-mid dark:text-cream/70 leading-relaxed mb-2 italic border-l-4 border-amber/50 pl-4"
            style={{ fontFamily: "'Lora', serif" }}
          >
            &ldquo;Coastal living is hard work, but the rewards are plenty. Our mission is to share
            our way of life with those who serve our nation and our communities. We&apos;re military
            families—we&apos;ve been there, stretched thin, missing birthdays, missing dinner; and
            we see you. We are here for our military heroes, our cops and fire fighters, our first
            responders, educators, and caregivers. You&apos;re the ones who show up because others
            can&apos;t. We are all in this together—now let&apos;s get out on the water!&rdquo;
          </blockquote>
          <p
            className="text-text-mid dark:text-cream/60 text-sm mb-6"
            style={{ fontFamily: "'Lora', serif" }}
          >
            — Kyle Rockefeller, Founder
          </p>
          <Link
            href="/members"
            className="inline-block px-7 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Become a Member →
          </Link>
        </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Hero />
      <WhyWeExist />
      <ServicesGrid />
      <InnisfreTeaser />
      <WhoWeAre />
    </>
  )
}
