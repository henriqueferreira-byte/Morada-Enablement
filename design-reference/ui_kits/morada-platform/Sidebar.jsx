/* Sidebar — left rail with icon nav + tooltip on hover.
 * Mirrors the production `SidebarShell` in light theme. Active item carries
 * the brand-blue background; other items hover into neutral muted.
 */

function Sidebar({ active, onChange }) {
  const items = [
    { id: "home",      label: "Home",          Icon: IconHome },
    { id: "dashboard", label: "Dashboard",     Icon: IconDashboard },
    { id: "talk",      label: "Talk",          Icon: IconHeadset, badge: 4 },
    { id: "leads",     label: "Negócios",      Icon: IconUsers },
    { id: "marketing", label: "Marketing",     Icon: IconMegaphone },
    { id: "filas",     label: "Filas",         Icon: IconArrowsSplit },
    { id: "library",   label: "Biblioteca",    Icon: IconBook },
    { id: "skills",    label: "Skills",        Icon: IconSparkles },
  ];

  return (
    <aside className="mp-sidebar" aria-label="Navegação primária">
      <div className="mp-sidebar__brand">
        <img src="../../assets/logos/icon-blue.svg" alt="Morada" />
      </div>

      <div className="mp-sidebar__items">
        {items.map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            type="button"
            className={`mp-sidebar__item ${active === id ? "is-active" : ""}`}
            onClick={() => onChange(id)}
            aria-label={label}
            aria-current={active === id ? "page" : undefined}
          >
            <Icon size={18} />
            <span className="mp-tooltip">{label}{badge ? ` · ${badge}` : ""}</span>
          </button>
        ))}
      </div>

      <div className="mp-sidebar__footer">
        <div className="mp-sidebar__sep" />
        <button type="button" className="mp-sidebar__item" aria-label="Configurações">
          <IconSettings size={18} />
          <span className="mp-tooltip">Gerenciar</span>
        </button>
        <button type="button" className="mp-sidebar__item" aria-label="Ajuda">
          <IconHelpCircle size={18} />
          <span className="mp-tooltip">Ajuda</span>
        </button>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
