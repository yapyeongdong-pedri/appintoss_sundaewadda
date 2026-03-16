# Architecture

## Runtime Strategy
The project uses a dual-environment strategy:

- `Web preview mode`
  - Runs on Vercel
  - Must work in a standard browser
  - Avoids Toss-only runtime dependencies
- `Future AppsInToss mode`
  - Will run inside Toss WebView
  - Can later add Toss-specific SDK integration behind environment-safe boundaries

## Frontend Structure
- `src/App.tsx`
  - App shell
  - Bootstrapping
  - Screen switching
  - Bottom sheet state
- `src/components/`
  - Screen-level and section-level UI pieces
- `src/ui.tsx`
  - Local UI wrapper components used instead of direct Toss-only runtime packages
- `src/lib/`
  - Data access
  - status calculation
  - duplication checks
  - Supabase client
- `src/data/seed.ts`
  - Local fallback mock data

## Recommended Future Code Structure
When the app grows, move from the current flat component folder into a feature-based structure:

```text
src/
  app/
  features/
    intro/
    map/
    requests/
    settings/
    vendor-detail/
  shared/
    ui/
    lib/
    types/
    data/
```

This keeps feature logic, UI, and local helpers closer together.

## UI Strategy
- Mobile-first layout
- Short Korean copy
- Main interactions in cards and bottom sheets
- Keep page-level layout stable
- Avoid relying on desktop-only spacing assumptions

## Operational Strategy
- User-facing app is separate from operational review flow
- Review and moderation do not need to live inside the mini-app at first
- Final DB quality is maintained outside the main user app if needed
