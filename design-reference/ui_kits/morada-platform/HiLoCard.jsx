/* HiLoCard — two-column highlights/lowlights surface on the home page.
 * Each row has a tinted icon, a bold title, and a calm detail line.
 */

function HiLoCard({ tone = "hi", title, items }) {
  const HeadIcon = tone === "hi" ? IconTrendingUp : IconTrendingDown;
  return (
    <div className={`mp-glass mp-hilo tone-${tone}`}>
      <div className="mp-hilo__head">
        <div className="mp-hilo__head-icon">
          <HeadIcon size={16} />
        </div>
        <h3 className="mp-hilo__head-title">{title}</h3>
      </div>
      {items.map((it) => {
        const RowIcon = it.icon;
        return (
          <div className="mp-hilo__row" key={it.title}>
            <div className="mp-hilo__row-icon">
              <RowIcon size={16} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="mp-hilo__row-title">{it.title}</p>
              <p className="mp-hilo__row-detail">{it.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.HiLoCard = HiLoCard;
