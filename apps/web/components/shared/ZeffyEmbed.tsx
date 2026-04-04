'use client';

interface ZeffyEmbedProps {
  src: string;
  title: string;
  height?: string;
  className?: string;
}

export function ZeffyEmbed({ src, title, height = '450px', className }: ZeffyEmbedProps) {
  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height }}
      className={className}
    >
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
    </div>
  );
}
