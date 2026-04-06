# Bayou Charity Platform

A full-stack nonprofit platform for [Bayou Charity](https://bayoucharity.org) — connecting Louisiana's fishing and outdoor community through events, donations, and member engagement.

**Live at [bayoucharity.org](https://bayoucharity.org)**

## Features

- **Member Portal** — Google, Facebook, and Apple OAuth via Supabase Auth with role-based access (member, guide, admin)
- **Interactive Map** — Community fishing pins with photos, captions, and location data
- **Social Feed** — Member activity stream with photo uploads and engagement
- **Photo Gallery** — Event galleries with submission pipeline and admin moderation
- **Donations** — Zeffy integration (zero-fee nonprofit payments)
- **PWA** — Installable progressive web app with offline navigation fallback

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Supabase (Auth, Row-Level Security, Edge Functions, Storage) |
| Database | PostgreSQL (via Supabase) |
| Hosting | Cloudflare Workers (SSR via @opennextjs/cloudflare) |
| CI/CD | GitHub Actions |
| Monitoring | BetterStack (uptime + logs) |
| Analytics | PostHog |

## Architecture

Monorepo using npm workspaces:

```
apps/
  web/              # Next.js 16 web application
packages/
  supabase/         # Shared Supabase client, types, migrations
  ui/               # Shared UI components (future)
```

Key architectural decisions:
- **Server Components by default** — client boundaries only where interactivity requires it
- **Row-Level Security** — all data access gated by Supabase RLS policies, no service role key in frontend
- **Shared types** — auto-generated from Supabase schema, shared across web and future mobile app (Expo)
- **Edge Functions** — `admin-notify`, `notify-rsvp`, `auto-archive` for server-side automation

## Design System

Glassmorphic design language with locked-in tokens carried from v1:

| Token | Hex | Usage |
|-------|-----|-------|
| Green Deep | `#0d2b3e` | Nav, overlay base, darkest bg |
| Green Water | `#1a4a6b` | Mid blue-green |
| Amber | `#e8923a` | Links, accents, CTAs |
| Gold | `#c9a84c` | Eyebrows, headings on dark |
| Cream | `#eef6fb` | Light section backgrounds |

Typography: **Lora** (body), **Playfair Display** (headings), **Caveat** (handwritten accents)

WCAG 2.1 AA compliant. Dark mode supported. Mobile-first responsive design.

## Getting Started

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### Environment Variables

Requires a `.env.local` with Supabase project URL and anon key. See `.env.example` for the template.

## Deployment

Production deploys via GitHub Actions to Cloudflare Workers. Push to `main` triggers the `web-deploy.yml` workflow with automated preview environments on PRs.

## Previous Version

The original site (v1) was a single-file vanilla HTML/CSS/JS application, archived at [BFFwebsite](https://github.com/gr8gray253/BFFwebsite). The v2 rewrite moved to a proper framework to eliminate structural maintenance debt.

## License

Private — built for Bayou Charity.
