import { StaffForm } from "./staff-form";

export default function CadastroFuncionarioPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-8 px-5 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">
          Acesso autorizado
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold">
          Primeiro acesso de funcionário
        </h1>
        <p className="mt-3 text-muted-foreground">
          Use o email incluído na configuração do condomínio e crie sua senha.
        </p>
      </div>
      <StaffForm />
    </div>
  );
}
