'use client';

import { useEffect, useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(null), 2500);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  const getUrl = () =>
    typeof window !== 'undefined'
      ? (url ?? window.location.href)
      : (url ?? '');

  const openPopup = (href: string) => {
    window.open(href, '_blank', 'width=600,height=400');
  };

  const handleFacebook = () => {
    openPopup(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`
    );
  };

  const handleTwitter = () => {
    openPopup(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&hashtags=BayouCharity,Louisiana,Fishing`
    );
  };

  const handleTikTok = async () => {
    const caption = `${title} #BayouCharity #Louisiana #Fishing`;
    try {
      await navigator.clipboard.writeText(caption);
      setToastMsg('Caption copied! Paste in your TikTok or Instagram post.');
    } catch {
      setToastMsg('Could not access clipboard.');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setToastMsg('Link copied!');
    } catch {
      setToastMsg('Could not access clipboard.');
    }
  };

  const btnClass =
    'flex items-center gap-1.5 text-xs bg-amber/15 hover:bg-amber/30 text-amber border border-amber/30 rounded-full px-3 py-1.5 transition-colors';

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2">
        <button onClick={handleFacebook} className={btnClass} aria-label="Share on Facebook">
          fb
        </button>
        <button onClick={handleTwitter} className={btnClass} aria-label="Share on X (Twitter)">
          𝕏
        </button>
        <button onClick={handleTikTok} className={btnClass} aria-label="Copy TikTok caption">
          TikTok
        </button>
        <button onClick={handleCopyLink} className={btnClass} aria-label="Copy link">
          🔗 Copy
        </button>
      </div>

      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-green-deep text-cream text-xs px-4 py-2 rounded-full shadow-lg pointer-events-none"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
