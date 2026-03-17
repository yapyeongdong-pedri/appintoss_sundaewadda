# Architecture

## Runtime
- Browser-first web app (Vercel preview must work)
- Optional Kakao map live mode; fallback map if unavailable

## App Layers
- UI shell and state: `src/App.tsx`
- Screen/Sheet components: `src/components/`
- Domain logic and integrations: `src/lib/`
- Shared contracts: `src/types.ts`
- Fallback seed data: `src/data/seed.ts`

## Data Strategy
- Read/write with Supabase when configured
- Fallback to localStorage for resilience and local preview
- Request tables are separated from final vendor table

## Navigation
- `map`
- `requests`
