export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }

  // BetterStack: @logtail/next auto-configures from BETTERSTACK_SOURCE_TOKEN — no manual wiring needed.
  // Use `log` from '@logtail/next' in server code to ship logs.
}
