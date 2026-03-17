# Deployment Guide

## Local
1. Set `.env` values:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - optional `VITE_KAKAO_MAP_APP_KEY`
2. Run dev server.

## Supabase
1. Execute `supabase/schema.sql`.
2. Execute `supabase/seed.sql` (optional for production).

## Vercel
1. Connect repository.
2. Configure environment variables.
3. Deploy and smoke test map/report/request flows.

## Rule
Always keep browser preview working when adding platform-specific integrations.
