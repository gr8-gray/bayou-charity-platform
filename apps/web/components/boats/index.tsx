// Boats — Server Component
// Phase 1: Full implementation from manifest boats.json

import Image from 'next/image';

interface BoatCard {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  additionalImageSrc?: string;
  additionalImageAlt?: string;
  additionalImageWidth?: number;
  additionalImageHeight?: number;
  story: string[];
}

const boats: BoatCard[] = [
  {
    title: "Uncle John's Campagna Skiff",
    description: "Classic Fiberglass Skiff · Shallow-Draft · Family Vessel",
    imageSrc: "/Photos/Uncle%20Johns%20Campagna%20Skiff%20(boat).jpg",
    imageAlt: "Uncle John's Campagna Skiff — a classic shallow-draft fiberglass bayou skiff",
    imageWidth: 2500,
    imageHeight: 1155,
    additionalImageSrc: "/Photos/Uncle%20Johns%20Campagna%20Skiff%20First%20Crabbing%20Trip%20(boat).jpg",
    additionalImageAlt: "Uncle John's Campagna Skiff on the first crabbing trip",
    additionalImageWidth: 1046,
    additionalImageHeight: 333,
    story: [
      "A true bayou classic. Uncle John's Campagna Skiff is a shallow-draft family vessel built for the tight canals and open marsh alike. She's perfect for beginner fishing days and youth outings — the kind of boat that builds memories and first catches.",
      "The Campagna Skiff is a classic example of the enduring Lafitte skiff design, a staple of Louisiana's maritime heritage. Emerging in the 1930s in the town of Lafitte, Louisiana, thanks to pioneering builders like Emile Dufrene, the Lafitte skiff was engineered for the demanding shallow waters of the Gulf Coast's bays, marshes, and bayous. With its semi-V hull transitioning to a flat stern, it offers unmatched stability and agility — perfect for commercial fishing like shrimping and crabbing, or simply navigating tricky coastal terrain.",
      "Crafted in Meraux, Louisiana (just outside New Orleans), by the respected Campagna boat builders, these skiffs evolved from wooden cypress constructions to more modern fiberglass models while retaining their rugged reliability. Our featured 16-footer, equipped with a trusty 25 HP Yamaha outboard, exemplifies this blend of tradition and functionality.",
      "In our first year down here the bay boat was having problems and this skiff did it all. We made our first crabbing trip, and had some great days fishing in nearby waters. On calm days this boat would take us out as far as we wanted to go. Thank you Uncle John for letting us use your boat! I hope we see you and your boat here again soon!",
    ],
  },
  {
    title: "The Miss Carol",
    description: "Louisiana Shrimp Trawler · Working Heritage Vessel",
    imageSrc: "/Photos/The%20Ms%20Carrol%20(boat).jpg",
    imageAlt: "The Ms. Carol — a traditional Louisiana shrimp trawler",
    imageWidth: 2500,
    imageHeight: 1155,
    additionalImageSrc: "/Photos/Ms%20Carol%20pic%202%20(boat).jpg",
    additionalImageAlt: "The Miss Carol — a second view of this traditional Louisiana shrimp trawler",
    additionalImageWidth: 1920,
    additionalImageHeight: 1440,
    story: [
      "The Miss Carol is a traditional Louisiana shrimp trawler and one of our most storied boats. She's a living connection to the commercial fishing heritage that defines this coast. We use her for special cultural outings and to remind members where bayou tradition comes from.",
      "Out near Port Sulphur, the Miss Carol keeps on — 40-plus feet of fiberglass, diesel growl, and Gaudet family grit. Named for Jason's mom, he and his dad, Mr. Grant, have been working this boat for years, skimming for shrimp, fixing what breaks, making it work. The money's tight — fuel eats half, repairs the rest, dock prices barely cover the gas. Middlemen take the cut, big boats crowd the water, but the Gaudets don't quit. It's not romance; it's routine.",
      "I rode with them once and have been wanting to try again. It was no big haul, but watching them work — quiet, steady, no complaints — stuck with me. That kind of stubborn pride? That's Louisiana.",
      "That's why Bayou Charity wants in. Not to save them — hell, they don't need saving. But to give them a hand: cover fuel, sort the haul, or whatever keeps the engine turning. And maybe open a door, let folks ride along. Climb off The Check Twice, step onto the Miss Carol, help pull a net, buy shrimp straight off the deck, and hear Jason or Mr. Grant talk shop. It's not a show. It's real: salt, sweat, stories.",
    ],
  },
  {
    title: "The Last Chance",
    description: "Homemade Aluminum Skiff — work boat",
    imageSrc: "/Photos/Last%20Chance%20(boat).jpg",
    imageAlt: "The Last Chance — a homemade aluminum crawfish skiff",
    imageWidth: 2500,
    imageHeight: 1677,
    story: [
      "We've been wanting a boat like this for a long time, and now there will be no more crab traps in the Check Twice. She's a head turner — plenty of these boats in Acadiana, but mine is unique and special in Plaquemines.",
      "Morgan City has long been a hub for boatbuilding — right where the Atchafalaya meets the Gulf, folks turned to self-reliance early. From pirogues carved by hand to welded aluminum workhorses, locals built what they needed: tough, cheap, no-frills vessels for shrimping, fishing, crawfishing. WWII welding skills spilled over, aluminum came cheap post-war — small yards and plenty of backyard builders who just grabbed sheet metal, a torch, and know-how. No plans, no perfection — just boats that float, haul traps, and last. Cajun grit: make it yourself, make it work.",
      "This one's straight from that line — an aluminum crawfish boat Leland welded up himself in Morgan City. A self-made boat by a self-made man. Solid plates, clean enough lines, built to handle the tough workload we are giving them. Turned-up bow slices through chop, front console shifts weight forward, and traps stack aft without blocking the view.",
      "Powered by a 1997 90hp Mercury two-stroke: old, smoky, but when tuned, it pushes hard. We're giving it a refresh, Dad and I wrenching together and making up for lost time. Come learn with us, or please teach us how to do it right!",
    ],
  },
  {
    title: "The Check Twice",
    description: "VIP Baystealth · Suzuki · Minn Kota",
    imageSrc: "/Photos/The%20Check%20Twice%20(boat).jpg",
    imageAlt: "The Check Twice — a 2004 VIP Baystealth center console",
    imageWidth: 2500,
    imageHeight: 1155,
    additionalImageSrc: "/Photos/Check%20twice%20Kyle%20(president%20Posing)%20(boat).jpg",
    additionalImageAlt: "Kyle Rockefeller, President of Bayou Family Fishing, posing aboard The Check Twice",
    additionalImageWidth: 1920,
    additionalImageHeight: 2560,
    story: [
      "I'm not sure what's easier on the eyes, this boat or my 2001 Jeep Wrangler. When having a fishing camp was still just a dream, the second dream was picturing this boat sitting in its slip, ready to go.",
      "VIP Boats — short for Vivian Industrial Plastics — started back in nineteen sixty-eight when Bill Parker, a local marine dealer, turned his shop into a full-on boat factory in the small town of Vivian, Louisiana. Up northwest near Caddo Lake, they kicked off with fiberglass hulls: first bass boats in the seventies and eighties. By the nineties, they branched into saltwater, rolling out the Bay Stealth line — those sleek, no-nonsense bay boats that became Louisiana legends. VIP peaked as a hometown hero, employing hundreds at one point. But by two thousand eight, they filed bankruptcy. Today, those old Bay Stealths? Rare survivors — tough, undervalued, still running strong if you treat 'em right.",
      "Mine's one of 'em: The Check Twice, a 2004 twenty-foot center console on that classic VIP Bay Stealth hull. Repowered with a brand-new 200 hp Suzuki outboard, barely fifty hours on it. Up front, Minn Kota Terrova with i-Pilot Link — GPS spot-lock, auto-pilot, all synced to my Humminbird navigation and fish finder so I can steer from the console without touching a thing. And aft? Dual Minn Kota Talons — ten-foot shallow water anchors that drop straight into mud, lock us dead-still in current or wind.",
      "This boat's no toy. It's the backbone of our future — the ride that'll haul us to hidden ponds for reds, or blast out on trout runs and waters unknown still chasing those Louisiana dreams.",
    ],
  },
  {
    title: "Bait By You — Hook it or Cook it",
    description: "Louisiana Trawler · Deep Bayou Roots",
    imageSrc: "/Photos/Bait%20By%20You%20Hook%20it%20or%20Cook%20it%20(boat).jpg",
    imageAlt: "Bait By You Hook it or Cook it — a working Louisiana inshore trawler",
    imageWidth: 2500,
    imageHeight: 1677,
    story: [
      "The name says everything about who we are. \"Bait By You — Hook it or Cook it\" is a working Louisiana trawler with deep bayou character and community roots. She represents the spirit of self-reliance and celebration that makes fishing culture here unlike anywhere else in the world. Capt. Sam Ronquille invites you to the tackle box where you can get live shrimp and visit him and his dog Bayou.",
      "Picture this: dawn on Wilkinson Bayou, mist rising off the marsh, and Bait-By-You — a no-nonsense 35-foot fiberglass trawler — idles at the dock. Teal hull, white trim, outriggers folded like wings, nets draped heavy with dew. She's built for the shallow stuff: low draft, wide beam, deck cleared for sorting buckets and quick hauls.",
      "This type is straight Louisiana inshore — fiberglass evolution from the old wooden luggers and Lafitte skiffs of the 1930s. Built by local yards or backyard pros, these boats kept families fed when the Gulf was too rough.",
      "Sam Ronquille runs her Thursday through Sunday — out at first light, back loaded with live shrimp. Biggest around, best prices, right off the deck. \"Hook it or cook it,\" he says. No middlemen — just one man, one boat, keeping the tradition alive. Swing by the Tackle Box, say hi to him (and his dog Bayou — just don't let Bayou on your boat, you'll see).",
    ],
  },
];

export default function Boats() {
  return (
    <div id="boats">
      {/* TODO: Phase 3 — ambient autoplay video: bff video 2.mp4 + check twice video (boat).mp4 */}
      {/* Hero / manifesto */}
      <section className="py-20 px-4">
        <div className="glass-card--dark p-10 max-w-3xl mx-auto text-center">
          <p className="font-handwritten text-gold text-lg mb-3 tracking-wide">Come Aboard</p>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-6">The Boats</h1>
          <p className="font-serif text-cream/90 text-lg leading-relaxed mb-4">
            Boats are magic — but they don&apos;t mean much if they&apos;re sitting dry. We&apos;re not building a collection — we&apos;re building a crew.
          </p>
          <p className="font-serif text-cream/80 leading-relaxed mb-4">
            If you&apos;ve got one, bring it. If you&apos;re saving for one, start here. If you&apos;re already out there, come share.
          </p>
          <p className="font-serif text-cream/80 leading-relaxed mb-4">
            Log in, drop your plan: &ldquo;I&apos;m heading to the cut at eight, back by two.&rdquo; Someone sees it, says &ldquo;I&apos;m free — want company?&rdquo; We share fuel, gear, know-how — everything — so nobody&apos;s alone.
          </p>
          <p className="font-serif text-cream/80 leading-relaxed">
            New folks learn the basics: throttle, tides, radio. Then we climb — safety first, drills, charts — until you&apos;re running trips like you&apos;ve done it forever. Join other BFF members who are pursuing their 6-pack license and become a Captain.
          </p>
        </div>
      </section>

      {/* Boat cards */}
      <section className="py-16 px-4">
        <div className="glass-card p-8 max-w-5xl mx-auto space-y-8">
          {boats.map((boat, idx) => (
            <details
              key={idx}
              className="group glass-card overflow-hidden"
            >
              <summary className="flex items-center gap-6 p-6 cursor-pointer list-none select-none hover:bg-cream/60 dark:hover:bg-green-water/10 transition-colors">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-24 h-16 md:w-36 md:h-24 rounded-lg overflow-hidden">
                  <Image
                    src={boat.imageSrc}
                    alt={boat.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 96px, 144px"
                    priority={idx === 0}
                  />
                </div>
                {/* Title + description */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-xl md:text-2xl text-green-deep dark:text-gold mb-1">{boat.title}</h2>
                  <p className="font-serif text-sm text-text-mid dark:text-cream/70 italic">{boat.description}</p>
                </div>
                {/* Chevron */}
                <svg
                  className="flex-shrink-0 w-6 h-6 text-amber transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              {/* Expanded content */}
              <div className="px-6 pb-8">
                {/* Hero image */}
                <div className="relative w-full rounded-xl overflow-hidden mb-6" style={{ aspectRatio: `${boat.imageWidth}/${boat.imageHeight}` }}>
                  <Image
                    src={boat.imageSrc}
                    alt={boat.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 900px"
                    priority={idx === 0}
                  />
                </div>

                {/* Story paragraphs */}
                <div className="space-y-4 mb-6">
                  {boat.story.map((para, pIdx) => (
                    <p key={pIdx} className="font-serif text-text-dark dark:text-cream/90 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Additional image if present */}
                {boat.additionalImageSrc && (
                  <div className="relative w-full rounded-xl overflow-hidden mt-4" style={{ aspectRatio: `${boat.additionalImageWidth}/${boat.additionalImageHeight}` }}>
                    <Image
                      src={boat.additionalImageSrc}
                      alt={boat.additionalImageAlt ?? ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 900px"
                    />
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Boater education notice */}
      <section className="py-12 px-4">
        <div className="glass-card p-8 max-w-3xl mx-auto text-center">
          <p className="font-serif text-text-dark dark:text-cream/80 leading-relaxed mb-4">
            In Louisiana, boat operators born after January 1, 1984 are required to complete an LDWF-approved boater education course to operate a motorboat over 10 HP or any personal watercraft.
            Free online courses are available at{' '}
            <a
              href="https://www.boatus.org/free-boater-education-course/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 dark:text-amber hover:underline"
            >
              BoatUS.org
            </a>{' '}
            and{' '}
            <a
              href="https://www.boat-ed.com/louisiana/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 dark:text-amber hover:underline"
            >
              Boat-ED.com
            </a>
            . See the{' '}
            <a
              href="https://www.wlf.louisiana.gov/page/boater-education"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 dark:text-amber hover:underline"
            >
              LDWF boater education page
            </a>{' '}
            for full details. If you are new to boating, we provide hands-on training to members who complete certification.
          </p>
        </div>
      </section>
    </div>
  );
}
