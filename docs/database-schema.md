# Database Schema

## Data Layers
The product uses three logical layers of data:

1. Final truck data
2. Request data
3. Live report data

This separation is intentional because final truck information should not be overwritten directly by user submissions.

## Main Tables

### `vendors`
Final approved truck data used by the map and truck detail screens.

Typical fields:
- id
- name
- category
- phone
- menu summary
- price summary
- business hours
- visit pattern
- description
- position
- owner confirmed flag

### `reviews`
Food-related reviews attached to a truck.

### `live_reports`
Realtime status events for the current day.

Typical fields:
- id
- vendor id
- report type
- created at
- reporter id
- optional note
- optional photo label

### `registration_requests`
New truck proposals from users.

Typical fields:
- name
- location
- visit pattern
- business card photo description
- menu board photo description
- duplicate candidate ids

### `update_requests`
Proposed updates to an existing truck.

Typical fields:
- vendor id
- field
- value
- submitted at

## Current Source of Truth
- Schema file: `supabase/schema.sql`
- Seed data: `supabase/seed.sql`
- App mapping layer: `src/lib/repository.ts`

## Why This Is Efficient
- Final truck data stays stable
- User participation stays lightweight
- Operations can review requests separately
- Live events stay append-only and easy to reason about

## Recommended Future DB Folder Shape
```text
supabase/
  migrations/
  seed.sql
  schema.sql
  policies.sql
```

If DB complexity grows, move from a single schema file into timestamped migrations.
