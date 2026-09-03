create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 120),
  role public.user_role not null default 'resident',
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_contacts (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  email text not null,
  tower_apartment text check (tower_apartment is null or char_length(tower_apartment) <= 120),
  phone text check (phone is null or char_length(phone) <= 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profile_contacts_email_lower_idx on public.profile_contacts (lower(email));
