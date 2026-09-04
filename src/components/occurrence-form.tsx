"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { occurrenceSchema } from "@/lib/validations";
import { categories, categoryLabels } from "@/lib/domain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { z } from "zod";

type Values = z.infer<typeof occurrenceSchema>;
type Action = (
  data: FormData
) => Promise<{ message?: string; success: boolean }>;

export function OccurrenceForm({
  action,
  initial,
  id,
}: {
  action: Action;
  initial?: Partial<Values>;
  id?: string;
}) {
  const [message, setMessage] = useState<string>();
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(occurrenceSchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      category: initial?.category ?? "maintenance",
      location: initial?.location ?? "",
    },
  });

  const submit = async (values: Values) => {
    setMessage(undefined);
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      data.set(key, String(value))
    );
    if (id) data.set("id", id);
    const photo = (document.getElementById("photo") as HTMLInputElement | null)
      ?.files?.[0];
    if (photo) data.set("photo", photo);
    const remove = (
      document.getElementById("removePhoto") as HTMLInputElement | null
    )?.checked;
    if (remove) data.set("removePhoto", "on");

    try {
      const result = await action(data);
      setMessage(
        result.message ??
          (result.success
            ? "Operação concluída."
            : "Não foi possível concluir a operação.")
      );
      if (result.success) {
        form.reset(values);
        router.refresh();
        if (!id) router.push("/morador/ocorrencias?created=1");
      }
    } catch {
      setMessage(
        "Não foi possível salvar a ocorrência. Verifique sua conexão e tente novamente."
      );
    }
  };

  const invalid = () =>
    setMessage("Preencha corretamente os campos obrigatórios antes de salvar.");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da ocorrência</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={form.handleSubmit(submit, invalid)}
          className="flex flex-col gap-5"
        >
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...form.register("title")} className="mt-2" />
            {form.formState.errors.title && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              className="mt-2 min-h-32"
            />
            {form.formState.errors.description && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="category">Categoria</Label>
            <select
              id="category"
              {...form.register("category")}
              className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
            {form.formState.errors.category && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              {...form.register("location")}
              placeholder="Ex.: Torre A, área da piscina"
              className="mt-2"
            />
            {form.formState.errors.location && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.location.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="photo">Foto (opcional, JPG/PNG até 5 MB)</Label>
            <Input
              id="photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png"
              className="mt-2"
            />
            {id && (
              <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <input id="removePhoto" type="checkbox" /> Remover foto atual
              </label>
            )}
          </div>
          {message && (
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {message}
            </p>
          )}
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting
              ? "Salvando…"
              : id
                ? "Salvar alterações"
                : "Salvar ocorrência"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
