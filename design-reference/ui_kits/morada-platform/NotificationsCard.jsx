/* NotificationsCard — right-side stack on the home page. Header counts
 * unread items; each row has a blue dot (unread) or neutral dot (read).
 */

function NotificationsCard({ items }) {
  const unread = items.filter((i) => i.unread).length;
  return (
    <div className="mp-glass mp-notif">
      <div className="mp-notif__head">
        <div className="mp-notif__head-l">
          <div className="mp-notif__head-icon">
            <IconBellRinging size={16} />
          </div>
          <h3 className="mp-notif__head-title">Notificações</h3>
        </div>
        <span className="mp-notif__head-badge">{unread} novas</span>
      </div>
      <ul className="mp-notif__list">
        {items.map((it, i) => (
          <li key={i} className={`mp-notif__item ${it.unread ? "unread" : ""}`}>
            <span className="mp-notif__item-dot" />
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="mp-notif__item-title">{it.title}</p>
              <p className="mp-notif__item-time">{it.time}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mp-notif__foot">
        <a href="#"><span>Ver todas</span><IconArrowUpRight size={14} /></a>
      </div>
    </div>
  );
}

window.NotificationsCard = NotificationsCard;
