insert into public.vendors (
  id,
  name,
  category,
  phone,
  menu_summary,
  menu_board_photos,
  price_summary,
  business_hours,
  visit_pattern,
  visit_rules,
  description,
  position_x,
  position_y,
  address,
  latitude,
  longitude
) values
  (
    'vendor-sundae-1',
    'Cheongchun Sundae Truck',
    'sundae',
    '010-2486-2109',
    array['sticky rice sundae', 'innards platter', 'fish cake soup'],
    array['menu-board-1', 'menu-board-2'],
    '4,000won / 9,000won',
    '17:00-23:00',
    'Tue/Thu/Sat evening',
    '[{"mode":"weekly","interval":1,"weekdays":["tue","thu","sat"]}]'::jsonb,
    'commuter focused stop',
    18,
    34,
    'Seongbuk stream intersection',
    37.6034,
    127.0177
  ),
  (
    'vendor-gopchang-1',
    'Gopchang Next Truck',
    'gopchang',
    '010-5310-7791',
    array['vegetable gopchang', 'sundae gopchang', 'fried rice'],
    array['menu-board-1', 'menu-board-2'],
    '7,000won / 12,000won',
    '18:00-24:00',
    'Fri/Sat night',
    '[{"mode":"weekly","interval":1,"weekdays":["fri","sat"]}]'::jsonb,
    'weekend focused stop',
    61,
    45,
    'Jeongneung market front',
    37.6065,
    127.0124
  ),
  (
    'vendor-sundae-2',
    'Baro Sundae',
    'sundae',
    '010-9941-1004',
    array['stir-fried sundae', 'sundae skewer', 'tteok'],
    array['menu-board-1'],
    '3,500won / 8,000won',
    '16:00-22:00',
    'weekday evenings',
    '[{"mode":"weekly","interval":1,"weekdays":["mon","tue","wed","thu","fri"]}]'::jsonb,
    'school front alley',
    78,
    22,
    'Kookmin University gate',
    37.6108,
    127.0298
  )
on conflict (id) do nothing;

insert into public.vendor_menu_items (
  id,
  vendor_id,
  menu_name,
  price,
  menu_category,
  sort_order,
  is_available
) values
  ('vendor-sundae-1-menu-1', 'vendor-sundae-1', 'sticky rice sundae', '4,000won', 'sundae', 1, true),
  ('vendor-sundae-1-menu-2', 'vendor-sundae-1', 'innards platter', '7,000won', 'sundae', 2, true),
  ('vendor-sundae-1-menu-3', 'vendor-sundae-1', 'fish cake soup', '9,000won', 'sundae', 3, true),
  ('vendor-gopchang-1-menu-1', 'vendor-gopchang-1', 'vegetable gopchang', '7,000won', 'gopchang', 1, true),
  ('vendor-gopchang-1-menu-2', 'vendor-gopchang-1', 'sundae gopchang', '10,000won', 'gopchang', 2, true),
  ('vendor-gopchang-1-menu-3', 'vendor-gopchang-1', 'fried rice', '12,000won', 'other', 3, true),
  ('vendor-sundae-2-menu-1', 'vendor-sundae-2', 'stir-fried sundae', '8,000won', 'sundae', 1, true),
  ('vendor-sundae-2-menu-2', 'vendor-sundae-2', 'sundae skewer', '3,500won', 'sundae', 2, true),
  ('vendor-sundae-2-menu-3', 'vendor-sundae-2', 'tteok', '4,000won', 'other', 3, true)
on conflict (id) do nothing;

insert into public.live_reports (
  id,
  vendor_id,
  type,
  created_at,
  report_date_key,
  reporter_id
) values
  ('report-1', 'vendor-sundae-1', 'open', '2026-03-15T18:05:00+09:00', '2026-03-15', 'guest-a'),
  ('report-2', 'vendor-sundae-1', 'open', '2026-03-15T18:21:00+09:00', '2026-03-15', 'guest-b'),
  ('report-3', 'vendor-gopchang-1', 'closed', '2026-03-15T22:02:00+09:00', '2026-03-15', 'guest-c'),
  ('report-4', 'vendor-gopchang-1', 'open', '2026-03-15T19:18:00+09:00', '2026-03-15', 'guest-d'),
  ('report-5', 'vendor-gopchang-1', 'closed', '2026-03-15T22:16:00+09:00', '2026-03-15', 'guest-e')
on conflict (id) do nothing;
