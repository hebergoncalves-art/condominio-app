import { requireUser } from "@/lib/auth"; import { AppShell } from "@/components/app-shell";
export default async function StaffLayout({ children }: { children: React.ReactNode }) { const user = await requireUser("staff"); return <AppShell user={user}>{children}</AppShell>; }
