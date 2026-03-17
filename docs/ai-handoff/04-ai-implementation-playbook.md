# AI Implementation Playbook

## Goal
Let another AI rebuild this app to the same quality and behavior without hidden assumptions.

## Build Order
1. Scaffold Vite React TypeScript app.
2. Implement core types (`src/types.ts`).
3. Implement repository + fallback data flow.
4. Implement app shell state in `src/App.tsx`.
5. Implement map tab and vendor sheet.
6. Implement registration/update sheets.
7. Implement request list tab.
8. Apply final styles and responsive tuning.
9. Run tests for status/report/visit-rule utilities.

## Mandatory Functional Checklist
- Intro to app start transition works.
- Map tab renders and pin selection opens vendor sheet.
- Live report submission enforces location constraints.
- Registration request submission persists.
- Update request submission persists.
- Requests tab shows recent request entries.
- App still works when Supabase env vars are missing.

## Guardrails
- Do not add settings tab in this phase.
- Do not add reviews feature.
- Do not add Toss-only SDK coupling without browser-safe fallback.
- Keep the request-vs-final-data separation.

## Code Quality Rules
- Keep feature logic in `src/components` and `src/lib` only.
- Keep domain contracts centralized in `src/types.ts`.
- Keep status derivation and validation logic in dedicated utility files.
- Avoid schema branching for legacy column formats.

## Done Definition
- Build passes.
- Utility tests pass.
- No dead tabs, dead components, or legacy payload branches.
- Docs in `docs/ai-handoff` match actual code behavior.
