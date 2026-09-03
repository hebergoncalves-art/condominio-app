create table public.occurrence_photos (
  id uuid primary key default gen_random_uuid(),
  occurrence_id uuid not null unique references public.occurrences(id) on delete cascade,
  storage_path text not null unique,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png')),
  size_bytes integer not null check (size_bytes between 1 and 5242880),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
