alter table public.live_reports
  alter column type drop not null;

update public.live_reports
set type = 'closed'
where type = 'notYet';

alter table public.live_reports
  alter column type set not null;

alter table public.live_reports
  drop constraint if exists live_reports_type_check;

alter table public.live_reports
  add constraint live_reports_type_check check (type in ('open', 'closed'));

alter table public.live_reports
  add column if not exists report_date_key text,
  add column if not exists reporter_key text,
  add column if not exists latitude numeric,
  add column if not exists longitude numeric,
  add column if not exists accuracy numeric;

create index if not exists live_reports_vendor_report_date_idx
  on public.live_reports (vendor_id, report_date_key, type);
