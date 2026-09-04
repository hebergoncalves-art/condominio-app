import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-8 px-5 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">
          Acesso com senha
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold">
          Entre no condomínio
        </h1>
        <p className="mt-3 text-muted-foreground">
          Use seu email e senha para acessar a área correta.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
