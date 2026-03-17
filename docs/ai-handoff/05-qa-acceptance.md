# QA and Acceptance Checklist

## Functional QA
1. Intro screen appears first and starts app on CTA.
2. Map tab is default after start.
3. Selecting a vendor pin opens vendor detail sheet.
4. Submitting open/closed report updates in-memory UI immediately.
5. Duplicate same-day report by same reporter is blocked.
6. Registration request form validates required fields.
7. Update request form validates field-specific rules.
8. Requests tab shows latest registration/update cards.

## Data QA
1. With valid Supabase env, reads use Supabase tables.
2. Without env, local seed fallback loads without crash.
3. New submissions are stored in local fallback cache.

## UX QA
1. Main screens are mobile-friendly at narrow widths.
2. Bottom sheets open/close reliably.
3. Feedback banners and inline messages are readable.
4. No inaccessible/dead navigation item.

## Regression QA
- Verify status derivation utility tests.
- Verify live report validation tests.
- Verify visit-rule formatting/parsing tests.

## Release Gate
Ship only when all required functional QA items pass and there is no mismatch between docs and implementation.
