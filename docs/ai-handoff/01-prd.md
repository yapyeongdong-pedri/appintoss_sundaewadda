# SundaeWatta Product Requirements (PRD)

## Objective
Rebuild the current SundaeWatta app in another AI environment with equivalent behavior and user value.

## Product Scope (Current)
- Mobile-first web app for checking whether nearby sundae/gopchang trucks are open.
- Community live reports (`open` / `closed`) decide the current truck status.
- Users can submit:
  - new truck registration requests
  - existing truck update requests
- Final truck DB is not directly edited by user requests.

## In Scope
- Intro -> app start flow
- Map tab with vendor pins and current-location action
- Requests tab with:
  - registration request submission
  - recent registration/update request list
- Vendor detail bottom sheet
- Live report submission with location-based validation
- Supabase primary data source + localStorage fallback

## Out of Scope
- Settings tab
- Reviews feature
- Admin/backoffice
- AppsInToss runtime-specific SDK integration

## User Roles
- Anonymous end user (default)
- Operations reviewer (outside app)

## Core User Stories
1. As a user, I can quickly see nearby trucks on a map.
2. As a user, I can open a truck detail and report open/closed status.
3. As a user, I can request registration of a new truck with evidence.
4. As a user, I can request updates to an existing truck entry.

## Success Criteria
- App starts and loads usable data in web preview mode.
- User can submit all three actions without runtime error:
  - live report
  - registration request
  - update request
- Data is persisted to Supabase when available, and still works with fallback data when unavailable.
