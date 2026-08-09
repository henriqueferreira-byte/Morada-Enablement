import Link from "next/link";
import { IconAward, IconCheck, IconClock, IconFlame } from "@tabler/icons-react";
import { Button } from "@/niemeyer/components";
import { requireUser } from "@/lib/auth";
import { formatDuration, formatRelative } from "@/lib/format";
import { getProgressoData } from "@/lib/queries/progresso";
import { KpiTile } from "@/components/progresso/kpi-tile";
import { PageTip } from "@/components/onboarding/page-tip";

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default async function ProgressoPage() {
  const { supabase, user } = await requireUser();
  const { kpis, progressoPorProduto, certificates, streak, nextPendingTrackId } = await getProgressoData(
    supabase,
    user.id,
  );

  const businessDaysDone = streak.weekDays.slice(0, 5).filter(Boolean).length;
  const weekCaption =
    businessDaysDone === 5
      ? "Semana útil completa! Continue assim."
      : businessDaysDone === 4
        ? "Você está a 1 aula de fechar a semana útil completa."
        : `${businessDaysDone} de 5 dias úteis com pelo menos 1 aula.`;

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">Meu progresso</h1>
        <p className="text-sm text-neutral-600">
          Ofensiva de {streak.currentStreak} {streak.currentStreak === 1 ? "dia" : "dias"} · {kpis.aulasConcluidas} de{" "}
          {kpis.aulasConcluidas + kpis.aulasPendentes} aulas concluídas
        </p>
      </div>

      <PageTip
        pageKey="progresso"
        title="Sobre a sua ofensiva"
        description="Ela conta dias úteis seguidos com pelo menos 1 aula concluída. Fim de semana não quebra a sequência — e não precisa estudar nele para mantê-la."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          icon={IconCheck}
          tone="primary"
          label="Aulas concluídas"
          value={kpis.aulasConcluidas}
          delta={kpis.aulasConcluidasDelta > 0 ? `+${kpis.aulasConcluidasDelta} nesta semana` : undefined}
          subtitle={`${kpis.aulasPendentes} aulas pendentes`}
        />
        <KpiTile
          icon={IconAward}
          tone="success"
          label="Trilhas concluídas"
          value={kpis.trilhasConcluidas}
          delta={kpis.trilhasEmAndamento > 0 ? `${kpis.trilhasEmAndamento} em andamento` : undefined}
          subtitle={`De ${kpis.totalTrilhas} trilhas publicadas`}
        />
        <KpiTile
          icon={IconFlame}
          tone="warning"
          label="Ofensiva atual"
          value={kpis.ofensivaAtual}
          delta={streak.completedToday ? "+1 hoje" : undefined}
          subtitle={`Melhor sequência: ${kpis.ofensivaMelhor} dias`}
        />
        <KpiTile
          icon={IconClock}
          tone="info"
          label="Tempo de estudo"
          value={formatDuration(kpis.tempoDeEstudoMin)}
          delta={kpis.tempoDeEstudoDeltaMin > 0 ? `+${formatDuration(kpis.tempoDeEstudoDeltaMin)} nesta semana` : undefined}
          subtitle={`Média por aula: ${kpis.mediaPorAulaMin} min`}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <h2 className="font-heading text-sm font-semibold text-foreground">Progresso por módulo</h2>
          <div className="mt-4 flex flex-col gap-4">
            {progressoPorProduto.map((produto) => (
              <div key={produto.id}>
                <div className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: produto.accent }} aria-hidden />
                  <span className="flex-1 text-sm font-bold text-foreground">{produto.name}</span>
                  <span className="text-xs text-neutral-500">{produto.done}/{produto.total} aulas</span>
                  <span className="w-11 text-right text-[13px] font-bold text-foreground">{produto.pct}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${produto.pct}%`, backgroundColor: produto.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <h2 className="font-heading text-sm font-semibold text-foreground">Certificados</h2>
            {certificates.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Conclua uma trilha inteira para liberar seu primeiro certificado.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {certificates.map((cert) => (
                  <li
                    key={cert.trackId}
                    className="flex items-center gap-3 rounded-lg border border-neutral-150 bg-neutral-50 px-3.5 py-3"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconAward className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-foreground">{cert.trackTitle}</p>
                      <p className="text-xs text-neutral-500">
                        {cert.productName} · concluída {formatRelative(cert.completedAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <h2 className="font-heading text-sm font-semibold text-foreground">Ofensiva da semana</h2>
            <div className="mt-3 flex gap-1.5">
              {streak.weekDays.map((done, i) => {
                const isWeekend = i >= 5;
                return (
                  <div
                    key={i}
                    title={isWeekend ? `${WEEKDAY_LABELS[i]} · não conta na ofensiva` : WEEKDAY_LABELS[i]}
                    className={`flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-bold ${
                      done
                        ? "bg-primary text-primary-foreground"
                        : isWeekend
                          ? "border border-dashed border-neutral-200 text-neutral-300"
                          : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {WEEKDAY_LABELS[i]?.[0]}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-neutral-500">{weekCaption}</p>
            {nextPendingTrackId && (
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href={`/trilhas/${nextPendingTrackId}`}>Fazer a aula de hoje</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
