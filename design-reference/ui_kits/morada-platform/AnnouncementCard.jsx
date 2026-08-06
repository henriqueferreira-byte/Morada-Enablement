/* AnnouncementCard — left-bar gradient accent + gradient icon + tag + title.
 * Used in the "Anúncios & novidades" home section. Variants choose the
 * gradient color pair.
 */

function AnnouncementCard({ tag, title, detail, time, accent, Icon }) {
  const [start, end] = accent;
  return (
    <div className="mp-glass mp-announce" style={{ ['--start']: start, ['--end']: end }}>
      <span className="mp-announce__bar" />
      <div className="mp-announce__icon">
        <Icon size={16} />
      </div>
      <div className="mp-announce__main">
        <div className="mp-announce__tags">
          <span className="mp-announce__tag">{tag}</span>
          <span className="mp-announce__time">{time}</span>
        </div>
        <h3 className="mp-announce__title">{title}</h3>
        <p className="mp-announce__detail">{detail}</p>
      </div>
      <IconArrowUpRight size={16} className="mp-announce__chev" />
    </div>
  );
}

window.AnnouncementCard = AnnouncementCard;
