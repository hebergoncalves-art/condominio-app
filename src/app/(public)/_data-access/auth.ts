import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export async function findContactByEmail(email: string) {
  const { data, error } = await createAdminClient()
    .from("profile_contacts")
    .select("profile_id, profiles!inner(is_enabled, role)")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createAuthUser(email: string, password: string) {
  const { data, error } = await createAdminClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) throw new Error("AUTH_CREATE_FAILED");
  return data.user.id;
}

export async function deleteAuthUser(id: string) {
  await createAdminClient().auth.admin.deleteUser(id);
}

export async function insertProfile(
  id: string,
  displayName: string,
  role: "resident" | "staff"
) {
  const { error } = await createAdminClient()
    .from("profiles")
    .insert({ id, display_name: displayName, role });
  if (error) throw error;
}

export async function insertContact(
  profileId: string,
  email: string,
  towerApartment?: string,
  phone?: string
) {
  const { error } = await createAdminClient()
    .from("profile_contacts")
    .insert({
      profile_id: profileId,
      email,
      tower_apartment: towerApartment ?? null,
      phone: phone ?? null,
    });
  if (error) throw error;
}
