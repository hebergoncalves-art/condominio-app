import { ResidentForm } from "./resident-form";

export default function CadastroPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-8 px-5 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">
          Primeiro acesso
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold">
          Cadastre-se no condomínio
        </h1>
        <p className="mt-3 text-muted-foreground">
          Crie uma senha para acessar o sistema.
        </p>
      </div>
      <ResidentForm />
    </div>
  );
}
