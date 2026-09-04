create policy profiles_select_authenticated on public.profiles for select to authenticated
using (is_enabled = true);
create policy contacts_select_self_or_staff on public.profile_contacts for select to authenticated
using (
  profile_id = (select auth.uid()) or exists (
    select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'staff' and p.is_enabled
  )
);

create policy occurrences_select_active on public.occurrences for select to authenticated
using (deleted_at is null);
create policy occurrences_insert_resident on public.occurrences for insert to authenticated
with check (author_id = (select auth.uid()) and status = 'open');
create policy occurrences_update_owner_or_staff on public.occurrences for update to authenticated
using (
  author_id = (select auth.uid()) or exists (
    select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'staff' and p.is_enabled
  )
) with check (author_id = (select auth.uid()) or exists (
  select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'staff' and p.is_enabled
));

create policy photos_select_active on public.occurrence_photos for select to authenticated
using (exists (select 1 from public.occurrences o where o.id = occurrence_id and o.deleted_at is null));
create policy photos_manage_owner_or_staff on public.occurrence_photos for all to authenticated
using (exists (select 1 from public.occurrences o where o.id = occurrence_id and o.deleted_at is null and (o.author_id = (select auth.uid()) or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'staff' and p.is_enabled))))
with check (exists (select 1 from public.occurrences o where o.id = occurrence_id and o.deleted_at is null and (o.author_id = (select auth.uid()) or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'staff' and p.is_enabled))));

create policy comments_select_active on public.comments for select to authenticated
using (deleted_at is null and exists (select 1 from public.occurrences o where o.id = occurrence_id and o.deleted_at is null));
create policy comments_insert_authenticated on public.comments for insert to authenticated
with check (author_id = (select auth.uid()) and exists (select 1 from public.occurrences o where o.id = occurrence_id and o.deleted_at is null));
create policy comments_update_owner_or_staff on public.comments for update to authenticated
using (author_id = (select auth.uid()) or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'staff' and p.is_enabled))
with check (author_id = (select auth.uid()) or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'staff' and p.is_enabled));
