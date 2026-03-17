# SundaeWatta Technical Specification

## Frontend Stack
- Vite + React + TypeScript
- App entry: `src/main.tsx`
- App shell: `src/App.tsx`

## Data Access
- Primary: Supabase (`src/lib/supabase.ts`, `src/lib/repository.ts`)
- Fallback: localStorage seed flow (`src/lib/localStore.ts`, `src/data/seed.ts`)

## Domain Model
- `Vendor`
- `LiveReport`
- `RegistrationRequest`
- `UpdateRequest`
- Shared types are in `src/types.ts`

## Status Calculation
- `src/lib/status.ts`
- Status values:
  - `likelyOpen`
  - `likelyClosed`
  - `unknown`
- Rule: latest live report drives open/closed; no report -> unknown.

## Live Report Rules
- `src/lib/liveReports.ts`
- Submission is blocked unless location quality rules are satisfied:
  - close enough to truck pin
  - acceptable GPS accuracy
  - no duplicate same-day same-type report by same reporter key

## External Integrations
- Kakao Map SDK via `src/lib/kakaoMap.ts`
- Address geocoding via Kakao maps service

## Database Contract
Canonical schema is `supabase/schema.sql`.

Tables in use:
- `vendors`
- `vendor_menu_items`
- `live_reports`
- `registration_requests`
- `update_requests`

Seed file:
- `supabase/seed.sql`

## Environment Variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_KAKAO_MAP_APP_KEY` (optional, fallback map works without it)
