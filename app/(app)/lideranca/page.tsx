import { requireLeader } from "@/lib/auth";
import { getUserDirectory } from "@/lib/queries/users";
import { TEAM_LABELS, isValidTeam } from "@/lib/teams";
import { UsersDirectoryTable } from "@/components/gerenciar/users-directory-table";
import { TeamInsights } from "@/components/lideranca/team-insights";
import { PageTip } from "@/components/onboarding/page-tip";

export default async function LiderancaPage() {
  const { supabase, profile } = await requireLeader();
  const { users: allUsers, tracks } = await getUserDirectory(supabase);

  // leads_team can be 'all', a single team, or a comma-separated list of
  // teams (e.g. 'onboarding,suporte' — someone who leads more than one).
  const ledTeams = profile.leads_team?.split(",").filter(Boolean) ?? [];
  const seesAll = profile.role === "admin" || profile.leads_team === "all";
  const users = seesAll ? allUsers : allUsers.filter((user) => !!user.team && ledTeams.includes(user.team));
  const scopeLabel = seesAll
    ? "todo o time"
    : ledTeams.length > 0
      ? ledTeams
          .map((team) => (isValidTeam(team) ? TEAM_LABELS[team] : team))
          .join(" e ")
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

      <PageTip
        pageKey="lideranca"
        title="O que você vê aqui"
        description="Um raio-x do seu time: quem já engajou, quem ainda não começou e trilhas obrigatórias pendentes. Os cards no topo resumem, a tabela abaixo traz o detalhe de cada pessoa."
      />

      <TeamInsights users={users} tracks={tracks} />

      <UsersDirectoryTable users={users} />
    </>
  );
}
