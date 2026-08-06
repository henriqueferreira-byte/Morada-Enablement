/* PCSidebar — same shape as the morada-platform sidebar, but with the brokers
 * panel as the active section. Static; demonstrates the visual rail. */

function PCSidebar({ active = "leads" }) {
  const items = [
    { id: "home",      label: "Home",        Icon: PCIconHome },
    { id: "dashboard", label: "Dashboard",   Icon: PCIconDashboard },
    { id: "talk",      label: "Talk",        Icon: PCIconHeadset },
    { id: "leads",     label: "Corretores",  Icon: PCIconUsers },
    { id: "marketing", label: "Marketing",   Icon: PCIconMegaphone },
    { id: "filas",     label: "Filas",       Icon: PCIconArrowsSplit },
    { id: "library",   label: "Biblioteca",  Icon: PCIconBook },
    { id: "skills",    label: "Skills",      Icon: PCIconSparkles },
  ];
  return (
    <aside className="mp-sidebar" aria-label="Navegação primária">
      <div className="mp-sidebar__brand">
        <img src="../../assets/logos/icon-blue.svg" alt="Morada" />
      </div>
      <div className="mp-sidebar__items">
        {items.map(({ id, label, Icon }) => (
          <button key={id} type="button" className={`mp-sidebar__item ${active === id ? "is-active" : ""}`} aria-label={label}>
            <Icon size={18} />
            <span className="mp-tooltip">{label}</span>
          </button>
        ))}
      </div>
      <div className="mp-sidebar__footer">
        <div className="mp-sidebar__sep" />
        <button type="button" className="mp-sidebar__item" aria-label="Gerenciar"><PCIconSettings size={18} /><span className="mp-tooltip">Gerenciar</span></button>
        <button type="button" className="mp-sidebar__item" aria-label="Ajuda"><PCIconHelp size={18} /><span className="mp-tooltip">Ajuda</span></button>
      </div>
    </aside>
  );
}

function PCTopBar() {
  return (
    <header className="mp-topbar">
      <div className="mp-topbar__left">
        <span className="mp-topbar__crumb mp-topbar__crumb-faint">Painel</span>
        <span className="mp-topbar__crumb-sep">›</span>
        <span className="mp-topbar__crumb">Corretores</span>
      </div>
      <div className="mp-topbar__search">
        <PCIconSearch size={16} />
        <input type="text" placeholder="Buscar corretor, lead, empreendimento…" />
      </div>
      <div className="mp-topbar__right">
        <button type="button" className="mp-topbar__status">
          <span className="mp-dot" /> Online
          <PCIconChevronDown size={12} />
        </button>
        <button type="button" className="mp-topbar__btn" aria-label="Ajuda"><PCIconHelp size={18} /></button>
        <button type="button" className="mp-topbar__btn" aria-label="Notificações"><PCIconBell size={18} /></button>
        <div className="nm-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>SC</div>
      </div>
    </header>
  );
}

window.PCSidebar = PCSidebar;
window.PCTopBar = PCTopBar;
