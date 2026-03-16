alter table if exists public.vendors
  add column if not exists menu_items jsonb not null default '[]'::jsonb;

comment on column public.vendors.menu_items is
  'Array of menu objects like [{"name":"순대","price":"4,000원"}]';
