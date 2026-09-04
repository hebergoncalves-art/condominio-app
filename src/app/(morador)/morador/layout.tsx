import { requireUser } from "@/lib/auth"; import { AppShell } from "@/components/app-shell";
export default async function ResidentLayout({ children }: { children: React.ReactNode }) { const user = await requireUser("resident"); return <AppShell user={user}>{children}</AppShell>; }
