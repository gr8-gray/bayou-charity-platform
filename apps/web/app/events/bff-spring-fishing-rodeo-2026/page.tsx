import type { Metadata } from 'next';
import Link from 'next/link';
import { ZeffyEmbed } from '@/components/shared/ZeffyEmbed';
import { CountdownTimer } from './CountdownTimer';
import { TackleChecklist } from './TackleChecklist';

export const metadata: Metadata = {
  title: 'BFF Spring Fishing Rodeo — April 25, 2026',
  description:
    'Join us April 25, 2026 for the BFF Spring Rodeo. Families, fun, food, and fishing — rain or shine.',
  openGraph: {
    title: 'BFF Spring Fishing Rodeo — April 25, 2026',
    description: 'Guides at sunrise, grills going all day, and the whole bayou family on the water. Free to attend — RSVP now.',
    url: 'https://bayoucharity.org/events/bff-spring-fishing-rodeo-2026',
    images: [
      {
        url: 'https://bayoucharity.org/Photos/Gallery1.jpg',
        width: 1200,
        height: 630,
        alt: 'Bayou Family Fishing trip — members on the water in Plaquemines Parish',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BFF Spring Fishing Rodeo — April 25, 2026',
    description: 'Guides at sunrise, grills going all day, and the whole bayou family on the water.',
    images: ['https://bayoucharity.org/Photos/Gallery1.jpg'],
  },
};

export default function BFFSpringRodeoPage() {
  return (
    <main className="relative z-10 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">

        {/* Countdown — above the hero card */}
        <CountdownTimer />

        {/* Hero / Spotlight */}
        <div className="glass-card--dark rounded-2xl p-8 md:p-12 mb-10 relative overflow-hidden">
          {/* Amber badge */}
          <span className="inline-flex items-center gap-2 bg-amber text-white text-[0.7rem] font-bold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-full mb-5">
            ⭐ Fishing Rodeo
          </span>

          {/* Headline */}
          <h1 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-black text-cream leading-tight mb-2" style={{ textShadow: '0 2px 12px rgba(13,43,62,0.7)' }}>
            Bayou Family Fishing<br />Spring Rodeo
          </h1>

          {/* Subline */}
          <p className="font-handwritten text-gold text-[1.3rem] mb-6">
            &ldquo;Let&rsquo;s get as many families on the water as we can&rdquo;
          </p>

          {/* Meta strip */}
          <div className="flex flex-wrap items-center gap-6 border-t border-b border-cream/15 py-4 mb-8">
            <span className="flex items-center gap-2 text-[0.9rem] text-cream">
              📅 <strong className="text-gold">April 25, 2026</strong>&nbsp;·&nbsp;Begins at Sunrise
            </span>
            <span className="flex items-center gap-2 text-[0.9rem] text-cream">
              📍 <strong className="text-gold">Meet at Home Base</strong>&nbsp;·&nbsp;
              <a
                href="https://maps.google.com/?q=Plaquemines+Parish+Louisiana"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                View on Map ↗
              </a>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber/20 border border-amber text-amber text-[0.75rem] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-full">
              ☀️🌧️ Rain or Shine
            </span>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">

            {/* Left — Synopsis */}
            <div>
              <p className="text-[0.97rem] leading-[1.9] text-cream/95 mb-4">
                Join us for our first rodeo and help us make Bayou Charity and Bayou Family Fishing a success. For our first rodeo, we are making this a team event with one prize. Let&rsquo;s prove to ourselves and to our future members that we are here to stay. Next time we&rsquo;ll get competitive and name individual winners, but on April 25th 2026, we all win.
              </p>
              <p className="text-[0.97rem] leading-[1.9] text-cream/95 mb-4">
                We&rsquo;ll have guides waiting at sunrise, so come earlier and get a pro captain. BFF members with boats will be on standby to take participants out on the water. Trips will last about three hours, so we can rotate back and pick up more participants. Dock fishing and shore-side entertainment will take place all day. Join in at the BFF beginners table for fishing basics, or help train our new members by leading small groups from tying their first rig to casting lines in Deer Range Canal.
              </p>

              {/* Features */}
              <div className="flex flex-col gap-3 mt-5">
                <div className="flex items-start gap-3 text-[0.9rem] text-cream/95 leading-relaxed">
                  🔥
                  <div>
                    <strong className="text-gold">The Feast:</strong> This is a grill event! We provide the grills and space — you bring your favorite grillables. We love food, bring all your favorite prepared dishes and desserts.
                  </div>
                </div>
                <div className="flex items-start gap-3 text-[0.9rem] text-cream/95 leading-relaxed">
                  💸
                  <div>
                    <strong className="text-gold">The Cost:</strong> Donation-only. All contributions go directly toward boat fuel, provide tackle and rods. Bring cash for live shrimp and tips for fishing guides.
                  </div>
                </div>
              </div>
            </div>

            {/* Right — RSVP Panel */}
            <div className="glass-card--dark rounded-xl p-6">
              <h4 className="font-display text-[1.2rem] text-cream mb-1">Family RSVP</h4>
              <p className="text-[0.8rem] text-cream/95 mb-4">Reserve your family&rsquo;s spot — free to attend.</p>

              {/* Fishing license notice */}
              <div className="border-l-4 border-amber bg-amber/10 rounded-lg px-4 py-3 mb-5 text-[0.82rem] text-cream/95 leading-snug">
                🎣 <strong className="text-gold">Fishing License Required</strong> — All attendees are responsible for purchasing their own valid Louisiana fishing license before the event.{' '}
                <a
                  href="https://www.wlf.louisiana.gov/licenses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline block mt-1"
                >
                  Buy your license here →
                </a>
              </div>

              {/* Liability consent block */}
              <div className="bg-cream/5 border border-cream/15 rounded-lg px-4 py-4 mb-5">
                <h6 className="font-display text-[0.85rem] font-bold text-gold uppercase tracking-[0.04em] mb-2">
                  Before You Register
                </h6>
                <p className="text-[0.8rem] text-cream/95 leading-snug mb-2">
                  By completing your RSVP you agree to the following:
                </p>
                <p className="text-[0.8rem] text-cream/95 leading-snug mb-2">
                  <strong className="text-gold">Liability Release —</strong> Bayou Family Fishing / Bayou Charity and its volunteers are not liable for personal injury, loss, or damage arising from participation in this event. Participation is at your own risk.
                </p>
                <p className="text-[0.8rem] text-cream/95 leading-snug mb-2">
                  <strong className="text-gold">Photo &amp; Video Release —</strong> BFF may photograph or record the event. By attending you grant permission for your likeness to be used in promotional materials.
                </p>
                <p className="text-[0.8rem] text-cream/95 leading-snug">
                  <strong className="text-gold">Age Requirement —</strong> Attendees under 18 must be accompanied by a parent or legal guardian at all times.
                </p>
              </div>

              {/* Zeffy RSVP embed */}
              <ZeffyEmbed
                src="https://www.zeffy.com/embed/ticketing/bayou-family-fishing-spring-rodeo"
                title="BFF Spring Rodeo — Family RSVP"
                height="450px"
                className="rounded-[10px] overflow-hidden"
              />
            </div>
          </div>

          {/* Tackle Checklist */}
          <TackleChecklist />

          {/* Captains Fuel Fund */}
          <div className="mt-8 pt-6 border-t border-cream/10">
            <h5 className="text-[0.72rem] font-bold tracking-[0.1em] uppercase text-gold mb-4 text-center">
              💛 Support the Captains — Fuel Fund
            </h5>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {[
                { icon: '💚', label: 'CashApp', handle: '$bayoucharity' },
                { icon: '💜', label: 'Venmo', handle: '@bayoucharity' },
                { icon: '🔵', label: 'PayPal', handle: '@bayoucharity' },
                { icon: '💵', label: 'Cash', handle: 'Day-of' },
                { icon: '🍎', label: 'Apple Cash', handle: 'kyle.rockefeller@icloud.com' },
              ].map(({ icon, label, handle }) => (
                <span
                  key={`${label}-${handle}`}
                  className="inline-flex items-center gap-1.5 bg-cream/5 border border-cream/15 rounded-full px-3.5 py-1.5 text-[0.78rem] text-cream/95"
                >
                  {icon} {label}{' '}
                  <span className="text-gold font-semibold">{handle}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/volunteer"
            className="font-serif text-[0.9rem] text-cream/90 hover:text-gold transition-colors"
          >
            ← Back to Volunteer
          </Link>
        </div>

      </div>
    </main>
  );
}
