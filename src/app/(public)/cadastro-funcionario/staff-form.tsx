"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerStaffAction } from "../_actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StaffForm() {
  const [state, action, pending] = useActionState(
    registerStaffAction,
    undefined
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Defina sua senha</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email">Email profissional</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="passwordConfirmation">Confirme sua senha</Label>
            <Input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              required
              minLength={8}
              className="mt-2"
            />
          </div>
          {state && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
          {state?.success && (
            <p className="text-sm text-emerald-700">{state.message}</p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Salvando…" : "Criar acesso"}
          </Button>
          <Link
            href="/login"
            className="text-center text-sm text-muted-foreground underline"
          >
            Voltar para o login
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
