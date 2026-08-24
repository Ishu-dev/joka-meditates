create extension if not exists "pgcrypto";

create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  number int,
  title text not null,
  subtitle text,
  published_at timestamptz,
  content jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists budget_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  amount numeric not null,
  category text,
  added_at timestamptz not null default now()
);

alter table issues enable row level security;
alter table budget_items enable row level security;

create policy "public read published issues"
  on issues for select
  using (published_at is not null);

create policy "organizers write issues"
  on issues for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "organizers write budget"
  on budget_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
