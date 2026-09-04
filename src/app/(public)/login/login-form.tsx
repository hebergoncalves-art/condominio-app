"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "../_actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entre na sua conta</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
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
          {state && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Entrando…" : "Entrar"}
          </Button>
          <Link
            href="/cadastro"
            className="text-center text-sm text-muted-foreground underline"
          >
            Ainda não tenho cadastro
          </Link>
          <Link
            href="/cadastro-funcionario"
            className="text-center text-sm text-muted-foreground underline"
          >
            Primeiro acesso de funcionário
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
