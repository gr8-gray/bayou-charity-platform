// GalleryGrid — renders a masonry photo grid
// Images are passed dynamically from GalleryClient (DB-sourced after migration)

import Image from 'next/image';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  index: number;
}

export interface GalleryVideo {
  src: string;
  label: string;
  controls?: boolean;
}

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

export default function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  if (images.length === 0) return null;

  return (
    <div className="columns-1 gap-3 sm:columns-2 md:columns-3 lg:columns-4 space-y-3">
      {images.map((img, i) => (
        <button
          key={img.src + i}
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
              priority={i < 4}
              loading={i < 4 ? undefined : 'lazy'}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
