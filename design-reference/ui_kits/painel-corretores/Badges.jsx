/* StatusBadge — Top performer / Em desenvolvimento / Inativo.
 * Uses the canonical Niemeyer status-trio: tinted background + bordered + text. */

function StatusBadge({ status }) {
  if (status === "top") {
    return <span className="nm-badge nm-badge--success" style={{ borderRadius: 4 }}>Top performer</span>;
  }
  if (status === "desenvolvimento") {
    return <span className="nm-badge nm-badge--warning" style={{ borderRadius: 4 }}>Em desenvolvimento</span>;
  }
  return <span className="nm-badge nm-badge--destructive" style={{ borderRadius: 4 }}>Inativo</span>;
}

function MetaBar({ value }) {
  const fill = value >= 70 ? "var(--success)" : value >= 40 ? "var(--warning)" : "var(--destructive)";
  return (
    <div className="pc-meta-bar">
      <div className="pc-meta-bar__track">
        <div className="pc-meta-bar__fill" style={{ width: `${value}%`, background: fill }} />
      </div>
      <span className="pc-meta-bar__pct">{value}%</span>
    </div>
  );
}

window.StatusBadge = StatusBadge;
window.MetaBar = MetaBar;
