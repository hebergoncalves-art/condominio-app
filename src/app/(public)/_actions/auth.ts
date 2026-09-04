"use server";

import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/domain";
import {
  loginSchema,
  residentSchema,
  staffRegistrationSchema,
} from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";
import {
  loginWithPassword,
  registerResident,
  registerStaff,
} from "../_services/auth-service";

export async function registerResidentAction(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const parsed = residentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      success: false,
      message: "Revise os dados informados.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  try {
    await registerResident(
      parsed.data as Parameters<typeof registerResident>[0]
    );
    return {
      success: true,
      message: "Cadastro concluído. Agora entre com seu email e senha.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error && error.message === "DUPLICATE"
          ? "Este email já possui cadastro. Entre com sua senha."
          : "Não foi possível concluir o cadastro.",
    };
  }
}

export async function registerStaffAction(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const parsed = staffRegistrationSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!parsed.success)
    return {
      success: false,
      message: "Revise os dados informados.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  try {
    await registerStaff(parsed.data as Parameters<typeof registerStaff>[0]);
    return {
      success: true,
      message: "Acesso de funcionário criado. Agora entre com email e senha.",
    };
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    return {
      success: false,
      message:
        code === "NOT_ALLOWED"
          ? "Este email não está autorizado para acesso de funcionário."
          : code === "DUPLICATE"
            ? "Este email já possui cadastro. Entre com sua senha."
            : "Não foi possível concluir o primeiro acesso.",
    };
  }
}

export async function loginAction(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      success: false,
      message: "Informe um email e uma senha válidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  let role: "resident" | "staff";
  try {
    role = await loginWithPassword(
      parsed.data as Parameters<typeof loginWithPassword>[0]
    );
  } catch (error) {
    if (error instanceof Error && error.message === "DISABLED")
      return { success: false, message: "Este acesso está desabilitado." };
    return { success: false, message: "Email ou senha inválidos." };
  }
  redirect(role === "staff" ? "/admin" : "/morador/ocorrencias");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
