/* HomePage — the signature time-aware landing surface.
 * Composes: time-of-day sky → greeting + HeroChat → KPI grid → Hi/Lo cards
 * → Anúncios (left) + Notificações (right).
 *
 * Phase is derived from the current hour; the demo's phase bar overrides it
 * so reviewers can preview every sky.
 */

const PHASES = ["dawn", "morning", "midday", "sunset", "dusk", "night"];

function phaseFromHour(h) {
  if (h < 5)  return "night";
  if (h < 7)  return "dawn";
  if (h < 12) return "morning";
  if (h < 16) return "midday";
  if (h < 19) return "sunset";
  if (h < 21) return "dusk";
  return "night";
}

function greetingFor(h) {
  if (h < 5)  return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const isDarkPhase = (p) => p === "dusk" || p === "night";

const kpis = [
  { label: "Conversas em andamento", value: "47", deltaDir: "up",   deltaValue: "+12%", deltaLabel: "vs. ontem",      subtitle: "8 atribuídas a você",   tone: "primary", Icon: IconMessageCircle },
  { label: "Aguardando atendimento", value: "12", deltaDir: "down", deltaValue: "-4",   deltaLabel: "última hora",    subtitle: "Tempo médio: 3m 12s",   tone: "warning", Icon: IconClock },
  { label: "Filas ativas",           value: "5",  deltaDir: "up",   deltaValue: "+1",   deltaLabel: "fila online",    subtitle: "DEMO MG mais cheia",    tone: "info",    Icon: IconUsers },
  { label: "Atendentes online",      value: "18", deltaDir: "up",   deltaValue: "92%",  deltaLabel: "disponibilidade",subtitle: "3 em pausa",            tone: "success", Icon: IconHeadset },
];

const highlights = [
  { title: "Conversões em alta",        detail: "Campanha “Lançamento Vista Sul” converteu 22% acima da meta.", icon: IconTrendingUp },
  { title: "MIA economizou 4h de tempo",detail: "Foram 86 respostas sugeridas aceitas pelos atendentes hoje.",   icon: IconBolt },
];
const lowlights = [
  { title: "SLA estourou em 3 conversas", detail: "Fila “Suporte Geral” acumulou +5min de espera no horário de pico.", icon: IconTrendingDown },
  { title: "Lead frio há 72h",            detail: "Negócio “Ana Vidal — Reserva Park” sem follow-up.",                   icon: IconClock },
];
const announcements = [
  { tag: "Novidade",     title: "MIA agora resume conversas longas",        detail: "Em qualquer conversa, peça à MIA um resumo dos últimos pontos e próximos passos.", time: "há 2h",   accent: ["#02cfff", "#0073ff"], Icon: IconMegaphone },
  { tag: "Evento",       title: "Live: filas de alta performance",          detail: "Terça, 14h — pelo Morada Studio, com Q&A ao vivo.",                                  time: "amanhã",  accent: ["#00ffe0", "#02cfff"], Icon: IconCalendarEvent },
  { tag: "Atualização",  title: "Novo painel de campanhas no Marketing",    detail: "Análise consolidada por origem, criativo e estágio do funil.",                       time: "há 1 dia",accent: ["#f7b87d", "#fad499"], Icon: IconBolt },
];
const notifications = [
  { title: "Suzane mencionou você na conversa #2284",  time: "agora",  unread: true },
  { title: "3 leads novos atribuídos à fila DEMO MG",   time: "12 min", unread: true },
  { title: "Campanha “Vista Sul” concluiu envio",       time: "1h",     unread: true },
  { title: "Relatório semanal disponível",              time: "3h",     unread: false },
];

function HomePage() {
  const [phase, setPhase] = React.useState(() => phaseFromHour(new Date().getHours()));
  const [draft, setDraft] = React.useState("");
  const greeting = greetingFor(new Date().getHours());
  const dark = isDarkPhase(phase);

  return (
    <div className={`mp-home ${dark ? "is-dark" : ""}`}>
      <div className="mp-sky" data-phase={phase}>
        <div className="mp-sky__base" />
        <div className="mp-sky__cloud mp-sky__cloud--a" />
        <div className="mp-sky__cloud mp-sky__cloud--b" />
      </div>

      <div className="mp-home__inner">
        <section className="mp-hero">
          <span className="mp-hero__chip">
            <IconStar size={12} />
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
          </span>
          <h1 className="mp-hero__h1">
            {greeting}, <span className="mp-hero__name">Suzane</span>
          </h1>
          <p className="mp-hero__sub">
            Pergunte à MIA sobre filas, conversas, leads e performance — ou comece pelos destaques de hoje, logo abaixo.
          </p>
          <HeroChat value={draft} onChange={setDraft} onSubmit={() => setDraft("")} dark={dark} />
        </section>

        <section className="mp-section">
          <div className="mp-section__head">
            <div>
              <p className="mp-section__eye">Pulso da operação</p>
              <h2 className="mp-section__title">Hoje, em tempo real</h2>
            </div>
          </div>

          <div className="mp-grid-4">
            {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
          </div>

          <div className="mp-grid-2">
            <HiLoCard tone="hi" title="Highlights" items={highlights} />
            <HiLoCard tone="lo" title="Lowlights" items={lowlights} />
          </div>
        </section>

        <section className="mp-section" style={{ paddingBottom: 80 }}>
          <div className="mp-section__head">
            <div>
              <p className="mp-section__eye">Do time Morada</p>
              <h2 className="mp-section__title">Anúncios &amp; novidades</h2>
            </div>
          </div>

          <div className="mp-grid-3">
            <div>
              {announcements.map((a) => <AnnouncementCard key={a.title} {...a} />)}
            </div>
            <NotificationsCard items={notifications} />
          </div>
        </section>
      </div>

      <div className="mp-phasebar" role="group" aria-label="Demonstração — fase do céu">
        {PHASES.map((p) => (
          <button key={p} type="button" className={p === phase ? "is-active" : ""} onClick={() => setPhase(p)}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

window.HomePage = HomePage;
