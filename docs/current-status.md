# Current Status

## What Is Implemented
- Vite + React + TypeScript app shell
- Mobile-first landing page
- Bottom navigation with 3 tabs
- Map-like local truck canvas UI
- Truck detail bottom sheet
- Live report submission
- New truck registration request flow
- Truck info update request flow
- Supabase connection
- `localStorage` fallback for resilience
- Vercel deployment flow

## What Is Not Final Yet
- Real map SDK integration
- AppsInToss-specific runtime integration
- Real Toss design system package usage in production-safe dual mode
- Owner-confirmed status flow
- Final settings tab scope
- Backoffice/admin UI

## Current Data Flow
- Read app data from Supabase when env vars are available
- Fall back to local storage if Supabase is unavailable
- Save live reports immediately
- Save registration requests immediately
- Save update requests immediately
- Final truck DB still assumes separate operational review flow

## Current UX Constraints
- Main tab screens should not introduce page-level scroll
- Keep copy concise
- Vercel preview must remain usable

## Next Likely Milestones
- Replace mock map canvas with a real map provider
- Split web preview mode and AppsInToss mode more explicitly
- Define settings tab scope
- Define owner-confirmed status design
- Add stronger request/progress semantics
