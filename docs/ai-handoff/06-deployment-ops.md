# Deployment and Operations Guide

## Environments
- Local dev
- Vercel preview/production
- Supabase project

## Deployment Steps
1. Set env vars in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - optional `VITE_KAKAO_MAP_APP_KEY`
2. Deploy app build.
3. Smoke test map + request flows.

## Database Setup
1. Run `supabase/schema.sql`.
2. Run `supabase/seed.sql` for initial data (optional in production).

## Rollback Strategy
- Frontend rollback: redeploy previous commit.
- DB rollback: restore from Supabase backup snapshot.

## Monitoring Focus
- Supabase read/write errors in browser console logs
- Location permission failure rate for live reports
- Request submission failure rate
- Map SDK loading failures

## Operational Rule
Keep app-side behavior simple; moderation and final data approval happen in external operational workflow.
