import { test as setup, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Signs in the dedicated E2E member account WITHOUT touching the OAuth UI.
//
// Why: the sign-in page only offers Google/Facebook/Apple, and third-party OAuth
// flows actively block automation. But Supabase auth still honors the email/password
// grant for users that have one — the e2e-test account was created directly in
// auth.users with a password for exactly this purpose.
//
// How: POST the password grant → get a session → write it into the browser as the
// same cookie @supabase/ssr would have written (`sb-<ref>-auth-token`, `base64-`
// prefixed JSON, chunked at ~3180 chars). The app's middleware then sees a normal
// logged-in member. If Supabase changes the cookie contract (see vault STOP 12 for
// a prior silent break), this file is the only place to update.

const SUPABASE_URL = 'https://osiramhnynhwmlfyuqcp.supabase.co';
// The anon key is public by design (it ships in every client bundle).
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zaXJhbWhueW5od21sZnl1cWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzk1MTksImV4cCI6MjA4ODc1NTUxOX0.1jMxPIt5t60D8Qvl0lltRLnOgH2vFas0q4Ix2ojpsfM';
const PROJECT_REF = 'osiramhnynhwmlfyuqcp';
const COOKIE_CHUNK_SIZE = 3180; // matches @supabase/ssr's chunking threshold

setup('authenticate member', async ({ }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  if (!email || !password) {
    throw new Error('E2E_EMAIL / E2E_PASSWORD not set — export them or add GitHub secrets.');
  }

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  expect(res.status, 'password grant should succeed').toBe(200);
  const session = await res.json();
  expect(session.access_token).toBeTruthy();

  // Serialize the session the way @supabase/ssr stores it client-side.
  const value = 'base64-' + Buffer.from(JSON.stringify(session)).toString('base64');
  const baseUrl = new URL(process.env.E2E_BASE_URL ?? 'https://bayoucharity.org');
  const base = {
    domain: baseUrl.hostname,
    path: '/',
    httpOnly: false,
    // Must match the scheme under test: a Secure cookie is never sent over
    // plain http, so a hardcoded `secure: true` makes local runs against
    // `next start` (http://localhost:3000) look logged-out.
    secure: baseUrl.protocol === 'https:',
    sameSite: 'Lax' as const,
    expires: Math.floor(Date.now() / 1000) + 3600,
  };
  const cookies =
    value.length <= COOKIE_CHUNK_SIZE
      ? [{ name: `sb-${PROJECT_REF}-auth-token`, value, ...base }]
      : Array.from({ length: Math.ceil(value.length / COOKIE_CHUNK_SIZE) }, (_, i) => ({
          name: `sb-${PROJECT_REF}-auth-token.${i}`,
          value: value.slice(i * COOKIE_CHUNK_SIZE, (i + 1) * COOKIE_CHUNK_SIZE),
          ...base,
        }));

  const statePath = path.join(__dirname, '.auth', 'member.json');
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify({ cookies, origins: [] }, null, 2));
});
