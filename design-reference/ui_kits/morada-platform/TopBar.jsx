/* TopBar — page chrome above the main scroll region.
 * Breadcrumb · search · status pill (operator availability) · bell · avatar.
 */

function TopBar({ crumbs = ["Home"], onMenu }) {
  return (
    <header className="mp-topbar">
      <div className="mp-topbar__left">
        {onMenu && (
          <button type="button" className="mp-topbar__btn" onClick={onMenu} aria-label="Menu">
            <IconMenu size={18} />
          </button>
        )}
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="mp-topbar__crumb-sep"><IconChevronRight size={14} /></span>}
            <span className={`mp-topbar__crumb ${i < crumbs.length - 1 ? "mp-topbar__crumb-faint" : ""}`}>{c}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="mp-topbar__search">
        <IconSearch size={16} />
        <input type="text" placeholder="Buscar corretor, lead, empreendimento…" />
      </div>

      <div className="mp-topbar__right">
        <button type="button" className="mp-topbar__status">
          <span className="mp-dot" /> Online
          <IconChevronDown size={12} />
        </button>
        <button type="button" className="mp-topbar__btn" aria-label="Ajuda">
          <IconHelpCircle size={18} />
        </button>
        <button type="button" className="mp-topbar__btn" aria-label="Notificações" style={{ position: "relative" }}>
          <IconBell size={18} />
          <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 999, background: "var(--primary)", boxShadow: "0 0 0 2px var(--card)" }} />
        </button>
        <div className="nm-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>SC</div>
      </div>
    </header>
  );
}

window.TopBar = TopBar;
