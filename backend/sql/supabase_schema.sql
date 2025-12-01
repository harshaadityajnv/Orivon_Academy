-- Run this in Supabase SQL editor
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  google_id text unique,
  role text default 'user', -- 'user' or 'admin'
  created_at timestamptz default now()
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration_minutes int,
  price_numeric numeric(10,2) default 0,
  active boolean default true,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists exam_questions (
  id uuid primary key default gen_random_uuid(),
  certification_id uuid references certifications(id) on delete cascade,
  question text not null,
  options jsonb,
  correct_option text,
  marks int default 1,
  created_at timestamptz default now()
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  certification_id uuid references certifications(id),
  amount numeric(10,2),
  currency text default 'INR',
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  status text default 'created',
  created_at timestamptz default now()
);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  certification_id uuid references certifications(id),
  started_at timestamptz,
  ended_at timestamptz,
  status text default 'started',
  score numeric,
  review_notes text,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists proctor_events (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references attempts(id) on delete cascade,
  event_type text,
  metadata jsonb,
  created_at timestamptz default now()
);
