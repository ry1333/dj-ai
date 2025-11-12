-- Migration 007: Fix All Missing Tables and Fields
-- Fixes build errors by ensuring all referenced tables and columns exist
-- Run this AFTER migrations 004, 005, 006 (or this will handle them if missed)

-- ============================================
-- PART 1: ENSURE COMMENTS TABLE EXISTS
-- ============================================

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS (do nothing if already enabled)
do $$
begin
  alter table public.comments enable row level security;
exception when undefined_table then
  null;
end $$;

-- Drop existing policies if they exist (to avoid duplicates)
drop policy if exists "comments_select_all" on public.comments;
drop policy if exists "comments_insert_authenticated" on public.comments;
drop policy if exists "comments_update_own" on public.comments;
drop policy if exists "comments_delete_own" on public.comments;

-- RLS Policies for comments
create policy "comments_select_all" on public.comments
  for select using (true);

create policy "comments_insert_authenticated" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "comments_update_own" on public.comments
  for update using (auth.uid() = user_id);

create policy "comments_delete_own" on public.comments
  for delete using (auth.uid() = user_id);

-- Create indexes
create index if not exists comments_post_id_idx on public.comments(post_id);
create index if not exists comments_user_id_idx on public.comments(user_id);
create index if not exists comments_created_at_idx on public.comments(created_at desc);

-- ============================================
-- PART 2: ENSURE REPORTS TABLE EXISTS
-- ============================================

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  reason text not null,
  description text,
  status text default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  moderator_id uuid references public.profiles(id),
  moderator_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS (do nothing if already enabled)
do $$
begin
  alter table public.reports enable row level security;
exception when undefined_table then
  null;
end $$;

-- Drop existing policies
drop policy if exists "reports_insert_authenticated" on public.reports;
drop policy if exists "reports_select_own" on public.reports;
drop policy if exists "reports_select_admin" on public.reports;

-- RLS Policies for reports
create policy "reports_insert_authenticated" on public.reports
  for insert with check (auth.uid() = reporter_id);

create policy "reports_select_own" on public.reports
  for select using (auth.uid() = reporter_id);

-- Create indexes
create index if not exists reports_reporter_id_idx on public.reports(reporter_id);
create index if not exists reports_post_id_idx on public.reports(post_id);
create index if not exists reports_comment_id_idx on public.reports(comment_id);
create index if not exists reports_status_idx on public.reports(status);
create index if not exists reports_created_at_idx on public.reports(created_at desc);

-- ============================================
-- PART 3: ENSURE BLOCKED_USERS TABLE EXISTS
-- ============================================

create table if not exists public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  constraint no_self_block check (blocker_id != blocked_id),
  constraint unique_block unique (blocker_id, blocked_id)
);

-- Enable RLS (do nothing if already enabled)
do $$
begin
  alter table public.blocked_users enable row level security;
exception when undefined_table then
  null;
end $$;

-- Drop existing policies
drop policy if exists "blocked_users_select_own" on public.blocked_users;
drop policy if exists "blocked_users_insert_own" on public.blocked_users;
drop policy if exists "blocked_users_delete_own" on public.blocked_users;

-- RLS Policies
create policy "blocked_users_select_own" on public.blocked_users
  for select using (auth.uid() = blocker_id);

create policy "blocked_users_insert_own" on public.blocked_users
  for insert with check (auth.uid() = blocker_id);

create policy "blocked_users_delete_own" on public.blocked_users
  for delete using (auth.uid() = blocker_id);

-- Create indexes
create index if not exists blocked_users_blocker_id_idx on public.blocked_users(blocker_id);
create index if not exists blocked_users_blocked_id_idx on public.blocked_users(blocked_id);

-- ============================================
-- PART 4: ENSURE ADMIN_USERS TABLE EXISTS
-- ============================================

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  role text not null default 'moderator' check (role in ('moderator', 'admin', 'super_admin')),
  is_active boolean default true,
  created_at timestamptz default now(),
  created_by uuid references public.profiles(id)
);

-- Enable RLS (do nothing if already enabled)
do $$
begin
  alter table public.admin_users enable row level security;
exception when undefined_table then
  null;
end $$;

-- Drop existing policies
drop policy if exists "admin_users_select_all" on public.admin_users;

-- RLS Policy - anyone can check if someone is admin
create policy "admin_users_select_all" on public.admin_users
  for select using (true);

-- Create index
create index if not exists admin_users_user_id_idx on public.admin_users(user_id);

-- ============================================
-- PART 5: ADD MISSING POSTS COLUMNS
-- ============================================

-- Add caption column
alter table public.posts
  add column if not exists caption text;

-- Add parent_post_id for remixes
alter table public.posts
  add column if not exists parent_post_id uuid references public.posts(id) on delete set null;

-- Create index for remix lookups
create index if not exists posts_parent_post_id_idx on public.posts(parent_post_id);

-- ============================================
-- PART 6: CREATE UPDATE TRIGGERS
-- ============================================

-- Function for auto-updating updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop existing triggers
drop trigger if exists update_comments_updated_at on public.comments;
drop trigger if exists update_reports_updated_at on public.reports;

-- Create triggers
create trigger update_comments_updated_at
  before update on public.comments
  for each row
  execute function update_updated_at_column();

create trigger update_reports_updated_at
  before update on public.reports
  for each row
  execute function update_updated_at_column();

-- ============================================
-- PART 7: GRANT PERMISSIONS
-- ============================================

grant all on public.comments to authenticated;
grant all on public.comments to service_role;

grant all on public.reports to authenticated;
grant all on public.reports to service_role;

grant all on public.blocked_users to authenticated;
grant all on public.blocked_users to service_role;

grant all on public.admin_users to authenticated;
grant all on public.admin_users to service_role;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these after migration to verify:
/*

-- Check all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('comments', 'reports', 'blocked_users', 'admin_users')
ORDER BY table_name;

-- Check posts has new columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'posts'
AND column_name IN ('caption', 'parent_post_id');

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('comments', 'reports', 'blocked_users', 'admin_users');

*/
