# SundaeWatta UX and Screen Spec

## Navigation
- Bottom nav has exactly 2 tabs:
  - `map`
  - `requests`

## Screen 1: Intro
- Component: `IntroSection`
- Goal: short onboarding and start CTA.
- Exit action: set app `started = true`.

## Screen 2: Map
- Component: `NeighborhoodMap`
- Primary content:
  - Kakao map (live mode) when API key exists
  - fallback canvas map when key is missing/unavailable
- Required interactions:
  - vendor pin select
  - "my location" action with explicit consent sheet
  - status legend (open / closed / unknown)

## Sheet 1: Vendor Detail
- Component: `VendorSheet`
- Trigger: selecting a vendor pin
- Required content:
  - vendor name, location, visit pattern, business hours
  - latest menu board photos
  - report counters (`open`, `closed`)
- Required actions:
  - call (`tel:`)
  - sms (`sms:`)
  - open update request sheet
  - submit open/closed report

## Screen 3: Requests
- Component: `RequestsScreen`
- Required content:
  - CTA for new registration request
  - recent registration requests
  - recent update requests
  - optional feedback banner

## Sheet 2: Registration Request
- Component: `RegistrationSheet`
- Required form fields:
  - truck name
  - owner phone
  - location pin + description
  - visit rules
  - business hours
  - menu categories
  - business card photo
  - menu board photos (up to 3)

## Sheet 3: Update Request
- Component: `UpdateSheet`
- Supported update fields:
  - `menuBoard`
  - `visitPattern`
  - `businessHours`
  - `location`
  - `phone`
  - `closedNotice`
- Field-specific validation must be enforced before submit.

## UX Constraints
- Keep all main flows mobile-first.
- Keep copy short and scannable.
- Avoid large page-level scroll in top-level tabs.
- Use bottom sheets for write actions.
