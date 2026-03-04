-- Premium Personalized Fortune — User Learning System
-- Run this migration in Supabase SQL Editor

-- User profiles
create table public.profiles (
  id uuid references auth.users primary key,
  display_name text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'premium')),
  subscription_expires_at timestamptz,
  active_tracks text[] default '{}',
  created_at timestamptz default now()
);

-- Chart data (server-side, cross-device)
create table public.user_charts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles not null,
  track text not null check (track in ('saju', 'astro')),
  chart_data jsonb not null,
  birth_info jsonb not null,
  created_at timestamptz default now(),
  unique(user_id, track)
);

-- User context: accumulated life stories, concerns, events
create table public.user_context (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles not null,
  content text not null check (char_length(content) <= 1000),
  context_type text not null check (context_type in ('onboarding', 'daily_check_in', 'life_event', 'concern')),
  topic text,
  created_at timestamptz default now()
);

-- Generated fortune cache (one per category per day)
create table public.daily_fortunes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles not null,
  track text not null check (track in ('saju', 'astro')),
  fortune_date date not null,
  category text not null,
  content jsonb not null,
  context_snapshot text[],
  created_at timestamptz default now(),
  unique(user_id, track, fortune_date, category)
);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.user_charts enable row level security;
alter table public.user_context enable row level security;
alter table public.daily_fortunes enable row level security;

-- Profiles: users can read/insert their own, but cannot modify subscription fields
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id) with check (
  -- Prevent users from self-upgrading subscription via client
  subscription_tier = (select subscription_tier from public.profiles where id = auth.uid())
  and subscription_expires_at is not distinct from (select subscription_expires_at from public.profiles where id = auth.uid())
);

-- Charts: users can read/insert/update their own, no delete
create policy "charts_select" on public.user_charts for select using (auth.uid() = user_id);
create policy "charts_insert" on public.user_charts for insert with check (auth.uid() = user_id);
create policy "charts_update" on public.user_charts for update using (auth.uid() = user_id);

-- Context: users can read/insert their own, no update/delete
create policy "context_select" on public.user_context for select using (auth.uid() = user_id);
create policy "context_insert" on public.user_context for insert with check (auth.uid() = user_id);

-- Fortunes: users can read their own only (insert managed by server)
create policy "fortunes_select" on public.daily_fortunes for select using (auth.uid() = user_id);
create policy "fortunes_insert" on public.daily_fortunes for insert with check (auth.uid() = user_id);

-- Indexes for common queries
create index idx_user_charts_user_track on public.user_charts(user_id, track);
create index idx_user_context_user on public.user_context(user_id, created_at desc);
create index idx_daily_fortunes_lookup on public.daily_fortunes(user_id, track, fortune_date, category);
