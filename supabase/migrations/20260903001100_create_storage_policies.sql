create policy occurrence_photos_select on storage.objects for select to authenticated
using (
  bucket_id = 'occurrence-photos' and exists (
    select 1 from public.occurrences o
    where o.id::text = (storage.foldername(name))[2] and o.deleted_at is null
  )
);

create policy occurrence_photos_insert on storage.objects for insert to authenticated
with check (
  bucket_id = 'occurrence-photos' and exists (
    select 1 from public.occurrences o
    where o.id::text = (storage.foldername(name))[2] and o.deleted_at is null
      and (o.author_id = (select auth.uid()) or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'staff' and p.is_enabled))
  )
);

create policy occurrence_photos_delete on storage.objects for delete to authenticated
using (bucket_id = 'occurrence-photos' and owner_id = (select auth.uid())::text);
