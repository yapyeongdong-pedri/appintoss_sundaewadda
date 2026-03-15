insert into public.vendors (
  id,
  name,
  category,
  phone,
  menu_summary,
  price_summary,
  business_hours,
  visit_pattern,
  description,
  position_x,
  position_y,
  address,
  owner_confirmed_today
) values
  (
    'vendor-sundae-1',
    '청춘순대트럭',
    '순대',
    '010-2486-2109',
    array['찰순대', '내장모듬', '떡볶이'],
    '4,000원~9,000원',
    '오후 5시 ~ 밤 11시',
    '화/목/토 저녁에 자주 와요',
    '퇴근 시간에 맞춰 오는 순대트럭이에요.',
    18,
    34,
    '성북천 입구 사거리',
    false
  ),
  (
    'vendor-gopchang-1',
    '곱창와따트럭',
    '곱창',
    '010-5310-7791',
    array['야채곱창', '순대곱창', '볶음밥'],
    '7,000원~12,000원',
    '오후 6시 ~ 밤 12시',
    '금/토 밤에 자주 와요',
    '주말 늦게까지 운영하는 곱창트럭이에요.',
    61,
    45,
    '정릉시장 후문',
    false
  ),
  (
    'vendor-sundae-2',
    '밤도깨비순대',
    '순대',
    '010-9941-1004',
    array['순대볶음', '순대꼬치', '간/허파'],
    '3,500원~10,000원',
    '오후 4시 ~ 밤 10시',
    '평일 저녁에 랜덤으로 와요',
    '학교 앞 골목에서 종종 만나는 트럭이에요.',
    78,
    22,
    '국민대 정문 아래',
    true
  )
on conflict (id) do nothing;

insert into public.reviews (id, vendor_id, author, body, score) values
  ('r1', 'vendor-sundae-1', '동네주민', '순대가 쫄깃하고 양념이 진해요.', 5),
  ('r2', 'vendor-sundae-1', '야식러', '퇴근길에 먹기 딱 좋아요.', 4),
  ('r3', 'vendor-gopchang-1', '곱창러버', '볶음밥 마무리가 좋아요.', 5),
  ('r4', 'vendor-sundae-2', '학생', '가성비가 좋아요.', 4)
on conflict (id) do nothing;

insert into public.live_reports (
  id,
  vendor_id,
  type,
  created_at,
  reporter_id,
  photo_label
) values
  ('report-1', 'vendor-sundae-1', 'open', '2026-03-15T18:05:00+09:00', 'guest-a', '순대 냄비 사진'),
  ('report-2', 'vendor-sundae-1', 'open', '2026-03-15T18:21:00+09:00', 'guest-b', null),
  ('report-3', 'vendor-gopchang-1', 'closed', '2026-03-15T22:02:00+09:00', 'guest-c', null),
  ('report-4', 'vendor-gopchang-1', 'open', '2026-03-15T19:18:00+09:00', 'guest-d', null),
  ('report-5', 'vendor-gopchang-1', 'closed', '2026-03-15T22:16:00+09:00', 'guest-e', null)
on conflict (id) do nothing;
