# SundaeWatta Context

## What This Project Is
- A Toss-style mobile web app for nearby sundae and gopchang truck discovery
- Built to preview on Vercel now
- Planned to support AppsInToss later with environment-specific integration

## Product Priorities
- Mobile-first UI
- No page-level scroll on main tabs
- Fast map-first discovery
- Simple request flow for truck registration and truck info updates
- Short Korean copy with clear meaning

## Architecture Snapshot
- Frontend: Vite + React + TypeScript
- Data: Supabase primary, `localStorage` fallback
- Current tabs:
  - `지도 보기`
  - `트럭 추가`
  - `설정`
- Detail interactions use bottom sheets

## Files To Read First
- `README.md`
- `docs/current-status.md`
- `docs/architecture.md`
- `docs/database-schema.md`

## Important Constraints
- Keep Vercel preview functional
- Do not assume Toss-only packages can run on the open web
- Keep docs and product wording aligned with current shipped behavior
