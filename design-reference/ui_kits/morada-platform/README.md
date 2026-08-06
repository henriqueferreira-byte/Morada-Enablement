# Morada platform — UI kit

High-fidelity recreation of the **Morada.ai platform** (the main product) using the Niemeyer design system.

The kit centers on the **signature Home surface** — a time-aware, sky-backed landing page that doubles as the entrypoint to **MIA**, Morada's conversational AI. Sidebar, top bar, KPI grid, highlights/lowlights, announcements, and notifications surround it.

Open **`index.html`** to see the kit running. Use the floating phase bar at the bottom to cycle through the six sky phases (dawn → night) and watch every surface re-tint accordingly.

## Components

| File | What |
|---|---|
| `Icons.jsx` | Inline stroke icons (Tabler-style) used by every component. |
| `Sidebar.jsx` | Left rail — icon nav, tooltip on hover, active = brand-blue pill. |
| `TopBar.jsx` | Breadcrumb · search · status pill · bell · avatar. |
| `HeroChat.jsx` | The MIA composer: gradient avatar, auto-grow textarea, suggestion chips. |
| `KpiCard.jsx` | Dashboard KPI tile — icon + delta + eyebrow + big value + subtitle. Tones: primary / warning / info / success. |
| `HiLoCard.jsx` | Two-column highlights / lowlights surface used on Home. |
| `AnnouncementCard.jsx` | Left-bar gradient + gradient icon + tag + title. Three accent variants. |
| `NotificationsCard.jsx` | Notifications stack with unread-dot, header badge, footer link. |
| `HomePage.jsx` | Composes everything into the Home view with the sky background. |
| `morada-platform.css` | All component styles (`mp-*` prefix), the sky palettes, glass cards. |

## Source mapping

Production source files this kit mirrors (in `morada-ai/product-pocs` → `poc-redesign-platform/`):

- `src/components/blocks/home-page.tsx` → `HomePage.jsx`, `HeroChat.jsx`, `KpiCard.jsx`, `HiLoCard.jsx`, `AnnouncementCard.jsx`, `NotificationsCard.jsx`
- `src/components/blocks/home-sky.tsx` → sky palettes inlined into `morada-platform.css`
- `src/components/blocks/sidebar-nav.tsx` → `Sidebar.jsx` (light theme only)
- `src/components/blocks/top-nav.tsx` → `TopBar.jsx`

## What's intentionally simplified

- **Single screen** — only Home is implemented. Other sidebar items resolve to a placeholder. The point of the kit is to recreate the **visual vocabulary** (sky, glass, KPIs, announcement cards, gradient brand chip), not every product surface.
- **No real data** — every value is a mock. Numbers, names, queue labels are placeholder pt-BR.
- **No dropdown menus / floating popovers** — status pill is static; bell badge is decorative.
- **No mobile breakpoint** — designed for desktop ≥ 1280px wide. Production handles mobile via slide-over sidebar.
- **No dark-theme tokens** — only the light "gray" theme is applied. The sky goes dark on dusk/night and the glass cards adapt; the chrome (sidebar / top bar) stays light.
