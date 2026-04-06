// Volunteer — Server Component
// Phase 1: Full implementation from manifest volunteer.json

import Link from 'next/link';
import { ZeffyEmbed } from '@/components/shared/ZeffyEmbed';

interface OpportunityCard {
  title: string;
  description: string;
  icon: string;
}

const opportunities: OpportunityCard[] = [
  {
    title: 'Maintenance & Construction',
    description: "Something's always broken out here — boats, docks, camp buildings. If you can swing a hammer or turn a wrench, we need you.",
    icon: '🔧',
  },
  {
    title: 'Licensed Captains',
    description: "Licensed captain? We're building a network of guides willing to take our members out on short-notice trips. Good folks, good fishing, fair rates.",
    icon: '⚓',
  },
  {
    title: 'Fishing & Boating Instructors',
    description: 'Teach the basics — casting, knots, catch-and-release — then help us turn BFF into a competitive team on the water.',
    icon: '🎣',
  },
  {
    title: 'Innisfree',
    description: "We're building a camp four miles out in the marsh, starting from nothing. Ask about becoming a Plank Owner.",
    icon: '🏕️',
  },
  {
    title: 'Media & Storytelling',
    description: "Photograph events, shoot video, write up the stories. Somebody's got to tell this right.",
    icon: '📸',
  },
  {
    title: 'Camp Coordination',
    description: 'Help us plan and run Bayou Charity and BFF events — cookouts, rodeos, community days.',
    icon: '📋',
  },
];

export default function Volunteer() {
  return (
    <div id="volunteer">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="glass-card--dark p-10 max-w-3xl mx-auto text-center">
          <p className="font-handwritten text-gold text-lg mb-3 tracking-wide">Lend a Hand</p>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-6">Volunteer with Us</h1>
          <p className="font-serif text-cream/90 text-lg leading-relaxed">
            Whether you can swing a hammer, captain a boat, or just show up with enthusiasm — there&apos;s a place for you at Bayou Family Fishing. Our community is built by the people in it.
          </p>
        </div>
      </section>

      {/* Upcoming events banner */}
      <section className="py-8 px-4">
        <div className="glass-card p-8 max-w-3xl mx-auto text-center">
          <p className="font-handwritten text-amber-700 dark:text-amber text-xl mb-1">Upcoming Events</p>
          <p className="font-display text-2xl text-green-deep dark:text-gold">
            🎣 Fishing Rodeo — April 25th, 2026
          </p>
          <p className="font-serif text-text-dark dark:text-cream/90 mt-2">
            Sign up to participate and volunteer at our featured event — the Bayou Family Fishing Spring Rodeo on April 25, 2026.
          </p>
        </div>
      </section>

      {/* Opportunity cards */}
      <section className="py-16 px-4">
        <div className="glass-card p-10 max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-green-deep dark:text-gold text-center mb-10">
            How You Can Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, idx) => (
              <div
                key={idx}
                className="glass-card p-6 flex flex-col gap-3"
              >
                <span className="text-3xl" role="img" aria-hidden="true">{opp.icon}</span>
                <h3 className="font-display text-lg text-green-deep dark:text-gold">{opp.title}</h3>
                <p className="font-serif text-sm text-text-mid dark:text-cream/80 leading-relaxed flex-1">
                  {opp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="py-4 px-4">
        <div className="bg-green-deep/90 backdrop-blur-md border border-amber/50 rounded-xl px-6 py-5 max-w-3xl mx-auto mb-0">
          <p className="font-accent text-amber text-sm mb-1">🎣 Featured Event</p>
          <h3 className="font-display text-xl text-white mb-1">BFF Spring Fishing Rodeo 2026</h3>
          <p className="font-serif text-cream text-sm mb-3">April 25, 2026 · Plaquemines Parish</p>
          <Link
            href="/events/bff-spring-fishing-rodeo-2026"
            className="text-amber font-semibold text-sm hover:underline"
          >
            Sign Up &amp; Learn More →
          </Link>
        </div>
      </section>

      {/* Zeffy signup embed */}
      <section className="py-16 px-4">
        <div className="glass-card p-10 max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-green-deep dark:text-gold text-center mb-8">
            Sign Up to Volunteer
          </h2>
          <ZeffyEmbed
            src="https://www.zeffy.com/embed/ticketing/bayou-charitys-voulnteers"
            title="Volunteer signup powered by Zeffy"
            height="600px"
            className="rounded-xl overflow-hidden shadow-lg"
          />
        </div>
      </section>

      {/* Direct contact CTA */}
      <section className="py-12 px-4">
        <div className="glass-card--dark p-8 text-center">
          <p className="font-serif text-cream/80 mb-4">
            Have questions or want to talk before signing up?
          </p>
          <a
            href="mailto:info@bayoucharity.org"
            className="inline-block font-serif font-semibold text-amber border border-amber rounded-full px-8 py-3 hover:bg-amber hover:text-green-deep transition-colors"
          >
            Email Us Directly
          </a>
        </div>
      </section>
    </div>
  );
}
