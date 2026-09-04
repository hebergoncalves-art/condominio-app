import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  createAuthUser,
  deleteAuthUser,
  findContactByEmail,
  insertContact,
  insertProfile,
} from "../_data-access/auth";

function initialStaffEmails() {
  return (process.env.INITIAL_STAFF_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function getProfile(contact: Awaited<ReturnType<typeof findContactByEmail>>) {
  return contact?.profiles as unknown as {
    is_enabled: boolean;
    role: "resident" | "staff";
  } | null;
}

export async function registerResident(input: {
  name: string;
  email: string;
  password: string;
  towerApartment: string;
  phone: string;
}) {
  if (await findContactByEmail(input.email)) throw new Error("DUPLICATE");
  const id = await createAuthUser(input.email, input.password);
  try {
    await insertProfile(id, input.name, "resident");
    await insertContact(id, input.email, input.towerApartment, input.phone);
  } catch (error) {
    await deleteAuthUser(id);
    throw error;
  }
}

export async function registerStaff(input: {
  email: string;
  password: string;
}) {
  if (!initialStaffEmails().includes(input.email))
    throw new Error("NOT_ALLOWED");
  if (await findContactByEmail(input.email)) throw new Error("DUPLICATE");
  const id = await createAuthUser(input.email, input.password);
  const name = input.email.split("@")[0].replace(/[._-]+/g, " ");
  try {
    await insertProfile(id, name, "staff");
    await insertContact(id, input.email);
  } catch (error) {
    await deleteAuthUser(id);
    throw error;
  }
}

export async function loginWithPassword(input: {
  email: string;
  password: string;
}) {
  const contact = await findContactByEmail(input.email);
  const profile = getProfile(contact);
  if (!contact || !profile) throw new Error("NOT_FOUND");
  if (!profile.is_enabled) throw new Error("DISABLED");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(input);
  if (error) throw new Error("INVALID_CREDENTIALS");
  return profile.role;
}
