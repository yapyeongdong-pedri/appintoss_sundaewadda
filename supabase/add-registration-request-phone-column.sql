alter table public.registration_requests
  add column if not exists phone text not null default '';
