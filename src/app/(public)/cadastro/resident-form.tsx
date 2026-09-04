"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerResidentAction } from "../_actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResidentForm() {
  const [state, action, pending] = useActionState(
    registerResidentAction,
    undefined
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do morador</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" name="name" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
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
          <div>
            <Label htmlFor="towerApartment">Torre/apartamento</Label>
            <Input
              id="towerApartment"
              name="towerApartment"
              required
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" name="phone" required className="mt-2" />
          </div>
          {state && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
          {state?.success && (
            <p className="text-sm text-emerald-700">{state.message}</p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Salvando…" : "Criar cadastro"}
          </Button>
          <Link
            href="/login"
            className="text-center text-sm text-muted-foreground underline"
          >
            Já tenho cadastro
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
