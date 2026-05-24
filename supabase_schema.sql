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


-- Refresh REST schema cache
notify pgrst, 'reload schema';


-- Default keys for WebApp sync
insert into public.app_kv_store (key, value)
values
  ('pro_memos', '[]'::jsonb),
  ('memo_people', '[]'::jsonb),
  ('memo_settings', '{}'::jsonb),
  ('memo_list_columns', '{}'::jsonb),
  ('memo_auth_users_v1', '[]'::jsonb),
  ('memo_auto_backup_settings_v1', '{}'::jsonb),
  ('memo_auto_backup_latest_v1', '{}'::jsonb)
on conflict (key) do nothing;

notify pgrst, 'reload schema';
