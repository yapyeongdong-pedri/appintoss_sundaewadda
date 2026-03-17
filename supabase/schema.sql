create table if not exists public.vendors (
  id text primary key,
  name text not null,
  category text not null,
  phone text not null,
  menu_summary text[] not null default '{}',
  price_summary text not null,
  business_hours text not null,
  visit_pattern text not null,
  description text not null,
  position_x numeric not null,
  position_y numeric not null,
  address text not null,
  owner_confirmed_today boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key,
  vendor_id text not null references public.vendors(id) on delete cascade,
  author text not null,
  body text not null,
  score integer not null check (score between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists reviews_vendor_id_idx on public.reviews (vendor_id);

create table if not exists public.live_reports (
  id text primary key,
  vendor_id text not null references public.vendors(id) on delete cascade,
  type text not null check (type in ('open', 'closed')),
  created_at timestamptz not null default now(),
  report_date_key text,
  note text,
  photo_label text,
  reporter_id text not null,
  reporter_key text,
  latitude numeric,
  longitude numeric,
  accuracy numeric
);

create index if not exists live_reports_vendor_id_idx on public.live_reports (vendor_id);
create index if not exists live_reports_created_at_idx on public.live_reports (created_at desc);

create table if not exists public.registration_requests (
  id text primary key,
  name text not null,
  phone text not null default '',
  location text not null,
  visit_pattern text not null,
  business_card_photo text not null default '',
  menu_board_photo text not null default '',
  submitted_at timestamptz not null default now(),
  duplicate_candidate_ids text[] not null default '{}'
);

create table if not exists public.update_requests (
  id text primary key,
  vendor_id text not null references public.vendors(id) on delete cascade,
  field text not null check (
    field in ('menu', 'price', 'visitPattern', 'businessHours', 'location', 'phone', 'closedNotice')
  ),
  value text not null,
  submitted_at timestamptz not null default now()
);

create index if not exists update_requests_vendor_id_idx on public.update_requests (vendor_id);

alter table public.vendors enable row level security;
alter table public.reviews enable row level security;
alter table public.live_reports enable row level security;
alter table public.registration_requests enable row level security;
alter table public.update_requests enable row level security;

drop policy if exists vendors_public_select on public.vendors;
create policy vendors_public_select on public.vendors
  for select
  to anon, authenticated
  using (true);

drop policy if exists reviews_public_select on public.reviews;
create policy reviews_public_select on public.reviews
  for select
  to anon, authenticated
  using (true);

drop policy if exists live_reports_public_select on public.live_reports;
create policy live_reports_public_select on public.live_reports
  for select
  to anon, authenticated
  using (true);

drop policy if exists live_reports_public_insert on public.live_reports;
create policy live_reports_public_insert on public.live_reports
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists registration_requests_public_select on public.registration_requests;
create policy registration_requests_public_select on public.registration_requests
  for select
  to anon, authenticated
  using (true);

drop policy if exists registration_requests_public_insert on public.registration_requests;
create policy registration_requests_public_insert on public.registration_requests
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists update_requests_public_select on public.update_requests;
create policy update_requests_public_select on public.update_requests
  for select
  to anon, authenticated
  using (true);

drop policy if exists update_requests_public_insert on public.update_requests;
create policy update_requests_public_insert on public.update_requests
  for insert
  to anon, authenticated
  with check (true);
