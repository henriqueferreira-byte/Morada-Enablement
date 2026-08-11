import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import { requireAdmin } from "@/lib/auth";
import { getUserDirectory } from "@/lib/queries/users";
import { UsersDirectoryTable } from "@/components/gerenciar/users-directory-table";
import { PageTip } from "@/components/onboarding/page-tip";

export default async function UsuariosPage() {
  const { supabase } = await requireAdmin();
  const { users } = await getUserDirectory(supabase);

  return (
    <>
      <Link
        href="/gerenciar"
        className="flex w-fit items-center gap-1.5 text-[13px] font-bold text-neutral-600 hover:text-primary"
      >
        <IconChevronLeft className="size-4" />
        Gerenciar
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">
          Usuários
        </h1>
        <p className="text-sm text-neutral-600">
          {users.length} {users.length === 1 ? "pessoa cadastrada" : "pessoas cadastradas"} pelo login com Google.
        </p>
      </div>

      <PageTip
        pageKey="gerenciar-usuarios"
        title="Quem já entrou no hub"
        description="Todo mundo que já logou com o Google, com cargo, time, último acesso e as trilhas em que está com progresso — inclusive líderes e admins."
      />

      <UsersDirectoryTable users={users} />
    </>
  );
}
