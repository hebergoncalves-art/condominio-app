# Supabase

As migrações SQL ficam exclusivamente em `supabase/migrations` e devem ser aplicadas em ordem lexicográfica.

```bash
supabase start
supabase db reset
```

O bucket `occurrence-photos` é privado. O provisionamento de funcionários usa `INITIAL_STAFF_EMAILS`; não há seed SQL de usuários.
