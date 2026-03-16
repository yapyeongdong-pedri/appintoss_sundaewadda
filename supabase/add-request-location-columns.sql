alter table public.registration_requests
  add column if not exists latitude numeric,
  add column if not exists longitude numeric;

alter table public.update_requests
  add column if not exists proposed_latitude numeric,
  add column if not exists proposed_longitude numeric;
