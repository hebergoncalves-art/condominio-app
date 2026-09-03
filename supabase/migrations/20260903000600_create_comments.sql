create table public.comments (
  id uuid primary key default gen_random_uuid(),
  occurrence_id uuid not null references public.occurrences(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  content text not null check (char_length(content) between 1 and 2000),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
