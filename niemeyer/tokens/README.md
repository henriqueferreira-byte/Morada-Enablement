# Niemeyer — Morada.ai Design System

> Design system for **Morada.ai**, a Brazilian B2B PropTech SaaS. Named after Oscar Niemeyer — the architect behind Brazil's most iconic modernist buildings — to match the company's "morada" (dwelling / home) brand metaphor.

This project is a **portable, file-system distillation** of the production design system. It contains the brand fundamentals, real visual assets, type and color tokens, and high-fidelity UI kits that reproduce Morada's actual product surfaces — so a design agent can generate well-branded mocks, slides, prototypes, or production-style code without ever leaving the project.

---

## Sources

This project was assembled from two GitHub repositories owned by `morada-ai`. They are private; if you (the reader) have access, follow up there for the canonical, always-current source of truth. Otherwise, this folder is the snapshot.

- **`morada-ai/niemeyer-design-system`** — the canonical design system package (`@morada-ai/niemeyer`). Tokens, shadcn-customized React primitives, layout blocks, Tailwind 4 preset, ESLint plugin, Agent Skills. <https://github.com/morada-ai/niemeyer-design-system>
- **`morada-ai/product-pocs`** — high-fidelity prototypes of two products built on Niemeyer:
  - `poc-redesign-platform` — the main Morada.ai platform redesign (home, dashboard, conversations, leads, marketing, queues, developments).
  - `painel-corretores` — the brokers panel (analytics + lead distribution for real-estate brokers).
  <https://github.com/morada-ai/product-pocs>

For richer designs (more screens, every component, dark mode, real production code), explore those repos directly.

---

## What's in this folder

| Path | What |
|---|---|
| `README.md` | This file — overview, brand, voice, visuals, iconography, index. |
| `SKILL.md` | Agent-Skills entrypoint — read first when invoking this as a skill. |
| `colors_and_type.css` | Single flat CSS file with the full token system (brand + neutrals + semantic + radii + shadows + type) for static HTML artifacts. |
| `components.css` | Vanilla `nm-*` classes for buttons, inputs, cards, badges, KPI tiles, avatars. Pair with `colors_and_type.css` on static HTML. |
| `tokens/` | The canonical CSS variable files imported from the source repo (`primitives.css`, `typography.css`, `semantic-light.css`, `semantic-dark.css`, `effects.css`). |
| `styles/` | Tailwind 4 `@theme` block (`theme.css`), foundation resets, third-party compat overrides. |
| `components/` | React/TSX source for primitives (`ui/*`), layout blocks (`blocks/*`), and brand (`brand/icon.tsx`). Reference for production work — these are the actual exported components. |
| `assets/logos/` | All brand mark and wordmark variants (blue, color, mono dark, white, reversed) as SVG + PNG favicon. |
| `preview/` | Small HTML cards that render in the Design System tab — color swatches, type specimens, components, etc. |
| `ui_kits/morada-platform/` | UI kit recreating the Morada platform Home — sky background, MIA composer, glass KPIs, hi/lo, announcements, notifications, sidebar, top bar. |
| `ui_kits/painel-corretores/` | UI kit recreating the brokers analytics panel — KPI grid, area + donut charts, region bar list, brokers table with bulk-actions. |
| `screenshots/` | Reference screenshots of the UI kits, captured during build. |

---

## Product context

**Morada.ai** is a B2B SaaS for **real-estate operations in Brazil** — incorporadoras (developers) and real-estate agencies. The platform sits on top of conversational AI (a virtual assistant called **MIA**) and consolidates the entire lead-to-deal flow:

- **Conversations** ("Talk" / "Atendimentos") — WhatsApp-first conversational inbox with AI suggestions, supervision, queue routing.
- **Leads & Pipeline** ("Negócios") — CRM stages, deal cards, broker assignment.
- **Marketing** — campaign management, ad performance, multi-platform funnels.
- **Developments** ("Empreendimentos") — real-estate inventory: buildings, units, share links.
- **Queues** ("Filas") — round-robin / weighted distribution of incoming leads to brokers.
- **Brokers Panel** ("Painel de Corretores") — analytics surface for the broker workforce.
- **Home** — a personalized, time-aware landing surface (the sky behind it literally changes with the time of day) that doubles as the entry point to MIA.

**Audience:** real-estate operations leaders, marketing managers, sales managers, brokers. Mostly desktop-first, with mobile considered.

**Stack** (production): Next 16+, React 19+, Tailwind 4, shadcn/ui primitives, `@tabler/icons-react`, Outfit + Lato.

---

## CONTENT FUNDAMENTALS

### Language

- **All product UI shown to end users is Brazilian Portuguese (pt-BR).** Code, comments, commits, internal docs are English.
- This is a hard, non-negotiable split. Mocks, slides and prototypes must use pt-BR copy. If you generate a screen in English by reflex, it will not feel Morada.

### Tone

- **Operational, calm, second-person, friendly.** "Você" (informal "you"), never "tu" or "o senhor". Sentences are short. The voice is that of a competent ops tool that respects the user's time — not a marketing brochure, not a chatbot.
- The product is **a co-pilot for the team**, not a replacement. Copy references the user's team and queues by name when possible ("Suzane mencionou você", "Fila DEMO MG mais cheia").

### Casing

- **Sentence case everywhere** for UI text — buttons, labels, headings, menus. Never Title Case.
  - ✅ "Novo empreendimento" "Abrir dashboard" "Filas ativas"
  - ❌ "Novo Empreendimento" "Abrir Dashboard"
- **ALL-CAPS** only for eyebrows / overlines / small section labels, with widened letter-spacing (`tracking-wider`).
- Proper nouns keep their casing: **MIA**, **Talk**, **Morada**, queue names (**DEMO MG**, **Vista Sul**).

### Vocabulary (canonical pt-BR product nouns)

| English concept | Morada term | Notes |
|---|---|---|
| Conversation / chat | **Atendimento** / **Conversa** | "Talk" is the product surface name (capitalized). |
| Lead / deal | **Negócio** | Always singular; plural is "Negócios". |
| Customer-facing AI | **MIA** | Always uppercase, no period. |
| Queue | **Fila** | "Filas" plural. |
| Development / property | **Empreendimento** | Buildings + units; never "imóvel" in product UI. |
| Broker / sales agent | **Corretor** / **Corretora** | Both genders explicit. |
| Campaign | **Campanha** | "Campanhas" plural; lives under "Marketing". |
| Dashboard | **Dashboard** | English loanword, no italics. |
| Home | **Home** | English loanword, lowercase outside title position. |

### Numbers, time, units

- **pt-BR locale.** Decimal comma (`12,6%`), thousands period (`1.247`).
- **Relative time** for recency ("agora", "12 min", "1h", "há 2h", "há 1 dia").
- **Absolute time** for scheduled events ("Terça, 14h").
- Currency: **BRL**, formatted `R$ 1.234,56`.
- Dates: long form for hero / greeting (`segunda-feira, 02 de junho`), short form `dd/mm/aaaa` for tables.

### Example copy — the home greeting

> **Bom dia, Suzane**
> Pergunte à MIA sobre filas, conversas, leads e performance — ou comece pelos destaques de hoje, logo abaixo.
>
> *Suggestion chips:*
> "Qual o tempo médio de resposta da minha equipe hoje?" · "Mostre os leads parados há mais de 48h" · "Quantos atendimentos perdi na última hora?" · "Quem está com a maior fila agora?"

### Example copy — KPI subtitles

> **Conversas em andamento** — 47 — 8 atribuídas a você
> **Aguardando atendimento** — 12 — Tempo médio: 3m 12s
> **Filas ativas** — 5 — DEMO MG mais cheia
> **Atendentes online** — 18 — 3 em pausa

### Emoji

- **Not used in product UI.** Iconography is `@tabler/icons-react`. Emoji do appear occasionally in informal internal messaging mocks (e.g. a chat bubble preview) but never as UI affordances.

### Errors, empty states, success

- Errors are factual and propose the next action: "Não foi possível salvar. Tente novamente em alguns instantes."
- Empty states are warm and directive: short headline + 1-line description + 1 primary action.
- Success toasts are terse, past-tense: "Campanha publicada." "Lead atribuído."

---

## VISUAL FOUNDATIONS

### Color

- **Primary brand: blue `#0073ff`.** The "Morada blue" is the load-bearing accent — primary buttons, links, active sidebar items, focus rings, brand logo circle.
- **Secondary brand: cya `#00ffe0`** (yes, "cya" — three letters — that's the intentional spelling in the token file). High-saturation aqua, used very sparingly: secondary chips, gradient mid-stops, chart accent.
- **Tertiary brand: orange `#f7b87d`.** Warm peach, used for tertiary chips, gradients in announcement cards, the "sunset" sky phase.
- **Neutrals are cool blue-grays** built around `#606A80`, not pure grays. This is what gives the platform its distinct "operational tech" feel vs. a generic shadcn screenshot.
- **Status colors** are the conventional emerald / amber / red / cyan but always rendered in a *trio*: soft tinted background + bordered + tinted text (`bg-success-background text-success-text border-success-border`). Never the saturated raw color on a card.
- **Gradients are reserved and directional.** The hero "MIA" icon uses `linear-gradient(135deg, #0073ff → #02cfff)`. Announcement cards use accent-bar gradients (`#02cfff → #0073ff`, `#00ffe0 → #02cfff`, `#f7b87d → #fad499`). Avoid blue→purple bluish-purple gradients (a common AI-slop trope).

### Typography

- **Outfit** for headings (display + UI titles). 400 / 500 / 600 / 700.
- **Lato** for body, labels, captions, table cells. 300 / 400 / 700 / 900.
- **JetBrains Mono** for code, IDs, numeric counters with monospaced columns.
- Heading scale tops out at **32px H1** — there is no display-size "marketing hero" typography in product surfaces. Hero text on the home is `40–52px` (`leading-[1.05]` `tracking-tight`), which is bigger but uses the same Outfit family.
- Eyebrows / overlines: `12px` Outfit `font-semibold` `uppercase` `tracking-wider`, `text-muted-foreground`.

### Spacing

- **Standard Tailwind ladder (`n × 4px`)** — `gap-2` 8px (tight), `gap-3` 12px (form fields), `gap-4` 16px (card items), `gap-6` 24px (page sections, card padding), `gap-8` 32px.
- **Load-bearing heights:** 24, 32, 40, 48, 64. Components stick to these. Sidebar items are 40 (`h-10`). Page CTAs are 40. Filter chips are 32. Hero composer is 64.
- **Page layout default:** `flex flex-col gap-5 p-5` — 20px outer padding, 20px gap between sections.

### Backgrounds

- **No textures, no patterns, no photography in chrome.** Surfaces are flat tinted neutrals (`--background` = `neutral-50`, `--card` = white).
- **Exception — the Home page.** The home has a **time-aware sky gradient** as the background: 6 phases (dawn / morning / midday / sunset / dusk / night) each with a base radial gradient, a subtle drifting glow, a horizon glow, two slow-moving blurred cloud blobs, and (in dusk/night) twinkling stars. Glass cards float over this sky. This is the brand's signature visual moment — keep it.
- **Marketing / auth backgrounds** (when needed) lean on the brand-blue radial gradient (`radial-gradient(at top, #0073ff, #001f3d)`) with the white wordmark over it.

### Cards

- **Default Card** (`<Card>`): `bg-card` (white) + `border` (`neutral-200`) + `shadow-xs` + `rounded-xl` (12px). Soft, low-elevation, content-forward. This is the *default everywhere*.
- **Plain Card** (`<Card variant="plain">`): no border, `shadow-sm`. Used over textured / darker surfaces where the border would compete.
- **Glass Card** (home-page only): `bg-white/75` + `backdrop-blur-xl` + `border-white/40` + `shadow-glass` (`0 8px 30px rgba(15,30,80,0.08)`) + `rounded-2xl`. Used **only** when floating over the sky background.

### Borders & radii

- Borders are **`neutral-200`** everywhere, hairline (1px). Border-hover bumps to `neutral-300`. Never thicker borders, never colored borders except on focus / aria-invalid / status pills.
- Radii: **`12px` base**. `--radius-sm` 4px (chips, code spans). `--radius-md` 6px (input groups). `--radius-lg` 8px (form-mode buttons, table cells). `--radius-xl` 12px (cards, popovers). `--radius-2xl` 16px (glass cards). `--radius-full` (pills — buttons default to `shape: "pill"`).

### Shadows

- Shadows are **soft and low-elevation by default**. The system leans on borders + tinted surfaces, not drop-shadow.
- `--shadow-xs` is the default card shadow. `--shadow-sm` is the next step up (`plain` cards, dropdown menus). `--shadow-md` / `lg` / `xl` reserved for modals, popovers, hover lifts.
- `--shadow-glass` (`0 8px 30px rgba(15,30,80,0.08)`) — the blue-tinted home glass card shadow.
- `--shadow-hero` (`0 10px 40px -12px rgba(15,30,80,0.25)`) — the home composer / MIA chat input.

### Focus / hover / press

- **Focus:** the design system has a strong focus story — `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`. That's a 3px blue ring (`#0073ff` at 50% alpha) plus the same blue as a border. Always visible, never disabled.
- **Hover (buttons):** primary darkens to `--primary-hover` (`blue-7`). Outline / ghost get `bg-muted text-foreground`. Links underline (`hover:underline`).
- **Press:** buttons translate down 1px (`active:translate-y-px`) — except aria-haspopup. Primary darkens to `--primary-active` (`blue-8`).
- **Hover (cards):** very subtle — `hover:bg-white/90` on glass cards; nothing on default cards unless they are actionable, then `hover:bg-muted/50`.

### Motion

- **Durations:** `100ms` (instant feedback), `200ms` (default — color / opacity / transform), `300ms` (panel slide-out, overlay enter), `500ms` (large layout reflows).
- **Easing:** default `cubic-bezier(0.4, 0, 0.2, 1)`. Use `--ease-spring` for menus / popovers; `--ease-out` for entrances.
- **Used:** color / background-color / border / opacity / transform fades. Bounces only on the home sky drifts (28s `ease-in-out infinite alternate`). No parallax. No scroll-jacking.
- **Avoid:** snappy interactions on routine UI; no jiggling icons; no `framer-motion`-style stagger choreography on dashboards.

### Transparency & blur

- `backdrop-blur-xl` only on the home glass cards (over sky) and on the home suggestion chips. Anywhere else, blur is unnecessary — surfaces are flat.
- `bg-foreground/20` as the mobile sidebar scrim. `bg-white/[0.06]` as the dark-sidebar hover. Use alpha sparingly and always with intent.

### Imagery vibe

- Photography (when it appears in marketing / share-panels) is **warm and natural** — Brazilian residential interiors, sunlit. Not corporate stock. Slightly desaturated, never high-contrast.
- The home sky is the only consistent "imagery" inside the product, and it's procedural CSS — not an image.

### Layout rules

- **Fixed top bar (`h-12 / h-14`).** Sidebar is fixed-position on the left, collapses to a 56px rail on smaller widths, hidden on mobile (slide-over).
- Page content gets max-width on dashboards (`max-w-6xl`) but stretches edge-to-edge on Talk / Pipeline (heavy data surfaces).
- **Tables are dense.** 40–48px row heights, 14px text, `text-foreground` on key columns and `text-muted-foreground` on metadata.

---

## ICONOGRAPHY

- **Icon set: `@tabler/icons-react`.** ~6000 icons, stroke-based, 24×24 default canvas with `stroke-width="2"`. The Niemeyer ESLint plugin **forbids** `lucide-react`, `react-icons`, and any other set — `@tabler/icons-react` is the single source.
- In Tailwind utility space, icons inside Niemeyer primitives are sized via `[&_svg:not([class*='size-'])]:size-4` (16px default, 12px on `xs` buttons, 24px on `lg`). When you want a specific size, drop `size-N` directly on the icon.
- **Logo & brand marks** are SVGs in `assets/logos/`. Available variants:
  - `icon-blue.svg` — full color icon (blue circle, white "M") on transparent. Default mark.
  - `icon-dark.svg` — single-color dark on transparent. Use on light brand surfaces.
  - `icon-white.svg` / `icon-reversed.svg` — white versions. Use on color / photo backgrounds.
  - `logo-blue.svg` — full horizontal wordmark, blue.
  - `logo-color.svg` / `logo-color-alt.svg` — wordmark with the blue "M" mark to the right.
  - `logo-mono-dark.svg` — monochrome dark wordmark.
  - `logo-white.svg` — monochrome white wordmark.
  - `favicon.png` — 32×32 PNG favicon.
- **A React `<BrandIcon>` component** is also available at `components/brand/icon.tsx` — inline SVG, takes `size` prop, defaults to 30px. Use this in code when the asset needs to scale crisply or accept className overrides.
- **Emoji** — see Content Fundamentals: not used. Status pills use a Tabler icon + label, not an emoji.
- **Unicode glyphs** — not used as decoration. The only unicode "icons" that appear are list bullets (`•`) and the en-dash (`–`) in metadata strings.

---

## Substitutions & flags

> The following choices substitute for missing source assets. **Flag to the user when this matters** — replace these with the brand-issued files before shipping.

- **Fonts** — Outfit, Lato, JetBrains Mono are loaded **from Google Fonts via `<link>` import** in `colors_and_type.css`. The source repo references the families by name only and lets the consuming app supply the files. If you need TTF/WOFF2 for offline use or a CSP-restricted environment, ask the user to drop them in `fonts/`.
- **Icons** — we link `@tabler/icons` directly from `@tabler/icons` package or via inline SVG in JSX components. For static HTML where adding a package isn't possible, use the **Tabler CDN** `https://unpkg.com/@tabler/icons@latest/icons/<name>.svg` (each icon is its own file) or substitute with **Lucide** — Tabler is a Lucide fork with very close stroke geometry, so the visual swap is near-invisible. Flag the swap.

---

## Index — what to read first

If you arrived here as an agent:

1. Read **`SKILL.md`** (top-level instructions for invoking this as an Agent Skill).
2. Skim this README — especially **CONTENT FUNDAMENTALS** and **VISUAL FOUNDATIONS** above.
3. Open **`colors_and_type.css`** — load this into any static HTML artifact to get the full token system.
4. Pick a UI kit to compose from:
   - **`ui_kits/morada-platform/`** — the platform (home, sidebar, top bar, KPI grid, glass surfaces). See its README.
   - **`ui_kits/painel-corretores/`** — the brokers panel (analytics dashboard with broker table).
5. Lift logos from **`assets/logos/`** — never redraw them.
6. For deeper production work, open **`components/`** (the actual React/TSX source for primitives + blocks + brand).
7. The **`tokens/`** and **`styles/`** folders are the canonical source from `@morada-ai/niemeyer` — read them when you need exact dark-mode values, the Tailwind 4 `@theme` block, or third-party compat overrides.
