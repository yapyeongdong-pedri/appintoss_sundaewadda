# Project Structure

## Current Structure

```text
appintoss_sundaewadda/
  AGENTS.md
  CLAUDE.md
  README.md
  docs/
    architecture.md
    current-status.md
    database-schema.md
    deployment-guide.md
    project-structure.md
    service-overview.md
  src/
    components/
    data/
    lib/
    App.tsx
    main.tsx
    styles.css
    types.ts
    ui.tsx
  supabase/
    schema.sql
    seed.sql
```

## Why This Structure Is Efficient
- `AGENTS.md` and `CLAUDE.md` stay short for agent context
- `README.md` acts as the entry point
- `docs/` stores human-readable detail without bloating agent context
- `src/` stays focused on shipped code
- `supabase/` stays focused on DB artifacts

## Best Practice For Context Efficiency
- Read `AGENTS.md` or `CLAUDE.md` first
- Read `README.md` second
- Only open a specific file in `docs/` when needed
- Do not put long planning notes into agent bootstrap files

## Recommended Future Growth Path

### Keep these files short
- `AGENTS.md`
- `CLAUDE.md`
- `README.md`

### Move detailed decisions into docs
- product direction
- DB decisions
- deployment notes
- current implementation status

### Split source code by feature later
This is the best next structural improvement once the UI grows further.
