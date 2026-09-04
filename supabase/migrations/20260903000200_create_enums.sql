create type public.user_role as enum ('resident', 'staff');
create type public.occurrence_category as enum (
  'maintenance', 'security', 'cleaning', 'noise', 'lighting',
  'elevator', 'garage', 'common_areas', 'other'
);
create type public.occurrence_status as enum (
  'open', 'under_analysis', 'in_progress', 'resolved', 'cancelled'
);
