import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import type { CurrentUser, UserRole } from "./domain";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("id, display_name, role, is_enabled, profile_contacts(email)").eq("id", user.id).maybeSingle();
  if (!profile || !profile.is_enabled) return null;
  const contact = Array.isArray(profile.profile_contacts) ? profile.profile_contacts[0] : profile.profile_contacts;
  return { id: profile.id, displayName: profile.display_name, role: profile.role as UserRole, email: (contact as { email?: string } | null)?.email ?? user.email ?? "" };
}
export async function requireUser(role?: UserRole) { const user = await getCurrentUser(); if (!user || (role && user.role !== role)) redirect("/login"); return user; }
