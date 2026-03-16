with vendor_prices as (
  select
    id as vendor_id,
    category as vendor_category,
    menu_summary,
    regexp_split_to_array(coalesce(price_summary, ''), '\s*/\s*') as price_parts
  from public.vendors
),
expanded_menu_items as (
  select
    vendor_id,
    vendor_category,
    menu_name,
    ordinality,
    case
      when array_length(price_parts, 1) is null then ''
      when ordinality <= array_length(price_parts, 1) then price_parts[ordinality]
      else price_parts[array_length(price_parts, 1)]
    end as price,
    case
      when menu_name ilike '%순대%' then '순대'
      when menu_name ilike '%곱창%' then '곱창'
      when menu_name ilike '%통닭%' or menu_name ilike '%닭%' then '통닭'
      when menu_name ilike '%삼겹%' then '삼겹살'
      when menu_name ilike '%목살%' then '목살'
      when menu_name ilike '%타코야끼%' then '타코야끼'
      when vendor_category in ('순대', '곱창', '통닭', '삼겹살', '목살', '타코야끼') then vendor_category
      else '기타'
    end as menu_category
  from vendor_prices,
  unnest(menu_summary) with ordinality as items(menu_name, ordinality)
)
insert into public.vendor_menu_items (
  id,
  vendor_id,
  menu_name,
  price,
  menu_category,
  sort_order,
  is_available
)
select
  vendor_id || '-menu-' || ordinality,
  vendor_id,
  menu_name,
  coalesce(price, ''),
  menu_category,
  ordinality,
  true
from expanded_menu_items
on conflict (id) do update
set
  menu_name = excluded.menu_name,
  price = excluded.price,
  menu_category = excluded.menu_category,
  sort_order = excluded.sort_order,
  is_available = excluded.is_available,
  updated_at = now();
