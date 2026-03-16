# SundaeWatta Agent Guide

## Project Summary
- `순대와따` is a mobile-first web app for checking whether nearby sundae and gopchang trucks are open today.
- The current app must work in both a normal web preview environment and a future AppsInToss environment.
- Keep the experience simple, short, and optimized for small mobile screens.

## Current Product Direction
- Main navigation has 3 tabs: `지도 보기`, `트럭 추가`, `설정`
- Main screens should avoid page-level scrolling
- Landing copy should stay short enough to avoid awkward line wraps
- Truck detail opens in a bottom sheet
- Registration requests and update requests are managed separately from the final truck DB

## Technical Rules
- Web preview on Vercel must keep working
- Do not add Toss-only SDK usage without a safe web fallback
- Supabase is the primary data source
- `localStorage` is a fallback only for local resilience
- Use mobile-first layout and Toss-like visual tone

## Key Paths
- App shell: `src/App.tsx`
- Shared UI wrappers: `src/ui.tsx`
- Screen components: `src/components/`
- Data access: `src/lib/repository.ts`
- Status logic: `src/lib/status.ts`
- Supabase schema: `supabase/schema.sql`
- Seed data: `supabase/seed.sql`
- Project docs entry: `README.md`

## Before Big Changes
- Check `docs/current-status.md`
- Check `docs/architecture.md`
- Check `docs/database-schema.md` if the change touches data shape

## Avoid
- Breaking the Vercel preview build
- Replacing the current fallback data flow without updating docs
- Adding verbose copy or desktop-first layout decisions
