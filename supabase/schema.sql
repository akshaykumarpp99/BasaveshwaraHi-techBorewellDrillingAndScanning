-- Run in the Supabase SQL editor.
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email text check (email is null or char_length(email) <= 120),
  location text not null check (char_length(location) between 2 and 120),
  service text not null,
  expected_depth_ft integer check (expected_depth_ft is null or expected_depth_ft between 1 and 2000),
  message text check (message is null or char_length(message) <= 1000),
  status text not null default 'new'
);

alter table public.enquiries enable row level security;

-- The public site may only INSERT. Nobody can read enquiries with the anon key;
-- view them in the Supabase dashboard (or with the service role on a server).
drop policy if exists "anon can insert enquiries" on public.enquiries;
create policy "anon can insert enquiries" on public.enquiries
  for insert to anon with check (true);
