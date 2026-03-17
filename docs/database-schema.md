# Database Schema

Canonical files:
- `supabase/schema.sql`
- `supabase/seed.sql`

## Tables
- `vendors`: final approved truck data
- `vendor_menu_items`: normalized menu rows per vendor
- `live_reports`: append-only open/closed reports
- `registration_requests`: user proposals for new trucks
- `update_requests`: user proposals for existing truck updates

## Data Policy
- Final vendor table is separated from user request tables.
- App writes to report/request tables only.
- Operational review flow promotes approved requests into final data.
