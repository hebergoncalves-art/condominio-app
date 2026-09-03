import { z } from "zod";
import { categories, statuses } from "./domain";

export const residentSchema = z.object({ name: z.string().trim().min(1, "Informe seu nome completo.").max(120), email: z.string().trim().email("Informe um email válido.").transform((value) => value.toLowerCase()), towerApartment: z.string().trim().min(1, "Informe a torre/apartamento.").max(120), phone: z.string().trim().min(1, "Informe seu telefone.").max(30) });
export const emailSchema = z.object({ email: z.string().trim().email("Informe um email válido.").transform((value) => value.toLowerCase()) });
export const occurrenceSchema = z.object({ title: z.string().trim().min(1, "Informe um título.").max(160), description: z.string().trim().min(1, "Informe uma descrição.").max(5000), category: z.enum(categories), location: z.string().trim().min(1, "Informe o local.").max(160) });
export const occurrenceUpdateSchema = occurrenceSchema.extend({ id: z.string().uuid() });
export const commentSchema = z.object({ occurrenceId: z.string().uuid(), content: z.string().trim().min(1, "O comentário não pode ficar vazio.").max(2000) });
export const commentUpdateSchema = commentSchema.extend({ id: z.string().uuid() });
export const statusSchema = z.object({ id: z.string().uuid(), status: z.enum(statuses) });
export const occurrenceFilterSchema = z.object({ status: z.enum(statuses).optional(), category: z.enum(categories).optional(), page: z.coerce.number().int().min(1).max(10000).default(1) });
export const fileSchema = z.custom<File | null>((value) => value === null || value instanceof File, "Arquivo inválido.").refine((file) => !file || file.size <= 5 * 1024 * 1024, "A foto deve ter no máximo 5 MB.").refine((file) => !file || ["image/jpeg", "image/png"].includes(file.type), "Use uma imagem JPG ou PNG.");
