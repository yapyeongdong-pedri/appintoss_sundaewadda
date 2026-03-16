alter table public.vendors
  add column if not exists menu_board_photos text[] not null default '{}';

alter table public.registration_requests
  add column if not exists menu_board_photos text[] not null default '{}';

alter table public.update_requests
  add column if not exists menu_board_photos text[] not null default '{}';

update public.registration_requests
set menu_board_photos = case
  when coalesce(menu_board_photo, '') = '' then '{}'
  else array[menu_board_photo]
end
where coalesce(array_length(menu_board_photos, 1), 0) = 0;

alter table if exists public.update_requests
  drop constraint if exists update_requests_field_check;

alter table if exists public.update_requests
  add constraint update_requests_field_check
  check (field in ('menu', 'menuBoard', 'visitPattern', 'businessHours', 'location', 'phone', 'closedNotice'));
