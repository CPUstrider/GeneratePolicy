create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  unique(user_id)
);

create table if not exists generated_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  company_name text not null,
  jurisdiction text not null, -- "EU", "US", "EU+US"
  industry text,
  inputs jsonb not null,
  output jsonb not null, -- stores doc sections text, risk matrix rows, etc
  created_at timestamptz default now()
);

alter table generated_packs enable row level security;
create policy "own packs" on generated_packs
for select using (auth.uid() = user_id);
create policy "insert own packs" on generated_packs
for insert with check (auth.uid() = user_id);

alter table subscriptions enable row level security;
create policy "own sub" on subscriptions
for select using (auth.uid() = user_id);
