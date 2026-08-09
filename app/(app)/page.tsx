import Link from "next/link";
import { IconFileText } from "@tabler/icons-react";
import { Button } from "@/niemeyer/components";
import { requireUser } from "@/lib/auth";
import { getHomeData, greetingForHour } from "@/lib/queries/home";
import { formatRelative } from "@/lib/format";
import { ContinueTrackCard } from "@/components/tracks/continue-track-card";
import { RequestContentCard } from "@/components/home/request-content-card";
import { NovidadeCard } from "@/components/home/novidade-card";

export default async function HomePage() {
  const { supabase, user, profile } = await requireUser();
  const nowSaoPaulo = Number(
    new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: "America/Sao_Paulo" }).format(
      new Date(),
    ),
  );

  const data = await getHomeData(supabase, user.id, profile.team);
  const firstName = profile.full_name?.split(" ")[0] ?? profile.email.split("@")[0];
  const firstContinueHref = data.continueTracks[0]
    ? `/trilhas/${data.continueTracks[0].track.id}`
    : "/trilhas";

  return (
    <>
      <section
        className="relative overflow-hidden rounded-2xl p-8 text-white"
        style={{ background: "linear-gradient(135deg,#00224d 0%,#0058c4 45%,#0aa6f0 100%)" }}
      >
        <div
          aria-hidden
          className="absolute -right-20 -top-40 size-[420px] rounded-full blur-[20px]"
          style={{ background: "radial-gradient(circle, rgba(0,255,224,.32), transparent 62%)" }}
        />
        <div className="relative grid gap-8 md:grid-cols-[1.25fr_1fr]">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/75">
              Hub de enablement · Morada
            </span>
            <h1 className="font-heading text-[40px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
              {greetingForHour(nowSaoPaulo)}, {firstName}
            </h1>
            <p className="max-w-[52ch] text-base text-white/82">
              Tudo o que subiu de novo em Morada Vendas e Morada Relacionamento fica aqui.{" "}
              {data.pendingLessonsInStarted > 0
                ? `Você tem ${data.pendingLessonsInStarted} ${data.pendingLessonsInStarted === 1 ? "aula pendente" : "aulas pendentes"} nas trilhas que já começou.`
                : "Comece uma trilha para acompanhar as novidades do produto."}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={firstContinueHref}>Continuar de onde parei</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                <Link href="/trilhas">Ver todas as trilhas</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/40 bg-white/82 p-5 shadow-[0_8px_30px_rgba(15,30,80,0.18)] backdrop-blur-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Sua semana</span>
            <dl className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <dt className="font-heading text-[28px] font-semibold text-foreground">{data.weekSummary.aulasConcluidas}</dt>
                <dd className="text-xs text-neutral-500">aulas concluídas</dd>
              </div>
              <div>
                <dt className="font-heading text-[28px] font-semibold text-foreground">{data.weekSummary.trilhasEmAndamento}</dt>
                <dd className="text-xs text-neutral-500">trilhas em andamento</dd>
              </div>
              <div>
                <dt className="font-heading text-[28px] font-semibold text-foreground">{data.weekSummary.conteudosNovos}</dt>
                <dd className="text-xs text-neutral-500">conteúdos novos</dd>
              </div>
              <div>
                <dt className="font-heading text-[28px] font-semibold text-foreground">{data.weekSummary.certificados}</dt>
                <dd className="text-xs text-neutral-500">certificados</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {data.continueTracks.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Continue de onde parou
            </h2>
            <Link href="/trilhas" className="text-[13px] font-bold text-primary hover:underline">
              Ver tudo
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.continueTracks.map(({ track, progress }) => (
              <ContinueTrackCard key={track.id} track={track} progress={progress} />
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">Novidades no hub</h2>
        {data.novidades.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-8 text-center text-sm text-muted-foreground">
            Nada de novo nos últimos 30 dias.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.novidades.map((item) => (
              <NovidadeCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {data.recommendedTracks.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">
              Recomendado para {profile.team ? "seu time" : "você"}
            </span>
            {data.recommendedTracks.map(({ track, progress }) => (
              <Link
                key={track.id}
                href={`/trilhas/${track.id}`}
                className="rounded-xl border border-border bg-card px-[18px] py-4 shadow-xs outline-none hover:border-neutral-300 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                  {track.product.name}
                </span>
                <p className="mt-1 font-heading text-[15px] font-semibold text-foreground">{track.title}</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {progress.total} aulas · {progress.durationMin} min
                </p>
              </Link>
            ))}
          </div>
        )}

        {data.recentMaterials.length > 0 && (
          <div className="rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between border-b border-border px-[18px] py-3">
              <span className="font-heading text-sm font-semibold text-foreground">Materiais recentes</span>
              <Link href="/materiais" className="text-xs font-bold text-primary hover:underline">
                Biblioteca
              </Link>
            </div>
            <ul>
              {data.recentMaterials.map((material) => (
                <li key={material.id}>
                  <Link
                    href={`/materiais/${material.feature.product.id}/${material.feature.id}`}
                    className="flex items-center gap-3 px-[18px] py-3 outline-none hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                      <IconFileText className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[13px] font-bold text-foreground">{material.title}</span>
                        <span className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                          NOVO
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-neutral-500">
                        {material.feature.product.name} · {material.feature.name} · {formatRelative(material.updated_at)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <RequestContentCard
          userName={profile.full_name ?? profile.email}
          userEmail={profile.email}
        />
      </section>
    </>
  );
}
