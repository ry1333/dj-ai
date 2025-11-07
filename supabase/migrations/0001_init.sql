-- posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  audio_url text not null,
  bpm int,
  key text,
  style text,
  parent_post_id uuid references posts(id) on delete set null,
  challenge_id uuid,
  created_at timestamptz default now()
);
-- reactions
create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid not null,
  type text check (type in ('love','comment','save','share')),
  created_at timestamptz default now()
);
create unique index if not exists uniq_reaction on reactions (post_id, user_id, type);
create index if not exists posts_created_at_desc on posts (created_at desc);
create index if not exists reactions_post_id on reactions (post_id);

-- RLS
alter table posts enable row level security;
alter table reactions enable row level security;

-- anyone can read posts
create policy if not exists "read posts" on posts for select using (true);
-- only owner can modify own posts
create policy if not exists "insert own post" on posts for insert with check (auth.uid() = user_id);
create policy if not exists "update own post" on posts for update using (auth.uid() = user_id);
create policy if not exists "delete own post" on posts for delete using (auth.uid() = user_id);

-- reactions RLS
create policy if not exists "read reactions" on reactions for select using (true);
create policy if not exists "insert own reaction" on reactions for insert with check (auth.uid() = user_id);
create policy if not exists "delete own reaction" on reactions for delete using (auth.uid() = user_id);
