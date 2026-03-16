create table if not exists public.vendor_menu_items (
  id text primary key,
  vendor_id text not null references public.vendors(id) on delete cascade,
  menu_name text not null,
  price text not null default '',
  menu_category text not null default '기타',
  sort_order integer not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vendor_menu_items_vendor_id_idx
  on public.vendor_menu_items (vendor_id);

create index if not exists vendor_menu_items_category_idx
  on public.vendor_menu_items (menu_category);

alter table if exists public.vendor_menu_items enable row level security;

drop policy if exists vendor_menu_items_public_select on public.vendor_menu_items;
create policy vendor_menu_items_public_select on public.vendor_menu_items
  for select
  to anon, authenticated
  using (true);

alter table if exists public.registration_requests
  add column if not exists menu_categories text[] not null default '{}';

alter table if exists public.update_requests
  drop constraint if exists update_requests_field_check;

alter table if exists public.update_requests
  add constraint update_requests_field_check
  check (field in ('menu', 'visitPattern', 'businessHours', 'location', 'phone', 'closedNotice'));

alter table if exists public.update_requests
  add column if not exists menu_category text,
  add column if not exists target_menu_name text,
  add column if not exists current_menu_name text,
  add column if not exists current_menu_price text,
  add column if not exists proposed_menu_name text,
  add column if not exists proposed_menu_price text;
