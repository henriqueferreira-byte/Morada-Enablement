/* Charts — vanilla SVG renderers used by the brokers panel UI kit.
 * Both auto-size to their container via responsive width and use Niemeyer
 * chart tokens (--chart-1..5).
 */

function AreaChart({ data, xKey, series, width = 640, height = 220 }) {
  const PAD = { l: 40, r: 16, t: 14, b: 28 };
  const innerW = width - PAD.l - PAD.r;
  const innerH = height - PAD.t - PAD.b;
  const allY = series.flatMap((s) => data.map((d) => d[s.key]));
  const yMax = Math.max(...allY) * 1.1;
  const xStep = innerW / (data.length - 1);

  // Build paths
  const paths = series.map((s) => {
    const pts = data.map((d, i) => {
      const x = PAD.l + i * xStep;
      const y = PAD.t + innerH - (d[s.key] / yMax) * innerH;
      return [x, y];
    });
    const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
    const area = `${line} L${pts[pts.length - 1][0]},${PAD.t + innerH} L${pts[0][0]},${PAD.t + innerH} Z`;
    return { ...s, line, area };
  });

  // Y axis ticks (4 lines)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: PAD.t + innerH - t * innerH,
    value: Math.round(yMax * t),
  }));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: "block" }} preserveAspectRatio="xMidYMid meet">
      <defs>
        {paths.map((s, i) => (
          <linearGradient key={i} id={`area-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {/* Y grid */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={PAD.l} y1={t.y} x2={width - PAD.r} y2={t.y} stroke="var(--border)" strokeDasharray="2 3" />
          <text x={PAD.l - 8} y={t.y + 4} fontSize="10" fill="var(--text-tertiary)" textAnchor="end" fontFamily="var(--font-mono)">{t.value}</text>
        </g>
      ))}

      {/* X labels */}
      {data.map((d, i) => (
        <text key={i} x={PAD.l + i * xStep} y={height - 8} fontSize="11" fill="var(--text-tertiary)" textAnchor="middle" fontFamily="var(--font-body)">
          {d[xKey]}
        </text>
      ))}

      {/* Areas + lines */}
      {paths.map((s, i) => (
        <g key={i}>
          <path d={s.area} fill={`url(#area-grad-${i})`} />
          <path d={s.line} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}

      {/* End dots */}
      {paths.map((s, i) => {
        const last = data.length - 1;
        const x = PAD.l + last * xStep;
        const y = PAD.t + innerH - (data[last][s.key] / yMax) * innerH;
        return <circle key={i} cx={x} cy={y} r="3.5" fill={s.color} stroke="var(--card)" strokeWidth="2" />;
      })}
    </svg>
  );
}

function DonutChart({ segments, size = 160, stroke = 18 }) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  let acc = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: "visible" }}>
      <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
        {segments.map((s, i) => {
          const len = (s.value / total) * circ;
          const dash = `${len} ${circ - len}`;
          const offset = -acc;
          acc += len;
          return (
            <circle
              key={i}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={dash}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
        })}
      </g>
    </svg>
  );
}

function BarList({ items, valueFormatter }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div className="pc-bar-list">
      {items.map((it) => (
        <div className="pc-bar__row" key={it.name}>
          <div className="pc-bar__name">{it.name}</div>
          <div className="pc-bar__track">
            <div className="pc-bar__fill" style={{ width: `${(it.value / max) * 100}%` }} />
          </div>
          <div className="pc-bar__value">{valueFormatter ? valueFormatter(it.value) : it.value}</div>
        </div>
      ))}
    </div>
  );
}

window.AreaChart = AreaChart;
window.DonutChart = DonutChart;
window.BarList = BarList;
