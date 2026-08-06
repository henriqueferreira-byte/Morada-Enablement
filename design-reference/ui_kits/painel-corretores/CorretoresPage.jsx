/* CorretoresPage — the brokers panel composed of:
 *  · Header (title + period select + primary action)
 *  · KPI grid (4 stats)
 *  · Two-up: AreaChart + DonutChart
 *  · Bar list (region segmentation)
 *  · Filters + bulk bar + corretores table
 *
 * Mirrors painel-corretores/src/app/(preview)/corretores/page.tsx, simplified
 * but visually equivalent at typical viewport widths.
 */

function CorretoresPage() {
  const [selected, setSelected] = React.useState(new Set());
  const [period, setPeriod] = React.useState("30d");

  const toggleAll = () => {
    if (selected.size === CORRETORES.length) setSelected(new Set());
    else setSelected(new Set(CORRETORES.map((c) => c.id)));
  };
  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const totalSpec = SPECIALTY_SEGMENTS.reduce((acc, s) => acc + s.value, 0);

  return (
    <div className="pc-page">
      <header className="pc-page__header">
        <div>
          <h1 className="pc-page__title">Painel de corretores</h1>
          <p className="pc-page__sub">Visão geral e gestão inteligente da equipe comercial.</p>
        </div>
        <div className="pc-page__actions">
          <button className="pc-select" onClick={() => setPeriod(period === "30d" ? "90d" : "30d")}>
            <PCIconCalendar size={14} />
            Últimos {period}
            <PCIconChevronDown size={12} />
          </button>
          <button className="nm-btn">
            <PCIconSend size={14} /> Ações <PCIconChevronDown size={12} />
          </button>
        </div>
      </header>

      {/* KPIs */}
      <section className="pc-kpi-grid">
        {KPI_STATS.map((k, i) => {
          const Icon = [PCIconUsers, PCIconUserCheck, PCIconChartBar, PCIconHome][i];
          return (
            <div className="pc-kpi" key={k.label}>
              <div className="pc-kpi__head">
                <div className="pc-kpi__icon"><Icon size={18} /></div>
                <span className={`pc-kpi__delta ${k.dir === "up" ? "is-up" : "is-down"}`}>
                  {k.dir === "up" ? <PCIconTrendingUp size={12} /> : <PCIconTrendingDown size={12} />}
                  {k.change}
                </span>
              </div>
              <p className="pc-kpi__label">{k.label}</p>
              <div className="pc-kpi__value">{k.value}</div>
            </div>
          );
        })}
      </section>

      {/* Charts row */}
      <section className="pc-row-2">
        <div className="pc-card">
          <div className="pc-card__head">
            <div>
              <h2 className="pc-card__title">Evolução da equipe</h2>
              <p className="pc-card__sub">Leads, visitas e conversões — últimos 5 meses</p>
            </div>
          </div>
          <div className="pc-summary">
            {[
              { label: "Leads totais", value: "1.247", change: "+18,4%", dir: "up"   },
              { label: "Visitas",      value: "342",   change: "-8",     dir: "down" },
              { label: "Conversões",   value: "131",   change: "+12,1%", dir: "up"   },
            ].map((s) => (
              <div className="pc-summary__cell" key={s.label}>
                <p className="pc-summary__label">{s.label}</p>
                <div className="pc-summary__row">
                  <span className="pc-summary__value">{s.value}</span>
                  <span className={`pc-summary__change ${s.dir === "up" ? "is-up" : "is-down"}`}>{s.change}</span>
                </div>
              </div>
            ))}
          </div>
          <AreaChart
            data={PERFORMANCE}
            xKey="mes"
            series={[
              { key: "leads",      color: "var(--chart-1)" },
              { key: "visitas",    color: "var(--chart-2)" },
              { key: "conversoes", color: "var(--chart-3)" },
            ]}
          />
          <div className="pc-legend">
            <div className="pc-legend__item"><span className="pc-legend__dot" style={{ background: "var(--chart-1)" }} /> Leads</div>
            <div className="pc-legend__item"><span className="pc-legend__dot" style={{ background: "var(--chart-2)" }} /> Visitas</div>
            <div className="pc-legend__item"><span className="pc-legend__dot" style={{ background: "var(--chart-3)" }} /> Conversões</div>
          </div>
        </div>

        <div className="pc-card">
          <div className="pc-card__head">
            <div>
              <h2 className="pc-card__title">Especialidade</h2>
              <p className="pc-card__sub">Distribuição da equipe</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <DonutChart segments={SPECIALTY_SEGMENTS} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="pc-donut-center">
                  <span className="pc-donut-center__value">{totalSpec}</span>
                  <span className="pc-donut-center__label">corretores</span>
                </div>
              </div>
            </div>
            <ul style={{ flex: 1, listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {SPECIALTY_SEGMENTS.map((s) => (
                <li key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                  <span style={{ flex: 1, color: "var(--text-primary)" }}>{s.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bar list */}
      <section className="pc-card">
        <div className="pc-card__head">
          <div>
            <h2 className="pc-card__title">Corretores por região</h2>
            <p className="pc-card__sub">Distribuição da equipe pela região de atuação</p>
          </div>
        </div>
        <BarList items={REGION_BARS} valueFormatter={(n) => `${n}`} />
      </section>

      {/* Corretores table */}
      <section className="pc-table-wrap">
        <div className="pc-table-head">
          <div className="pc-table-head__l">
            <h3>Corretores da equipe</h3>
            <p>{CORRETORES.length} corretores · top performers em verde</p>
          </div>
          <div className="pc-filters">
            <button className="pc-select">Performance: Todos <PCIconChevronDown size={12} /></button>
            <button className="pc-select">Região: Todas <PCIconChevronDown size={12} /></button>
            <button className="pc-select">Especialidade: Todas <PCIconChevronDown size={12} /></button>
            <button className="pc-select">Imobiliária: Todas <PCIconChevronDown size={12} /></button>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="pc-bulk">
            <div className="pc-bulk__count">
              <span className="pc-bulk__count-pill">{selected.size}</span>
              corretor{selected.size > 1 ? "es" : ""} selecionado{selected.size > 1 ? "s" : ""}
            </div>
            <div className="pc-bulk__sep" />
            <div className="pc-bulk__actions">
              <button className="pc-bulk__btn"><PCIconSend size={12} /> Enviar campanha</button>
              <button className="pc-bulk__btn"><PCIconBuilding size={12} /> Anunciar lançamento</button>
              <button className="pc-bulk__btn"><PCIconUserShare size={12} /> Atribuir leads</button>
              <button className="pc-bulk__btn"><PCIconTarget size={12} /> Enviar meta</button>
              <button className="pc-bulk__btn"><PCIconExport size={12} /> Exportar</button>
            </div>
            <button className="pc-bulk__clear" onClick={() => setSelected(new Set())}>
              <PCIconX size={12} /> Limpar seleção
            </button>
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table className="pc-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" className="pc-checkbox" checked={selected.size === CORRETORES.length} onChange={toggleAll} />
                </th>
                <th>Corretor</th>
                <th>Imobiliária</th>
                <th>Região</th>
                <th>Status</th>
                <th className="is-right">Leads</th>
                <th className="is-right">Visitas</th>
                <th className="is-right">Conversões</th>
                <th>Meta</th>
                <th style={{ width: 40 }} className="is-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {CORRETORES.map((c) => {
                const isSel = selected.has(c.id);
                return (
                  <tr key={c.id} className={`${isSel ? "is-selected" : ""} ${c.status === "top" ? "is-top" : ""}`}>
                    <td>
                      <input type="checkbox" className="pc-checkbox" checked={isSel} onChange={() => toggle(c.id)} />
                    </td>
                    <td>
                      <div className="pc-cell-name">
                        <div className="nm-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>{c.initials}</div>
                        <div>
                          <div className="pc-cell-name__name">{c.nome}</div>
                          <div className="pc-cell-name__sub">{c.especialidade}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{c.imobiliaria}</td>
                    <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{c.regiao}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td className="is-right" style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{c.leads}</td>
                    <td className="is-right" style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{c.visitas}</td>
                    <td className="is-right">
                      <span className={`pc-trend ${c.conversoes > 0 ? "is-up" : "is-down"}`}>
                        {c.conversoes > 0 ? <PCIconTrendingUp size={14} /> : <PCIconTrendingDown size={14} />}
                        {c.conversoes}
                      </span>
                    </td>
                    <td><MetaBar value={c.meta} /></td>
                    <td className="is-right">
                      <button className="pc-row-actions" aria-label="Ações"><PCIconMore size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pc-table-foot">
          <span className="pc-table-foot__count">
            Exibindo {CORRETORES.length} corretores
            {selected.size > 0 && ` · ${selected.size} selecionado${selected.size > 1 ? "s" : ""}`}
          </span>
          <button className="nm-btn nm-btn--outline nm-btn--sm nm-btn--rect">
            <PCIconExport size={12} /> Exportar
          </button>
        </div>
      </section>
    </div>
  );
}

window.CorretoresPage = CorretoresPage;
