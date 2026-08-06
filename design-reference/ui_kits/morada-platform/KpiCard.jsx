/* KpiCard — dashboard tile with icon, delta pill, eyebrow label, big value,
 * and an optional subtitle. Tones: primary / warning / info / success.
 * Wrapped in `.mp-glass` when over the home sky.
 */

function KpiCard({ label, value, deltaDir = "up", deltaValue, deltaLabel, subtitle, tone = "primary", Icon }) {
  const TrendIcon = deltaDir === "up" ? IconTrendingUp : IconTrendingDown;
  return (
    <div className={`mp-glass mp-kpi tone-${tone}`}>
      <div className="mp-kpi__head">
        <div className="mp-kpi__icon">
          <Icon size={16} />
        </div>
        <span className="mp-kpi__delta">
          <TrendIcon size={12} />
          {deltaValue}
        </span>
      </div>
      <p className="mp-kpi__label">{label}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span className="mp-kpi__value">{value}</span>
        {deltaLabel && <span style={{ fontSize: 11, color: "var(--neutral-500)" }}>{deltaLabel}</span>}
      </div>
      {subtitle && <p className="mp-kpi__sub">{subtitle}</p>}
    </div>
  );
}

window.KpiCard = KpiCard;
