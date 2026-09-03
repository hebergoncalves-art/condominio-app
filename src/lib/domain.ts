export const categories = ["maintenance", "security", "cleaning", "noise", "lighting", "elevator", "garage", "common_areas", "other"] as const;
export type OccurrenceCategory = (typeof categories)[number];
export const statuses = ["open", "under_analysis", "in_progress", "resolved", "cancelled"] as const;
export type OccurrenceStatus = (typeof statuses)[number];
export type UserRole = "resident" | "staff";

export const categoryLabels: Record<OccurrenceCategory, string> = {
  maintenance: "Manutenção", security: "Segurança", cleaning: "Limpeza", noise: "Barulho", lighting: "Iluminação", elevator: "Elevador", garage: "Garagem", common_areas: "Áreas comuns", other: "Outros",
};
export const statusLabels: Record<OccurrenceStatus, string> = { open: "Aberta", under_analysis: "Em análise", in_progress: "Em andamento", resolved: "Resolvida", cancelled: "Cancelada" };
export const statusStyles: Record<OccurrenceStatus, string> = { open: "bg-amber-100 text-amber-900", under_analysis: "bg-amber-100 text-amber-900", in_progress: "bg-blue-100 text-blue-900", resolved: "bg-emerald-100 text-emerald-900", cancelled: "bg-red-100 text-red-900" };

export type ActionResult<T = undefined> = { success: true; data?: T; message?: string; warning?: string } | { success: false; message: string; fieldErrors?: Record<string, string[]> };
export type CurrentUser = { id: string; displayName: string; role: UserRole; email: string };
export type Occurrence = { id: string; title: string; description: string; category: OccurrenceCategory; location: string; status: OccurrenceStatus; authorId: string; authorName: string; photoPath: string | null; photoUrl: string | null; createdAt: string; updatedAt: string; statusChangedAt: string };
export type Comment = { id: string; occurrenceId: string; authorId: string; authorName: string; content: string; createdAt: string; updatedAt: string };
