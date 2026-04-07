import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: process.env.NODE_ENV === 'development',
  // Replay removed — not in active use, saves ~60KB on every page
  // Re-enable with replayIntegration() when production traffic warrants session recording
});
