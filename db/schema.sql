-- db/schema.sql
-- Bare-bones placeholder. We'll expand this later.

create extension if not exists "uuid-ossp";

create table if not exists cases (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  location text not null,
  urgency text not null
);
