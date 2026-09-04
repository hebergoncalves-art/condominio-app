import "server-only";
import { Resend } from "resend";
import type { OccurrenceStatus } from "./domain";
import { statusLabels } from "./domain";
export async function sendStatusEmail(email: string, title: string, status: OccurrenceStatus) { if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) throw new Error("EMAIL_NOT_CONFIGURED"); const resend = new Resend(process.env.RESEND_API_KEY); const result = await resend.emails.send({ from: process.env.RESEND_FROM, to: email, subject: `Atualização da ocorrência: ${title}`, text: `A ocorrência "${title}" agora está ${statusLabels[status]}.` }); if (result.error) throw new Error("EMAIL_SEND_FAILED"); }
