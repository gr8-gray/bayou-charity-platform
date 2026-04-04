'use client';

import Image from 'next/image';

interface Badge {
  label: string;
  color: string; // Tailwind bg class e.g. 'bg-amber/20'
}

interface ContentCardProps {
  title: string;
  badges?: Badge[];
  meta: string;
  body: string;
  imageUrl?: string;
  footer?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner: boolean;
  isAdmin: boolean;
}

export function ContentCard({
  title,
  badges,
  meta,
  body,
  imageUrl,
  footer,
  onEdit,
  onDelete,
  isOwner,
  isAdmin,
}: ContentCardProps) {
  const showEdit = isOwner && onEdit;
  const showDelete = (isOwner || isAdmin) && onDelete;

  return (
    <article className="glass-card rounded-2xl p-5 flex flex-col gap-1">
      {/* Badges */}
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={`${badge.color} text-xs font-semibold px-3 py-1 rounded-full text-text-dark dark:text-green-deep`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="font-display text-lg text-text-dark dark:text-gold leading-snug">
        {title}
      </h3>

      {/* Meta */}
      <p className="text-xs text-text-mid dark:text-cream/60">{meta}</p>

      {/* Body */}
      <p className="text-sm text-text-dark dark:text-cream/85 leading-relaxed mt-2">
        {body}
      </p>

      {/* Image */}
      {imageUrl && (
        <div className="relative w-full max-h-48 overflow-hidden rounded-lg mt-3">
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Footer slot */}
      {footer && <div className="mt-2">{footer}</div>}

      {/* Edit / Delete */}
      {(showEdit || showDelete) && (
        <div className="flex justify-end gap-3 mt-3 pt-2 border-t border-green-water/20">
          {showEdit && (
            <button
              onClick={onEdit}
              className="text-xs text-text-mid hover:text-amber dark:text-cream/50 dark:hover:text-amber transition-colors"
            >
              Edit
            </button>
          )}
          {showDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}
