'use client';

import { useState, useRef, useEffect } from 'react';

interface ZeffyEmbedProps {
  src: string;
  title: string;
  height?: string;
  className?: string;
}

export function ZeffyEmbed({ src, title, height = '450px', className }: ZeffyEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setLoaded(true); },
      { rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height }}
      className={className}
    >
      {loaded ? (
        <iframe
          src={src}
          title={title}
          style={{
            position: 'absolute',
            border: 0,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '100%',
            height: '100%',
          }}
          loading="lazy"
        />
      ) : (
        <div
          style={{ position: 'absolute', inset: 0 }}
          className="flex items-center justify-center animate-pulse bg-green-deep/10 rounded-xl"
        >
          <p className="text-text-mid font-serif">Loading signup form…</p>
        </div>
      )}
    </div>
  );
}
