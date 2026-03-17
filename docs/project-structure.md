# Project Structure

```text
appintoss_sundaewadda/
  AGENTS.md
  CLAUDE.md
  README.md
  docs/
    ai-handoff/
      01-prd.md
      02-ux-spec.md
      03-technical-spec.md
      04-ai-implementation-playbook.md
      05-qa-acceptance.md
      06-deployment-ops.md
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

## Notes
- `docs/ai-handoff/` is the canonical package for rebuilding the app with another AI.
- `supabase/` keeps a single canonical schema and seed set.
