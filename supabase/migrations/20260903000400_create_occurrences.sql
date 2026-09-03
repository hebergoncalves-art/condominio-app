create table public.occurrences (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 1 and 160),
  description text not null check (char_length(description) between 1 and 5000),
  category public.occurrence_category not null,
  location text not null check (char_length(location) between 1 and 160),
  status public.occurrence_status not null default 'open',
  status_changed_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
