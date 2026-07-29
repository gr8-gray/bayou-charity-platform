import { defineConfig } from '@playwright/test';

// E2E tests for the customer paths (STOP 19: no customer-facing build without them).
//
// These run against a LIVE deployment (default: production bayoucharity.org) — there
// is no staging stack; the BFF Test Supabase project is inactive. Tests are written
// to be prod-safe: they assert on client-side gates and page behavior, and the only
// write they can produce is a pending gallery upload the admin can reject.
//
// Auth: the sign-in UI is OAuth-only (Google/FB/Apple), which can't be automated.
// auth.setup.ts instead signs in the dedicated e2e member account via the
// Supabase password grant and injects the session cookie — see that file.
// Credentials come from env (E2E_EMAIL / E2E_PASSWORD, GitHub secrets in CI) and
// must NEVER be committed or typed into the UI (vault STOP 20).
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'https://bayoucharity.org',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'authenticated',
      testMatch: /(upload|gallery-roundtrip|never-empty)\.spec\.ts/,
      dependencies: ['setup'],
      use: { storageState: 'e2e/.auth/member.json' },
    },
    {
      name: 'public',
      testMatch: /(donate|public-smoke)\.spec\.ts/,
    },
  ],
});
