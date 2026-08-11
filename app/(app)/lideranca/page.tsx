import { requireLeader } from "@/lib/auth";
import { getUserDirectory } from "@/lib/queries/users";
import { TEAM_LABELS, isValidTeam } from "@/lib/teams";
import { UsersDirectoryTable } from "@/components/gerenciar/users-directory-table";

export default async function LiderancaPage() {
  const { supabase, profile } = await requireLeader();
  const allUsers = await getUserDirectory(supabase);

  const seesAll = profile.role === "admin" || profile.leads_team === "all";
  const users = seesAll ? allUsers : allUsers.filter((user) => user.team === profile.leads_team);
  const scopeLabel = seesAll
    ? "todo o time"
    : profile.leads_team && isValidTeam(profile.leads_team)
      ? TEAM_LABELS[profile.leads_team]
      : "seu time";

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">
          Painel de liderança
        </h1>
        <p className="text-sm text-neutral-600">
          {users.length} {users.length === 1 ? "pessoa" : "pessoas"} em {scopeLabel}: acesso, cargo e trilhas em andamento.
        </p>
      </div>

      <UsersDirectoryTable users={users} />
    </>
  );
}
