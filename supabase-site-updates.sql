create extension if not exists pgcrypto;

create table if not exists public.site_updates (
  id uuid primary key default gen_random_uuid(),
  target text not null default 'latest',
  title text not null,
  description text not null,
  event_date date,
  image_url text not null,
  image_path text not null,
  image_position_y integer not null default 50,
  image_zoom numeric(4,2) not null default 1,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.site_updates
  add column if not exists target text not null default 'latest',
  add column if not exists image_position_y integer not null default 50,
  add column if not exists image_zoom numeric(4,2) not null default 1;

update public.site_updates
set
  image_position_y = greatest(0, least(100, coalesce(image_position_y, 50))),
  image_zoom = greatest(0.75, least(1.80, coalesce(image_zoom, 1)));

alter table public.site_updates
  alter column image_position_y set default 50,
  alter column image_position_y set not null,
  alter column image_zoom set default 1,
  alter column image_zoom set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.site_updates'::regclass
      and conname = 'site_updates_target_check'
  ) then
    alter table public.site_updates
      add constraint site_updates_target_check
      check (target in ('latest', 'mbatik', 'collaboration', 'product', 'story'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.site_updates'::regclass
      and conname = 'site_updates_image_position_y_check'
  ) then
    alter table public.site_updates
      add constraint site_updates_image_position_y_check
      check (image_position_y between 0 and 100);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.site_updates'::regclass
      and conname = 'site_updates_image_zoom_check'
  ) then
    alter table public.site_updates
      add constraint site_updates_image_zoom_check
      check (image_zoom between 0.75 and 1.80);
  end if;
end $$;

create index if not exists site_updates_published_date_idx
  on public.site_updates (is_published, event_date desc, created_at desc);

create index if not exists site_updates_target_date_idx
  on public.site_updates (target, is_published, event_date desc, created_at desc);

create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text unique,
  kind text not null default 'custom',
  label text not null,
  title text not null,
  description text not null,
  image_url text,
  image_path text,
  is_visible boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  page_key text not null default 'home'
);

alter table public.homepage_sections
  add column if not exists section_key text,
  add column if not exists kind text,
  add column if not exists label text,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists image_url text,
  add column if not exists image_path text,
  add column if not exists is_visible boolean,
  add column if not exists sort_order integer,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

alter table public.homepage_sections
  add column if not exists page_key text not null default 'home';

update public.homepage_sections
set page_key = case
  when section_key = 'about-main' then 'about'
  when section_key = 'impact-main' then 'impact'
  else coalesce(page_key, 'home')
end;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.homepage_sections'::regclass
      and conname = 'homepage_sections_page_key_check'
  ) then
    alter table public.homepage_sections
      add constraint homepage_sections_page_key_check
      check (page_key in ('home', 'about', 'impact'));
  end if;
end $$;

update public.homepage_sections
set
  kind = coalesce(kind, 'custom'),
  label = coalesce(label, 'Bagian Website'),
  title = coalesce(title, 'Judul bagian'),
  description = coalesce(description, 'Deskripsi bagian belum diisi.'),
  is_visible = coalesce(is_visible, true),
  sort_order = coalesce(sort_order, 100),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.homepage_sections
  alter column kind set default 'custom',
  alter column kind set not null,
  alter column label set not null,
  alter column title set not null,
  alter column description set not null,
  alter column is_visible set default true,
  alter column is_visible set not null,
  alter column sort_order set default 100,
  alter column sort_order set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.homepage_sections'::regclass
      and conname = 'homepage_sections_kind_check'
  ) then
    alter table public.homepage_sections
      add constraint homepage_sections_kind_check
      check (kind in ('built-in', 'custom'));
  end if;
end $$;

create unique index if not exists homepage_sections_section_key_unique_idx
  on public.homepage_sections (section_key)
  where section_key is not null;

create index if not exists homepage_sections_order_idx
  on public.homepage_sections (is_visible, sort_order, created_at);

create table if not exists public.mbatik_events (
  id uuid primary key default gen_random_uuid(),
  event_date date not null,
  time text not null default '09.00-12.00 WIB',
  location text not null default 'Taman Srigunting, Kota Lama Semarang',
  total_slots integer not null default 20,
  available_slots integer not null default 20,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.mbatik_events
  add column if not exists event_date date,
  add column if not exists time text,
  add column if not exists location text,
  add column if not exists total_slots integer,
  add column if not exists available_slots integer,
  add column if not exists status text,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

update public.mbatik_events
set
  event_date = coalesce(event_date, current_date),
  time = coalesce(time, '09.00-12.00 WIB'),
  location = coalesce(location, 'Taman Srigunting, Kota Lama Semarang'),
  total_slots = coalesce(total_slots, 20),
  available_slots = coalesce(available_slots, 20),
  status = coalesce(status, 'open'),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.mbatik_events
  alter column event_date set not null,
  alter column time set default '09.00-12.00 WIB',
  alter column time set not null,
  alter column location set default 'Taman Srigunting, Kota Lama Semarang',
  alter column location set not null,
  alter column total_slots set default 20,
  alter column total_slots set not null,
  alter column available_slots set default 20,
  alter column available_slots set not null,
  alter column status set default 'open',
  alter column status set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.mbatik_events'::regclass
      and conname = 'mbatik_events_slots_check'
  ) then
    alter table public.mbatik_events
      add constraint mbatik_events_slots_check
      check (total_slots >= 0 and available_slots >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.mbatik_events'::regclass
      and conname = 'mbatik_events_status_check'
  ) then
    alter table public.mbatik_events
      add constraint mbatik_events_status_check
      check (status in ('open', 'full', 'coming-soon'));
  end if;
end $$;

create index if not exists mbatik_events_date_idx
  on public.mbatik_events (event_date, status);

create table if not exists public.mbatik_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.mbatik_events(id) on delete set null,
  event_date date not null,
  event_label text not null,
  name text not null,
  whatsapp text not null,
  email text,
  participants integer not null default 1,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.mbatik_registrations
  add column if not exists event_id uuid references public.mbatik_events(id) on delete set null,
  add column if not exists event_date date,
  add column if not exists event_label text,
  add column if not exists name text,
  add column if not exists whatsapp text,
  add column if not exists email text,
  add column if not exists participants integer,
  add column if not exists notes text,
  add column if not exists created_at timestamptz;

update public.mbatik_registrations
set
  event_date = coalesce(event_date, current_date),
  event_label = coalesce(event_label, 'Mbatik Bareng'),
  name = coalesce(name, 'Peserta'),
  whatsapp = coalesce(whatsapp, '-'),
  email = coalesce(email, ''),
  participants = coalesce(participants, 1),
  created_at = coalesce(created_at, now());

alter table public.mbatik_registrations
  alter column event_date set not null,
  alter column event_label set not null,
  alter column name set not null,
  alter column whatsapp set not null,
  alter column participants set default 1,
  alter column participants set not null,
  alter column created_at set default now(),
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.mbatik_registrations'::regclass
      and conname = 'mbatik_registrations_participants_check'
  ) then
    alter table public.mbatik_registrations
      add constraint mbatik_registrations_participants_check
      check (participants > 0);
  end if;
end $$;

create index if not exists mbatik_registrations_event_date_idx
  on public.mbatik_registrations (event_date desc, created_at desc);

create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  source text,
  slug text,
  name text,
  category text,
  subcategory text,
  motif text,
  building_full text,
  building_story text,
  building_built text,
  price integer,
  price_note text,
  dimensions text,
  material text,
  image_url text,
  image_path text,
  images jsonb,
  image_fit text,
  image_position text,
  image_positions jsonb,
  building_image text,
  building_image_path text,
  shopee_url text,
  is_preorder boolean,
  in_stock boolean,
  is_visible boolean,
  sort_order integer,
  created_at timestamptz,
  updated_at timestamptz
);

alter table public.catalog_products
  add column if not exists source text,
  add column if not exists slug text,
  add column if not exists name text,
  add column if not exists category text,
  add column if not exists subcategory text,
  add column if not exists motif text,
  add column if not exists building_full text,
  add column if not exists building_story text,
  add column if not exists building_built text,
  add column if not exists price integer,
  add column if not exists price_note text,
  add column if not exists dimensions text,
  add column if not exists material text,
  add column if not exists image_url text,
  add column if not exists image_path text,
  add column if not exists images jsonb,
  add column if not exists image_fit text,
  add column if not exists image_position text,
  add column if not exists image_positions jsonb,
  add column if not exists building_image text,
  add column if not exists building_image_path text,
  add column if not exists shopee_url text,
  add column if not exists is_preorder boolean,
  add column if not exists in_stock boolean,
  add column if not exists is_visible boolean,
  add column if not exists sort_order integer,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

update public.catalog_products
set
  source = coalesce(source, 'custom'),
  slug = coalesce(slug, 'produk-' || id::text),
  name = coalesce(name, 'Produk Belanja'),
  category = coalesce(category, 'produk-lain'),
  subcategory = coalesce(subcategory, 'produk'),
  motif = coalesce(motif, name, 'Produk Belanja'),
  building_full = coalesce(building_full, 'Setitik Cultureware'),
  building_story = coalesce(building_story, 'Deskripsi produk belum diisi.'),
  price = coalesce(price, 0),
  dimensions = coalesce(dimensions, '-'),
  material = coalesce(material, '-'),
  image_url = coalesce(image_url, '/images/products/heritage-travel-journal-photo.webp'),
  images = coalesce(images, '[]'::jsonb),
  image_positions = coalesce(image_positions, '[]'::jsonb),
  is_preorder = coalesce(is_preorder, true),
  in_stock = coalesce(in_stock, true),
  is_visible = coalesce(is_visible, true),
  sort_order = coalesce(sort_order, 1000),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.catalog_products
  alter column source set default 'custom',
  alter column source set not null,
  alter column slug set not null,
  alter column name set not null,
  alter column category set not null,
  alter column subcategory set not null,
  alter column motif set not null,
  alter column building_full set not null,
  alter column building_story set not null,
  alter column price set default 0,
  alter column price set not null,
  alter column dimensions set not null,
  alter column material set not null,
  alter column image_url set not null,
  alter column images set default '[]'::jsonb,
  alter column images set not null,
  alter column image_positions set default '[]'::jsonb,
  alter column image_positions set not null,
  alter column is_preorder set default true,
  alter column is_preorder set not null,
  alter column in_stock set default true,
  alter column in_stock set not null,
  alter column is_visible set default true,
  alter column is_visible set not null,
  alter column sort_order set default 1000,
  alter column sort_order set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.catalog_products'::regclass
      and conname = 'catalog_products_source_check'
  ) then
    alter table public.catalog_products
      add constraint catalog_products_source_check
      check (source in ('built-in', 'custom'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.catalog_products'::regclass
      and conname = 'catalog_products_category_check'
  ) then
    alter table public.catalog_products
      add constraint catalog_products_category_check
      check (category in ('batik-tulis', 'batik-cap', 'produk-lain'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.catalog_products'::regclass
      and conname = 'catalog_products_price_check'
  ) then
    alter table public.catalog_products
      add constraint catalog_products_price_check
      check (price >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.catalog_products'::regclass
      and conname = 'catalog_products_slug_key'
  ) then
    alter table public.catalog_products
      add constraint catalog_products_slug_key unique (slug);
  end if;
end $$;

create index if not exists catalog_products_visible_order_idx
  on public.catalog_products (is_visible, sort_order, created_at);

alter table public.site_updates enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.mbatik_events enable row level security;
alter table public.mbatik_registrations enable row level security;
alter table public.catalog_products enable row level security;

drop policy if exists "Published updates are public" on public.site_updates;
create policy "Published updates are public"
  on public.site_updates
  for select
  using (is_published = true);

drop policy if exists "Visible homepage sections are public" on public.homepage_sections;
create policy "Visible homepage sections are public"
  on public.homepage_sections
  for select
  using (is_visible = true);

drop policy if exists "Mbatik events are public" on public.mbatik_events;
create policy "Mbatik events are public"
  on public.mbatik_events
  for select
  using (true);

drop policy if exists "Visible catalog products are public" on public.catalog_products;
create policy "Visible catalog products are public"
  on public.catalog_products
  for select
  using (is_visible = true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-updates',
  'site-updates',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
