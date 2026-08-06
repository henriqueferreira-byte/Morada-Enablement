import Image from "next/image";
import { IconInfoCircle } from "@tabler/icons-react";
import { Alert, AlertDescription } from "@/niemeyer/components";
import { GoogleLoginButton } from "./google-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: "radial-gradient(at top, #0073ff, #001f3d)" }}
    >
      <div className="flex w-full max-w-[420px] flex-col items-center gap-6">
        <Image
          src="/logos/logo-white.svg"
          alt="Morada.ai"
          width={140}
          height={26}
          style={{ height: "auto" }}
          priority
        />

        <div className="w-full rounded-2xl bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,20,60,0.45)]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hub de enablement
              </span>
              <h1 className="text-2xl font-semibold text-foreground">Entrar</h1>
              <p className="text-sm text-muted-foreground">
                Use sua conta Google da Morada para acessar as trilhas, os materiais e o seu progresso.
              </p>
            </div>

            {erro === "dominio" && (
              <Alert variant="destructive">
                <AlertDescription>
                  Use sua conta @morada.ai. Contas pessoais não têm acesso ao hub.
                </AlertDescription>
              </Alert>
            )}

            <GoogleLoginButton />

            <div className="flex items-start gap-2 rounded-lg border border-neutral-150 bg-neutral-50 px-3.5 py-3">
              <IconInfoCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Acesso restrito a contas <strong>@morada.ai</strong>. Contas pessoais são recusadas no login. Precisa de acesso? Fale com o time de enablement.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/72">Morada.ai · uso interno</p>
      </div>
    </main>
  );
}
