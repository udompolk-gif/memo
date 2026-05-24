-- Supabase schema for Memo Generator WebApp localStorage cloud sync
-- Run this once in Supabase SQL Editor before using index.html on GitHub Pages.

create table if not exists public.app_kv_store (
  key text primary key,
  value jsonb,
  updated_at timestamptz not null default now(),
  updated_by text,
  client_id text
);

alter table public.app_kv_store enable row level security;

drop policy if exists "app_kv_store_select_all" on public.app_kv_store;
drop policy if exists "app_kv_store_insert_all" on public.app_kv_store;
drop policy if exists "app_kv_store_update_all" on public.app_kv_store;
drop policy if exists "app_kv_store_delete_all" on public.app_kv_store;

-- Phase 1 testing policy: open read/write using anon key.
-- For production, replace these policies with authenticated/member-based policies.
create policy "app_kv_store_select_all"
on public.app_kv_store
for select
using (true);

create policy "app_kv_store_insert_all"
on public.app_kv_store
for insert
with check (true);

create policy "app_kv_store_update_all"
on public.app_kv_store
for update
using (true)
with check (true);

create policy "app_kv_store_delete_all"
on public.app_kv_store
for delete
using (true);
