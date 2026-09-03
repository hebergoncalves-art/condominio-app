create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger profile_contacts_updated_at before update on public.profile_contacts
for each row execute function public.set_updated_at();
create trigger occurrences_updated_at before update on public.occurrences
for each row execute function public.set_updated_at();
create trigger occurrence_photos_updated_at before update on public.occurrence_photos
for each row execute function public.set_updated_at();
create trigger comments_updated_at before update on public.comments
for each row execute function public.set_updated_at();

create index occurrences_status_active_idx on public.occurrences(status) where deleted_at is null;
create index occurrences_category_active_idx on public.occurrences(category) where deleted_at is null;
create index occurrences_created_at_active_idx on public.occurrences(created_at desc) where deleted_at is null;
create index occurrences_updated_at_active_idx on public.occurrences(updated_at desc) where deleted_at is null;
create index occurrences_author_active_idx on public.occurrences(author_id) where deleted_at is null;
create index comments_occurrence_created_idx on public.comments(occurrence_id, created_at asc) where deleted_at is null;
