---
name: morada-design
description: Use this skill to generate well-branded interfaces and assets for Morada.ai (a Brazilian B2B PropTech SaaS) using the Niemeyer design system. Contains essential brand guidelines, colors, type, fonts, logos, and UI kit components for prototyping or production work.
user-invocable: true
---

# Niemeyer — Morada.ai Design System

Read **`README.md`** at the root of this skill first — it is the canonical brief on the company, content fundamentals (pt-BR, sentence case, "MIA", "atendimento", "negócio"), visual foundations (blue `#0073ff`, Outfit + Lato, glass home cards over the time-of-day sky, soft borders + `--shadow-xs` cards, Tabler icons), and iconography. Then explore the other files as needed:

- **`colors_and_type.css`** — one flat CSS file with the full token system. Drop a `<link>` to it on any static HTML artifact and you immediately have `--primary`, `--card`, `--font-heading`, `--shadow-glass`, etc.
- **`components.css`** — vanilla `nm-*` classes for buttons, inputs, cards, badges, KPI tiles, avatars. Pair with `colors_and_type.css`.
- **`tokens/`** + **`styles/`** — the canonical CSS files imported from `@morada-ai/niemeyer`. Source of truth for the Tailwind 4 `@theme` block and dark-mode tokens.
- **`components/`** — production React/TSX primitives (Button, Card, Input, Tabs, etc.) and layout blocks (AppShell, SidebarShell, PageHeader). Read these when generating production-style code so the agent matches actual exported APIs.
- **`assets/logos/`** — every brand mark + wordmark variant as SVG (+ a PNG favicon). Never redraw the logo — copy the file.
- **`ui_kits/morada-platform/`** — high-fidelity recreation of the platform Home (sky background, MIA composer, glass KPIs, hi/lo cards, announcements, notifications, sidebar, top bar). Open `index.html` to inspect.
- **`ui_kits/painel-corretores/`** — the brokers analytics panel (KPI grid, area + donut charts, region bar list, brokers table with bulk actions).
- **`preview/`** — the small HTML cards that render in this skill's Design System tab. Useful as a visual reference for any individual token group.

## How to work

- **Static artifacts** (mocks, slides, throwaway prototypes, internal demos): copy assets out of `assets/`, link `colors_and_type.css` and `components.css` from the root, lift any kit components from `ui_kits/*` that match the surface you're building. The result lives as standalone HTML.
- **Production code** (Next.js / Tailwind 4 apps using `@morada-ai/niemeyer`): read `CLAUDE.md`-style guardrails inside the brand section of `README.md`, point your editor at the **`components/`** source for accurate APIs, and use **semantic Tailwind tokens** (`bg-primary`, `text-muted-foreground`, `bg-success-background`) — never raw hex.
- **Voice & copy**: all end-user UI is **pt-BR**, sentence case. Use "você" (informal). Domain nouns are fixed: *atendimento*, *negócio*, *fila*, *empreendimento*, *corretor(a)*, *campanha*, *MIA*. Numbers in pt-BR locale (`12,6%`, `1.247`). Times either relative (`há 2h`, `12 min`) or absolute pt-BR (`Terça, 14h`).
- **Icons**: `@tabler/icons-react` only — never Lucide, Font Awesome, Material, or emoji. For static HTML where the package isn't loaded, the inline SVGs in `ui_kits/*/Icons.jsx` are a portable copy.
- **The Home sky is the brand signature** — when the surface is a Home / Welcome / Dashboard landing, **use it**. Phase by time of day, glass cards floating over. Anywhere else, default to soft white `--card` over `--background` paper.

## If invoked without further guidance

If the user invokes this skill without a specific brief, **ask them what they want to build or design**, ask a few questions (audience, surface, pt-BR or English, fidelity, target output format), and then act as an expert designer who outputs either an HTML artifact (mocks, slides, prototypes) or production code using `@morada-ai/niemeyer` — depending on the user's need. Do not assume.
