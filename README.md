# SundaeWatta

Mobile-first app for checking nearby sundae/gopchang truck operating status.

## Start Here
- AI handoff package: `docs/ai-handoff/`
- Current architecture: `docs/architecture.md`
- Current database contract: `docs/database-schema.md`
- Deployment baseline: `docs/deployment-guide.md`

## Tech Stack
- Vite + React + TypeScript
- Supabase (primary data)
- localStorage fallback

## Environment Variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_KAKAO_MAP_APP_KEY` (optional)
