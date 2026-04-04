'use client';

// BetterStack: client-side logs handled via console transport in instrumentation.ts
// Server-side BetterStack log shipping handled by @logtail/next in instrumentation.ts
// PostHog: deferred to Phase 3 (no v2 traffic yet)

export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
