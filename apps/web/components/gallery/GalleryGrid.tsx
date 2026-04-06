// GalleryGrid — Server Component
// Renders all 39 gallery photos via next/image + 3 videos via IntersectionObserver

import Image from 'next/image';

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  index: number;
}

export interface GalleryVideo {
  src: string;
  label: string;
  /** If true, render with browser controls instead of autoPlay/muted/loop */
  controls?: boolean;
}

interface GalleryGridProps {
  onImageClick?: (index: number) => void;
  images: GalleryImage[];
  videos: GalleryVideo[];
}

// All 39 manifest images — src paths relative to apps/web/public/
export const GALLERY_IMAGES: GalleryImage[] = [
  { src: '/Photos/Gallery1.jpg',  alt: 'Club member tending a smoky charcoal grill at a BFF cookout event', width: 1000, height: 667, index: 0 },
  { src: '/Photos/Gallery2.jpg',  alt: 'Close-up of chicken and vegetables being grilled with tongs at a club gathering', width: 1000, height: 667, index: 1 },
  { src: '/Photos/Gallery3.jpg',  alt: 'Kids gathered at a picnic table with snacks at a Bayou Family Fishing club event', width: 1000, height: 667, index: 2 },
  { src: '/Photos/Gallery4.jpg',  alt: 'Club member in BFF shirt standing near stacked crab traps at the bayou dock', width: 750,  height: 1125, index: 3 },
  { src: '/Photos/Gallery5.jpg',  alt: 'Club leader addressing a group of families outdoors near bayou homes', width: 1000, height: 667, index: 4 },
  { src: '/Photos/Gallery6.jpg',  alt: 'Adult crouching down to show a young girl something small at the waterfront', width: 1000, height: 667, index: 5 },
  { src: '/Photos/Gallery7.jpg',  alt: 'Young girl learning to tie a fishing knot with help from an adult volunteer', width: 1000, height: 667, index: 6 },
  { src: '/Photos/Gallery8.jpg',  alt: 'Club leader addressing a large group of families under Spanish moss trees at the bayou', width: 1000, height: 667, index: 7 },
  { src: '/Photos/Gallery9.jpg',  alt: 'Three men posing at the dock, one holding a Humminbird fish finder', width: 1000, height: 667, index: 8 },
  { src: '/Photos/Gallery10.jpg', alt: 'Group of girls and women posing together on a raised porch at the club property', width: 1000, height: 666, index: 9 },
  { src: '/Photos/Gallery11.jpg', alt: 'Three club members reviewing something on a phone together near the water', width: 1000, height: 667, index: 10 },
  { src: '/Photos/Gallery12.jpg', alt: 'Families boarding a white center console boat at the bayou dock', width: 1000, height: 667, index: 11 },
  { src: '/Photos/Gallery13.jpg', alt: 'Young child holding up their first fish catch at a BFF kids fishing day', width: 1000, height: 667, index: 12 },
  { src: '/Photos/Gallery14.jpg', alt: 'Whiteboard reading Basic Training Safety with Fishing Knots at Kids Fishing Club', width: 1000, height: 667, index: 13 },
  { src: '/Photos/Gallery15.jpg', alt: 'Instructor leading a hands-on fishing knots session at the BFF workshop', width: 1000, height: 667, index: 14 },
  { src: '/Photos/Gallery16.jpg', alt: 'Instructor teaching two girls fishing knots at the Kids Fishing Club whiteboard session', width: 1000, height: 667, index: 15 },
  { src: '/Photos/Gallery17.jpg', alt: 'Multiple participants practicing fishing knots with green line at a workbench', width: 1000, height: 667, index: 16 },
  { src: '/Photos/Gallery18.jpg', alt: 'Adults and children working together on fishing knot skills at the club workshop', width: 1000, height: 667, index: 17 },
  { src: '/Photos/Gallery19.jpg', alt: 'Families and volunteers practicing fishing knots together at an outdoor workshop table', width: 1000, height: 667, index: 18 },
  { src: '/Photos/Gallery20.jpg', alt: 'Child in HUK Performance Fishing shirt learning to tie a knot with a crimping tool', width: 1000, height: 667, index: 19 },
  { src: '/Photos/Gallery21.jpg', alt: 'Teen practicing a fishing knot with green line and guidance from an adult volunteer', width: 1000, height: 667, index: 20 },
  { src: '/Photos/Gallery22.jpg', alt: 'Two young BFF members proudly holding up a fish they caught together, landing net in hand', width: 1920, height: 1920, index: 21 },
  { src: '/Photos/Gallery23.jpg', alt: 'Young BFF member in life jacket reacting with excitement after a surprise catch on the bayou', width: 739,  height: 1600, index: 22 },
  { src: '/Photos/Gallery24.jpg', alt: 'Two BFF members showing off their large redfish catches out on the water', width: 1920, height: 1440, index: 23 },
  { src: '/Photos/Gallery25.jpg', alt: 'Kids and a BFF volunteer posing on the dock after a successful fishing outing', width: 1200, height: 1600, index: 24 },
  { src: '/Photos/Gallery26.jpg', alt: 'BFF member crouching on the shoreline, proudly showing off a large drum fish', width: 1200, height: 1600, index: 25 },
  { src: '/Photos/Gallery27.jpg', alt: 'Three young BFF members grinning together out on the water for a club fishing day', width: 481,  height: 640,  index: 26 },
  { src: '/Photos/Gallery28.jpg', alt: 'BFF member bundled up on the boat during a cool-weather day out on the bayou', width: 887,  height: 1920, index: 27 },
  { src: '/Photos/Gallery29.jpg', alt: 'Two BFF members on the boat holding up a trophy-sized redfish catch', width: 1920, height: 887,  index: 28 },
  { src: '/Photos/Gallery30.jpg', alt: 'BFF member at the dock crouching next to a large black drum fish after a successful trip', width: 887,  height: 1920, index: 29 },
  { src: '/Photos/Gallery31.jpg', alt: 'A heaping tray of fresh Louisiana crawfish laid out for a BFF cookout gathering', width: 1920, height: 887,  index: 30 },
  { src: '/Photos/Gallery32.jpg', alt: 'BFF member hauling a crab trap from the boat during a crabbing trip on the bayou', width: 1920, height: 887,  index: 31 },
  { src: '/Photos/Gallery33.jpg', alt: 'Two young BFF members proudly showing off a trophy redfish they caught together', width: 1920, height: 887,  index: 32 },
  { src: '/Photos/Gallery34.jpg', alt: 'BFF members out on the bayou together, lines in the water on a clear day', width: 1920, height: 887,  index: 33 },
  { src: '/Photos/Gallery35.jpg', alt: 'The whole crew together after a memorable day out on the Louisiana bayou', width: 1920, height: 887,  index: 34 },
  { src: '/Photos/Gallery36.jpg', alt: 'Two BFF members catching up at the marina after a day out on the water', width: 1920, height: 1440, index: 35 },
  { src: '/Photos/Gallery37.jpg', alt: 'Young BFF member holding up a beautiful speckled trout caught on the Louisiana bayou', width: 1280, height: 720,  index: 36 },
  { src: '/Photos/Skyline golden 2.jpg', alt: 'Golden hour over the Louisiana bayou skyline', width: 1920, height: 887,  index: 37 },
  { src: '/Photos/Skyline golden hue.jpg', alt: 'Warm golden hue over the Louisiana marsh at dusk', width: 1920, height: 887,  index: 38 },
];

export const GALLERY_VIDEOS: GalleryVideo[] = [
  { src: '/Photos/club member casting video (gallery).mp4', label: 'Club member casting on the bayou' },
  { src: '/Photos/fishing knots class video (gallery).mp4', label: 'Fishing knots class' },
  { src: '/Photos/BFF club page header video.mp4',          label: 'BFF club overview' },
  { src: '/Photos/check-twice-video-boat.mp4',              label: 'The Check Twice on the Bayou' },
];

interface StaticGalleryGridProps {
  onImageClick: (index: number) => void;
}

// This component is rendered as a Server Component shell — the click handler is
// threaded in via the GalleryGridWrapper Client Component in index.tsx.
export default function GalleryGrid({ onImageClick }: StaticGalleryGridProps) {
  return (
    <div className="columns-1 gap-3 sm:columns-2 md:columns-3 lg:columns-4 space-y-3">
      {GALLERY_IMAGES.map((img) => (
        <button
          key={img.src}
          onClick={() => onImageClick(img.index)}
          className="block w-full break-inside-avoid overflow-hidden rounded-lg
                     ring-0 hover:ring-2 hover:ring-amber focus-visible:ring-2
                     focus-visible:ring-amber transition-all duration-200
                     focus:outline-none group"
          aria-label={`View full size: ${img.alt}`}
        >
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              className="w-full h-auto object-cover transition-transform duration-300
                         group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
