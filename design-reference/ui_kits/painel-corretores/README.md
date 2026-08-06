# Painel de Corretores — UI kit

High-fidelity recreation of the **Painel de Corretores** (brokers analytics panel) using the Niemeyer design system.

The kit recreates the brokers dashboard surface — a desktop-first analytics view used by sales managers to monitor and act on the broker workforce. It demonstrates how Niemeyer **non-Home** surfaces compose: standard `--background` paper, `default` Cards with `--shadow-xs`, soft borders, table density, and the canonical status-trio (success / warning / destructive) for performance tiers.

Open **`index.html`** to see the kit. Click a checkbox to reveal the bulk-actions bar.

## Components

| File | What |
|---|---|
| `Icons.jsx` | Inline Tabler-style stroke icons (prefixed `PCIcon*`). |
| `Chrome.jsx` | `PCSidebar` + `PCTopBar` — re-skinned shell, "Corretores" active. |
| `Charts.jsx` | `AreaChart`, `DonutChart`, `BarList` — vanilla SVG renderers. |
| `Badges.jsx` | `StatusBadge` (top / desenvolvimento / inativo) + `MetaBar`. |
| `CorretoresPage.jsx` | Header + KPI grid + chart row + region bar list + corretores table with bulk-actions bar. |
| `data.js` | Mock data (kpi stats, monthly performance, region buckets, specialty donut segments, broker rows). |
| `painel-corretores.css` | All page styles (`pc-*` prefix). |

## Source mapping

Production source files in `morada-ai/product-pocs` → `painel-corretores/`:

- `src/app/(preview)/corretores/page.tsx` → `CorretoresPage.jsx`
- `src/app/(preview)/corretores/data.ts` → `data.js`
- `src/components/blocks/stats-grid.tsx` → KPI grid in `CorretoresPage.jsx`
- `src/components/blocks/area-chart.tsx` → `Charts.jsx` AreaChart
- `src/components/blocks/donut-chart.tsx` → `Charts.jsx` DonutChart
- `src/components/blocks/bar-list.tsx` → `Charts.jsx` BarList
- `src/components/blocks/sidebar-nav.tsx`, `top-nav.tsx` → `Chrome.jsx`

## What's intentionally simplified

- **No slide-over profile panel.** Clicking a row name doesn't open the broker drawer; that interaction is described in the source but omitted here to keep the kit focused on the *list/dashboard* surface.
- **No dropdown menus / row-action menus.** Buttons are static.
- **Filters don't actually filter.** The four filter selects across the table head are visual placeholders.
- **Tables are not virtualized.** Eight broker rows is the fixed demo set; production handles paging + server filters.
- **No mobile breakpoint.** Designed for desktop ≥ 1280px.
