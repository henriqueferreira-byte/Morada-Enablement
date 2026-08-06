# Handoff: Hub de Enablement (Morada)

## Overview

Internal enablement hub for the Morada team (Vendas, CS/Suporte, Onboarding/Implantação, Marketing e novos contratados). It centralizes learning content organized in **trilhas** (learning paths) per Morada module, surfaces **what was recently published**, lets a person **resume where they stopped**, and tracks **light gamified progress** (streak + certificates).

Primary goal stated by the stakeholder: **keep the team up to date on what's new in the product**. Everything else (paths, progress) supports that.

Four content views plus the library, desktop-first: **Home**, **Trilhas** (list + filters), **Detalhe da trilha**, **Materiais** (biblioteca de decks e apresentações), **Meu progresso**.

## About the Design Files

The files in this bundle are **design references created in HTML** — a prototype showing intended look and behavior. They are **not production code to copy**. The `.dc.html` file uses a streaming template runtime specific to the design tool (`<x-dc>`, `<sc-for>`, `<sc-if>`, `<x-import>`, `{{ holes }}`) that does not exist in a normal app.

The task is to **recreate these designs in Morada's existing environment**: Next.js + React + Tailwind 4 + `@morada-ai/niemeyer` (shadcn-based primitives) + `@tabler/icons-react`, per the Niemeyer design system. Use the real package components (`Card`, `Button`, `Badge`, `Avatar`, `Progress`, `Tabs`, `DataTable`, `KpiCard`, `AppShell`, `SidebarShell`, `TopBarShell`, `EmptyState`) instead of re-implementing the inline-styled markup in the prototype. The inline styles exist only because the design tool requires them.

## Fidelity

**High-fidelity (hifi).** Colors, type, spacing, radii, and states are final and come from Niemeyer tokens. Recreate pixel-close, but always prefer the token/component from `@morada-ai/niemeyer` over the literal value in the HTML. Content is **plausible placeholder copy** — lesson and trilha titles will be replaced by the real catalog (stakeholder will provide). Treat the content as seed data, not spec.

## Information architecture

```
/login                    Login (Google Workspace @morada.ai)
/hub                      Home
/hub/trilhas              Trilhas list (filters: módulo, status, busca)
/hub/trilhas/[id]         Detalhe da trilha (lesson sequence)
/hub/materiais            Biblioteca: produto → feature → arquivos
/hub/progresso            Meu progresso (KPIs, progress per módulo, certificados, streak)
/hub/gerenciar            Área do admin: subir material/aula + feedback recebido
```

Sidebar nav: **Home · Trilhas · Materiais · Gerenciar** (só admin) **· Meu progresso**, plus a "Módulos" group that deep-links to `/hub/trilhas?modulo=<id>`.

Modules in the prototype:

| id | name | accent |
|---|---|---|
| `vendas` | Morada Vendas | `#0073ff` |
| `relacionamento` | Morada Relacionamento | `#02cfff` |
| `transversal` | Transversal (onboarding geral) | `#f7b87d` |

`transversal` is a proposal for company-wide onboarding content — drop it if the catalog doesn't need it.

## Domain model

```ts
type ContentType = 'video' | 'artigo' | 'deck' | 'quiz' | 'template' | 'link';

type Lesson = {
  id: string;            // `${trilhaId}-${index+1}` in the prototype
  title: string;
  type: ContentType;
  durationMin: number;
  source: string;        // "Gravação interna", "Base de conhecimento", "Drive", "Notion", "8 perguntas"
  url?: string;          // real asset (video, doc, Notion/Drive link)
  publishedAt?: string;  // drives "Novidades no hub"
  isNew?: boolean;
};

type Trilha = {
  id: string;
  moduleId: 'vendas' | 'relacionamento' | 'transversal';
  title: string;
  description: string;
  level: 'Essencial' | 'Intermediário' | 'Avançado';
  audience: string;      // "Para quem é"
  owner: { name: string; role: string };
  updatedAt: string;
  lessons: Lesson[];
};

type UserProgress = {
  completedLessonIds: string[];
  streakDays: number;
  weekDays: boolean[];   // 7 booleans, Seg→Dom
};
```

Content-type → label + Badge tone (Niemeyer `Badge tone`):

| type | label | tone |
|---|---|---|
| video | Vídeo | `primary` |
| artigo | Artigo | `info` |
| deck | Slides | `neutral` |
| quiz | Quiz | `warning` |
| template | Template | `success` |
| link | Link externo | `outline` |

## Derived values (all computed, never stored)

- `done = lessons.filter(l => completed.includes(l.id)).length`
- `pct = Math.round(done / total * 100)`
- `status = pct === 100 ? 'Concluída' : pct > 0 ? 'Em andamento' : 'Não iniciada'` → Badge tone `success` / `primary` / `neutral`
- `nextLesson` = first lesson not completed (drives "Continuar de onde parei" and the trilha CTA `Começar aula N`)
- `duração da trilha` = sum of `durationMin`
- Certificate = trilha with `pct === 100`
- Home "Continue de onde parou" = up to 3 trilhas with `0 < pct < 100` (fallback: first 3 trilhas)
- Home "Recomendado" = first 2 trilhas with `pct === 0`, filtered by the user's team
- "Tempo de estudo" = sum of `durationMin` of completed lessons, rendered `Xh MM`

## Screens

### 1. App shell (all screens)

**Sidebar** — 248px fixed, `background #fff`, `border-right 1px solid var(--neutral-200)`, padding `20px 16px`, sticky full height, internal `gap 28px`.
- Logo `assets/logo-blue.svg`, height 22px, 8px left padding.
- Group label: 11px Outfit 600, uppercase, `letter-spacing .06em`, `--neutral-400`. Copy: "Hub de enablement", "Módulos".
- Nav item: height **40px**, `border-radius 8px`, padding `0 12px`, `gap 10px`, 14px Lato 600, `--neutral-800`, 18px Tabler icon (`home`, `stack-2`, `award`). Hover `background var(--neutral-100)`. **Active**: 3px `--primary` bar pinned to the left edge (`top/bottom 8px`, `border-radius 0 3px 3px 0`). `Trilhas` stays active on the detail route.
- Module item: height 36px, 13px 400, `--neutral-700`, 8px round accent dot in the module color.
- Bottom streak card: `--neutral-50` fill, `1px --neutral-150`, radius 12, padding 14. Title "Ofensiva de {n} dias" (13px Outfit 600), sub "Estude 1 aula por dia para manter." (12px `--neutral-500`), then 7 day chips, `gap 5px`, height 24, radius 6, 10px 700 — done = `--primary` on white text, pending = `--neutral-150` on `--neutral-400`. Labels `Seg Ter Qua Qui Sex Sáb Dom`.

**Top bar** — height **56px**, `rgba(255,255,255,.92)` + `backdrop-filter blur(8px)`, `border-bottom 1px --neutral-200`, sticky, padding `0 24px`, `gap 16px`.
- Search: 340px (max 40%), height 36, pill, `1px --neutral-200` on white, 16px Tabler `search` icon `#8D95A8`, borderless 14px input. Placeholder "Buscar aula, trilha ou template". Typing navigates to Trilhas and filters.
- Right: streak pill (height 28, pill, `rgba(247,184,125,.18)` fill, `rgba(247,184,125,.5)` border, text `#8a4b12`, 12px 700, Tabler `flame` 14px, label "{n} dias"), then "Suzane · Vendas" 13px `--neutral-600`, then `Avatar size=32`.

**Content column** — `max-width 1160px`, centered, padding `24px 24px 56px`, section `gap 28px`.

### 2. Home

**Hero** — radius 16, padding 32, `background linear-gradient(135deg,#00224d 0%,#0058c4 45%,#0aa6f0 100%)`, white text, 2-col grid `1.25fr / 1fr`, `gap 32`. Decorative blurred glow: 420×420 circle, `right -80px / top -160px`, `radial-gradient(circle, rgba(0,255,224,.32), transparent 62%)`, `filter blur(20px)`, animation `28s ease-in-out infinite alternate` translating `-30px,10px` + `scale(1.12)` (this is the Niemeyer "sky drift" motion; `prefers-reduced-motion` should disable it).
- Eyebrow "Hub de enablement · Morada" — 12px Outfit 600 uppercase `letter-spacing .08em`, `rgba(255,255,255,.75)`.
- H1 "Bom dia, {nome}" — Outfit 600, **44px**, `line-height 1.05`, `letter-spacing -.025em`. Greeting is time-aware (Bom dia / Boa tarde / Boa noite).
- Body — 16px, `rgba(255,255,255,.82)`, `max-width 52ch`: "Tudo o que subiu de novo em Morada Vendas e Morada Relacionamento fica aqui. Você tem {n} aulas pendentes nas trilhas que já começou."
- CTAs: `Button` "Continuar de onde parei" (default) + `Button variant="outline"` "Ver todas as trilhas", height 40.
- Right glass card: `rgba(255,255,255,.82)` + `backdrop-blur(18px)` + `1px rgba(255,255,255,.4)` + `box-shadow 0 8px 30px rgba(15,30,80,.18)`, radius 16, padding 20. Eyebrow "Sua semana", then 2×2 grid (`gap 16`) of figures: 28px Outfit 600 + 12px `--neutral-500` caption — aulas concluídas / trilhas em andamento / conteúdos novos / certificados.

**Continue de onde parou** — H2 20px Outfit 600 `letter-spacing -.02em` + "Ver tudo" link (13px 700). 3-col grid, `gap 16`. Card: white, `1px --neutral-200`, radius 12, `shadow-xs`, padding 18, `gap 12`, hover `border-color --neutral-300`, whole card clickable.
Card content: accent dot + module eyebrow (11px 700 uppercase `--neutral-500`) → title 16px Outfit 600 → "Próxima aula: {title}" 13px `--neutral-600` → footer with "{done} de {total} aulas" / bold pct + 6px progress track (`--neutral-150`, fill `--primary`, pill).

**Novidades no hub** (2-col section, `1.5fr / 1fr`, `gap 20`) — the "what's new" feed, newest first. White card, radius 12, rows of `padding 14px 18px` divided by `1px --neutral-100`, hover `--neutral-50`. Row: 3px full-height accent bar in the module color → title 15px Outfit 600 + optional `NOVO` pill (10px 700, `rgba(0,115,255,.1)` fill, `rgba(0,115,255,.25)` border, `--primary` text) → meta 12px `--neutral-500` ("Morada Vendas · publicado há 2 dias por Camila Rocha") → right `Badge shape="chip"` with the content type. Clicking opens the trilha (ideally deep-links to the lesson).

**Right column** — "Recomendado para {time}": 2 compact cards (padding `16px 18px`, module eyebrow, 15px title, "{n} aulas · {n} min"). Then a request card: `--neutral-100` fill, `1px --neutral-150`, radius 12 — "Faltou algum conteúdo?" + "Peça um material novo para o time de enablement — respondemos em até 2 dias." + `Button variant="outline" size="sm"` "Solicitar conteúdo" (wire to a form/Slack webhook).

### 3. Trilhas

- H1 28px Outfit 600 `letter-spacing -.025em` "Trilhas"; sub 14px `--neutral-600`: "{n} trilhas · {n} aulas publicadas no hub".
- Filter chips, height **32**, pill, `gap 8`, wrapping. Inactive: white, `1px --neutral-200`, 13px 400 `--neutral-700`, hover `--neutral-50` + `--neutral-300`. Active: `--primary` fill, white, 700. Two independent groups — module (`Todos os módulos`, `Morada Vendas`, `Morada Relacionamento`, `Transversal`) and status (`Em andamento`, `Concluídas`, `Não iniciadas`, toggled off by re-selecting). Filters combine with the top-bar search (matches trilha title, description and lesson titles). Prefer `FilterGroupDropdown` / `Tabs variant="pill"` from Niemeyer if it fits better in production.
- 2-col card grid, `gap 16`. Card: white, `1px --neutral-200`, radius 12, `shadow-xs`, padding 20, `gap 12`, hover `--neutral-300`, clickable.
  Header row: accent dot + module eyebrow + right-aligned `Badge dot` with status tone. Then title 18px Outfit 600, description 13px `--neutral-600` (`text-wrap: pretty`), meta row 12px `--neutral-500` ("{done} de {total} aulas" · "{n} min" · level), then progress bar (6px) + pct 12px 700.
- Empty state: white, `1px dashed --neutral-200`, radius 12, padding 40, centered — "Nenhuma trilha com esses filtros" / "Limpe a busca ou volte para todos os módulos." / `Button variant="outline" size="sm"` "Limpar filtros". Use Niemeyer `EmptyState`.

### 4. Detalhe da trilha

- Back button: ghost, 13px 700 `--neutral-600`, Tabler `chevron-left` 16px, label "Todas as trilhas", hover `--primary`.
- 2-col grid `1.6fr / 1fr`, `gap 24`, right column `position: sticky; top: 80px`.
- Header: accent dot + module eyebrow → H1 30px Outfit 600 `letter-spacing -.025em` → description 15px `--neutral-600`, `max-width 64ch`.
- Lesson rows (`gap 10`): white, `1px --neutral-200`, radius 12, `shadow-xs`, padding `14px 18px`, `gap 14`, hover `--neutral-300`.
  - Left toggle: 28px circle. Pending = `1px --neutral-200` on white with the index number (12px 700 `--neutral-400`). Done = `--primary` fill with a white 16px check, `stroke-width 3`. In production use Niemeyer `Checkbox` (24px, round) or keep this numbered variant — it doubles as the sequence indicator.
  - Middle: title 15px Outfit 600, meta 12px `--neutral-500` "{n} min · {source}".
  - Right: `Badge shape="chip"` content type + `Button variant="ghost" size="sm"` labelled "Marcar como vista" / "Refazer".
  - Real implementation: the row should open the actual asset (video player, article, deck, quiz, external link) and mark completion on finish; the manual toggle stays as a fallback.
- Right card 1 — "Seu progresso" (14px Outfit 600) + pct 22px Outfit 600 `--primary`, 8px progress track, "{done} de {total} aulas · {n} min de conteúdo", primary `Button` "Começar aula {n}" (or disabled "Trilha concluída").
- Right card 2 — "Para quem é" (13px `--neutral-600`), 1px `--neutral-100` divider, "Responsável" with `Avatar size=32` + name 13px 700 + role 12px `--neutral-500`, divider, "Atualizada há {x}" 12px `--neutral-500`.

### 5. Materiais (biblioteca por produto → feature → arquivos)

A **file-browser hierarchy**, not a flat list. Three levels, one route each:

```
/hub/materiais                            nível 1 — produtos
/hub/materiais/[produto]                  nível 2 — features do produto
/hub/materiais/[produto]/[feature]        nível 3 — arquivos da feature
/hub/materiais?q=...                      busca global (tabela plana, atravessa a hierarquia)
```

```ts
type MaterialFile = {
  id: string; title: string; description: string;
  ext: 'PPTX' | 'PDF' | 'DOCX' | 'XLSX' | 'LINK';
  format: 'Apresentação' | 'PDF' | 'Documento' | 'Planilha' | 'Notion' | 'Drive';
  updatedAt: string; isNew: boolean;
  viewUrl: string; downloadUrl?: string;   // LINK items have no downloadUrl
};
type Feature = { id: string; name: string; description: string; updatedAt: string; files: MaterialFile[] };
type ProdutoMat = { id: string; name: string; accent: string; tint: string; description: string; features: Feature[] };
```

Seed tree in the prototype (`PRODUTOS_MAT`):
- **Morada Vendas** (`#0073ff`) → Filas e distribuição · Negócios e pipeline · MIA na qualificação · Pitch e propostas
- **Morada Relacionamento** (`#02cfff`) → Talk e atendimento · Campanhas e reengajamento · Retenção e pós-venda
- **Institucional** (`#f7b87d`) → Marca e apresentação · Roadmap e releases

**Chrome (all levels)**
- Breadcrumb, 13px `--neutral-500`, `gap 6`, `/` separators in `--neutral-300`: `Materiais / Morada Vendas / Filas e distribuição`. Intermediate crumbs are buttons (hover `--primary`); the last is 700 `--neutral-700`. When searching, a final crumb reads `Busca: {termo}`.
- H1 28px Outfit 600 = current level name (`Materiais` / produto / feature / "Resultados da busca"); sub 14px `--neutral-600` = "Navegue por produto, abra a feature e encontre decks, apresentações e documentos." / "Escolha a feature…" / "{n} arquivos · atualizado há x" / "{n} arquivos encontrados em todos os produtos".
- Right actions: `Button variant="ghost"` **Voltar** (only below root) + `Button variant="outline"` **Solicitar material**.
- No category chips — the hierarchy replaced them. The top-bar search still works and, while in Materiais, switches this view to flat search results across every product/feature.

**Nível 1 — produtos.** 3-col grid, `gap 16`. Card: white, `1px --neutral-200`, radius 12, `shadow-xs`, padding 20, `gap 12`, hover `--neutral-300`, clickable. 36px round well tinted with the product color (`tint`) holding a Tabler `folder` icon in the product accent; `NOVO` pill top-right when any file inside is new; name 18px Outfit 600; description 13px `--neutral-600`; footer 12px `--neutral-500` "{n} features · {n} arquivos".

**Nível 2 — features.** Same 3-col grid, padding 18, `gap 10`. 32px rounded-8 well `rgba(0,115,255,.08)` + `--primary` folder icon, `NOVO` pill, name 16px Outfit 600, description 13px, footer "{n} arquivos · atualizado há x".

**Nível 3 — arquivos.** Niemeyer table: container radius 8, `1px --neutral-200`, `overflow auto`; header 40px with `background rgba(0,115,255,.06)` and 12px 600 `--neutral-900` sentence-case labels — `Arquivo`, `Onde está`, `Formato`, `Atualizado`, actions. Grid `minmax(240px,2.4fr) 200px 110px 120px 180px`, `min-width 900px` (scrolls horizontally on narrow viewports), side padding 16, rows `padding 12px 16px` + `1px --neutral-100` top border, hover `--neutral-50`.
Cells: 34px rounded-8 file well (`rgba(0,115,255,.08)`, `--primary`, JetBrains Mono 10px 700 = extension) + title 14px Outfit 600 + optional `NOVO` pill + description 12px `--neutral-500`; "Onde está" = "{produto} · {feature}" (ellipsis, useful in search results); format and updated 13px `--neutral-600`; right-aligned `Button variant="outline" size="sm"` **Abrir** + `Button variant="ghost" size="sm"` **Baixar** (hide Baixar for `LINK`).
Search with no hits: dashed empty state — "Nenhum arquivo encontrado" / "Limpe a busca para voltar a navegar por produto." / `Button` "Limpar busca".

**Production notes.** Folder tree should come from the CMS/Drive structure so enablement can add a feature folder without a deploy; `Abrir` opens the asset (Drive/Notion/preview), `Baixar` streams the file. Track opens/downloads per file. `isNew` = updated within 7 days. Version history and "quem atualizou" are natural v2 additions. Use Niemeyer `DataTable` for the file table in production.

**Home entry point.** Right-column panel **"Materiais recentes"** with a "Biblioteca" link — up to 3 files with `isNew`; each row (padding `12px 16px`, 32px file well, 13px 700 title, "{produto} · {feature} · {updated}" 11px meta, `NOVO` pill) deep-links straight into that feature folder.

### 6. Meu progresso

- H1 28px + sub "Ofensiva de {n} dias · {done} de {total} aulas concluídas".
- 4-col `KpiCard` grid, `gap 16`, tile height ~132px: **Aulas concluídas** (tone `primary`, delta "+4 nesta semana", subtitle "{n} aulas pendentes"), **Trilhas concluídas** (`success`, delta = em andamento, subtitle "De {n} trilhas publicadas"), **Ofensiva atual** (`warning`, delta "+1 hoje", subtitle "Melhor sequência: 11 dias"), **Tempo de estudo** (`info`, value "Xh MM", delta "+38 min nesta semana", subtitle "Média do time: 3h 05"). Icons: Tabler `check`, `award`, `flame`, `clock`.
- 2-col `1.4fr / 1fr`, `gap 20`.
  - Left "Progresso por módulo": per module, a row of accent dot + name 14px 700 + right "{done}/{total} aulas" 12px `--neutral-500` + pct 13px 700 (44px wide, right aligned), then an 8px track filled **with the module accent**.
  - Right "Certificados": rows of `1px --neutral-150` on `--neutral-50`, radius 8, padding `12px 14px` — 32px round `rgba(0,115,255,.1)` well with `--primary` Tabler `award`, title 13px 700, meta 12px `--neutral-500`. Empty: "Conclua uma trilha inteira para liberar seu primeiro certificado."
  - Right "Ofensiva da semana": 7 chips, height 40, radius 8, `gap 6` (done `--primary`/white, pending `--neutral-100`/`--neutral-400`), caption "Você está a 1 aula de fechar a semana completa.", `Button variant="outline" size="sm"` "Fazer a aula de hoje".

### 0. Login

Standalone screen, no shell. Full-viewport `radial-gradient(at top,#0073ff,#001f3d)`, centered column `max-width 420px`, `gap 24`. White wordmark (`assets/logo-white.svg`, 26px) above a white card (radius 16, padding 32, `box-shadow 0 20px 50px -12px rgba(0,20,60,.45)`, `gap 20`).

- Eyebrow "Hub de enablement" (12px Outfit 600 uppercase `--neutral-500`), H1 "Entrar" 24px Outfit 600, body 14px `--neutral-600`: "Use sua conta Google da Morada para acessar as trilhas, os materiais e o seu progresso."
- Single button, height **48**, pill, white on `1px --neutral-200`, 15px Outfit 600, Tabler `brand-google` icon 20px, label "Entrar com Google". Hover `--neutral-50` + `--neutral-300`.
- Info well (`--neutral-50`, `1px --neutral-150`, radius 8, padding `12px 14px`, info icon 16px): "Acesso restrito a contas **@morada.ai**. Contas pessoais são recusadas no login. Precisa de acesso? Fale com o time de enablement."
- Footer 12px `rgba(255,255,255,.72)`: "Morada.ai · uso interno".
- Error state (not in the prototype, required in production): same card with a destructive Alert — "Use sua conta @morada.ai. Contas pessoais não têm acesso ao hub."
- Auth spec (Google OAuth via Supabase, `hd=morada.ai` + server-side domain assert, middleware, admin gate) is in `CLAUDE_CODE_PROMPT.md` §3.

### 7. Modal de avaliação da aula (fim de aula)

Fires when a lesson is marked done and the user hasn't rated it yet. Overlay `rgba(15,30,80,.35)`, z 40, centered; card `max-width 480px`, white, radius 16, `shadow-xl`, padding 24, `gap 18`.

- Eyebrow "Aula concluída" 12px Outfit 600 uppercase `--primary`; lesson title 18px Outfit 600; trilha name 13px `--neutral-600`.
- "Essa aula te ajudou?" 14px 700 + 5 star buttons, 40×40 hit area, 28px glyph — filled `--primary`, empty `--neutral-300` (hover `--neutral-400`).
- "O que descreve melhor?" + multi-select chips (32px pill, active `--primary`/white 700, inactive white on `--neutral-200`): **Clara e direta · Faltou exemplo prático · Longa demais · Conteúdo desatualizado · Vou usar hoje**.
- Optional textarea, `min-height 80px`, radius 8, `1px --neutral-200`, placeholder "Quer detalhar? O que faltou, o que atualizar (opcional)".
- Footer: privacy note 12px `--neutral-500` "Só o time de enablement vê sua resposta." + `Button variant="ghost"` **Pular** + `Button` **Enviar avaliação**.
- Sending shows a toast: dark pill (height 44, `--neutral-900`, white, 14px 700, check icon), bottom-center, auto-dismiss ~2.8s. Same toast pattern is reused for admin publish.
- Lesson rows carry the aggregate: "6 min · Gravação interna · 4,9 (32 avaliações)"; once you rate, it becomes "você deu 5 de 5". In production, aggregate comes from the `lesson_ratings` view.
- Production: use Niemeyer `Dialog` (Esc + click-outside + focus trap). One feedback row per user/lesson (`unique (user_id, lesson_id)`); "Pular" must not re-prompt in the same session.

### 8. Gerenciar (admin) — subir conteúdo

Route `/hub/gerenciar`, visible only for `role = 'admin'` (404 for everyone else — don't reveal it). H1 28px "Gerenciar conteúdo" + sub "Suba um material para a pasta de uma feature ou publique uma aula em uma trilha. Só o time de enablement vê esta área."

2-col grid `1.5fr / 1fr`, `gap 20`. **Left: form card** (white, radius 12, padding 24, `gap 20`):
1. "O que você está subindo?" → 2 chips: **Material** | **Aula de trilha** (32px pill, same chip spec).
2. Two selects (height 40, radius 8, `1px --neutral-200`): **Produto** and, depending on the kind, **Pasta da feature** (features of that product) or **Trilha** (tracks of that module). Changing the product resets the second select.
3. **Título** input (height 40) — placeholder "Ex: Release de agosto — peso por corretor".
4. **Descrição** textarea (`min-height 72px`) — "Uma linha sobre o que é e quando usar."
5. **Arquivo**: dashed dropzone (`1px dashed --neutral-300`, radius 12, `--neutral-50`, padding 24, hover border `--primary` + `rgba(0,115,255,.04)`) with a 40px round upload well, "Arraste o arquivo ou clique para escolher" 14px 700, "PPTX, PDF, DOCX, XLSX ou MP4 · até 200 MB" 12px `--neutral-500`. Then an "ou" divider and a link input — "Cole um link do Drive, Notion, YouTube ou Loom". Exactly one of the two is required. Use Niemeyer `FileUploader` in production, with real progress and error copy.
6. Three toggles (40×24 pill switch, on = `--primary`, off = `--neutral-200`, 18px white knob) with label 13px 700 + hint 12px `--neutral-500`: **Publicar em Novidades no hub** (default on) · **Avisar o time no Slack** (on) · **Marcar como obrigatório** (off).
7. Footer, divider above: `Button variant="ghost"` **Salvar rascunho** + `Button` **Publicar no hub**. Both show a toast and prepend the item to "Publicados recentemente".

**Right column**, two cards:
- **Publicados recentemente** — rows (`--neutral-50`, `1px --neutral-150`, radius 8) with title 13px 700, "{produto} · {feature ou trilha} · {quando}, por {autor}" 12px meta, and a `Badge shape="chip"` **Publicado** (`success`) / **Rascunho** (`neutral`).
- **Feedback das aulas** — the payoff of the rating modal: rows with "{n} de 5" in `--primary` 13px 700, lesson name 12px `--neutral-500`, the comment 13px `--neutral-700`, and "{time} · {quando}" 11px `--neutral-400`, divided by `1px --neutral-100`. This is what tells enablement what to re-record or update.

## Interactions & behavior

- Sidebar/topbar are persistent; content swaps per route. In the prototype it's a `view` state — in production use real routes so links are shareable.
- Typing in the top-bar search jumps to Trilhas and filters live (debounce ~200ms in production).
- Module chips and status chips filter independently and combine with the query.
- Clicking a card (home continue card, novidade row, trilha card, recomendada card) opens the trilha detail.
- Lesson toggle flips completion and immediately recomputes: trilha pct, home stats, module progress, KPIs, certificates, "next lesson", CTA labels.
- Hero "Continuar de onde parei" and progresso "Fazer a aula de hoje" open the first in-progress trilha (fallback: first not-started).
- Transitions: 200ms `cubic-bezier(0.4,0,0.2,1)` on color/border/background. Only long animation is the 28s hero glow drift. No stagger, no parallax.
- Focus: Niemeyer default — `focus-visible` 3px `--primary/50` ring + primary border. Never removed. Every clickable card must be a real `button`/`a` for keyboard access (the prototype uses `div onClick` — fix that in production).
- Responsive: desktop-first. Below ~1200px go to 2-col grids, below ~900px single column and the sidebar collapses to the 56px rail / slide-over per Niemeyer.

## State management

Prototype state (single component):

```
view: 'home' | 'trilhas' | 'trilha' | 'materiais' | 'progresso'
curId: string          // selected trilha
mod: 'todos' | moduleId
status: 'todos' | 'andamento' | 'concluidas' | 'nao'
matPath: string[]        // [] | [produtoId] | [produtoId, featureId] — Materiais breadcrumb path
signedIn: boolean        // prototype stand-in for the Supabase session
modal / mRating / mTags / mText   // end-of-lesson rating dialog
ratings: Record<lessonId, {stars, tags, text}>
toast: string             // transient confirmation
upKind / upProd / upTarget / upTitle / upDesc / upLink / upFlags / published   // admin form
q: string              // search query
done: string[]         // completed lesson ids, persisted to localStorage key "morada-hub-enablement-v1"
```

Production mapping:
- `view` / `curId` → routes; `mod` / `status` / `q` → URL search params.
- `done`, streak and certificates → server-side per user (`GET /api/hub/progress`, `POST /api/hub/lessons/:id/complete`). Streak = consecutive days with ≥1 completion, computed server-side from completion timestamps.
- Catalog (`trilhas`, `lessons`, `publishedAt`) → CMS or DB, cached; "Novidades" = lessons ordered by `publishedAt desc`, `isNew` = published within 7 days.
- Content assets live outside the app (Drive, Notion, video host) — store URLs, don't upload.
- Admin authoring is **out of scope** for this version (stakeholder deferred it). Seed the catalog by hand or via CMS.

## Design tokens

All from Niemeyer — use the CSS variables / Tailwind theme, not raw hex.

Colors: `--primary #0073ff` (hover `--primary-hover`, active `--primary-active`), cya `#00ffe0`, cyan mid-stop `#02cfff`, orange `#f7b87d`.
Neutrals: `50 #F7F8FA` · `100 #ECEEF3` · `150 #E1E4EA` · `200 #D3D7E0` · `300 #B4BAC8` · `400 #8D95A8` · `500`–`900` per `colors_and_type.css`.
Hero gradient: `linear-gradient(135deg,#00224d,#0058c4 45%,#0aa6f0)`; hero glow `rgba(0,255,224,.32)`.
Status tones: Badge/KpiCard `primary | success | warning | info | neutral | outline` (tinted bg + border + tinted text trio).

Spacing: 4px ladder — 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32. Heights: 24 / 28 / 32 / 36 / 40 / 56.
Radii: 6 (small chips), 8 (`--radius-lg`, nav items, day chips, certificate rows), 12 (`--radius-xl`, cards), 16 (`--radius-2xl`, hero + glass), 9999 (pills, dots, progress).
Shadows: `--shadow-xs` (cards), `0 8px 30px rgba(15,30,80,.18)` (hero glass; the token is `--shadow-glass` at .08 for light surfaces).
Type: Outfit (headings/figures) 44 / 30 / 28 / 22 / 20 / 18 / 16 / 15 / 14 / 13 / 11–12 eyebrow; Lato (body/meta) 16 / 14 / 13 / 12; weights 400 / 600 / 700; eyebrows uppercase `letter-spacing .06em`.

## Assets

- `assets/logo-blue.svg`, `assets/icon-blue.svg` — copied from the Niemeyer design system (`assets/logos/`). Use the brand files already in the codebase; never redraw.
- Icons: the prototype hand-draws Tabler-equivalent paths inline because it can't install packages. In production use `@tabler/icons-react`: `IconHome`, `IconStack2`, `IconAward`, `IconSearch`, `IconFlame`, `IconCheck`, `IconClock`, `IconChevronLeft`, `IconTrendingUp`. **Flag:** the inline paths are approximations — swap them for the real icons.
- Fonts: Outfit + Lato via Google Fonts in the design system's `colors_and_type.css`. Production should self-host / use `next/font`.
- No photography. Avatars are initials fallbacks.

## Files

- `CLAUDE_CODE_PROMPT.md` — **paste-ready prompt + build plan for Claude Code**: stack, env vars, folder structure, Postgres schema, RLS, Google-domain auth, per-screen acceptance criteria, 1-day milestone plan, QA checklist, out-of-scope list.
- `Hub de Enablement.dc.html` — the full prototype (login, five app views, rating modal and admin area, state logic at the bottom in `class Component`, including the seed catalog `TRILHAS`, `NOVIDADES`, `PRODUTOS_MAT`, `TYPES`, `MODULES`).
- `assets/logo-blue.svg`, `assets/icon-blue.svg`, `assets/logo-white.svg` (login) — brand marks used.
- Design system reference: `_ds/niemeyer-morada-ai-design-system-.../` in the design project (tokens, `components.css`, `_ds_bundle.js`) and, canonically, `@morada-ai/niemeyer` + `morada-ai/product-pocs`.

## Open items for the stakeholder

1. Real trilha/lesson titles, material names and the actual asset URLs (current copy is plausible placeholder).
2. Confirm whether the `Transversal` module stays.
3. Who authors content, and whether an admin/CMS surface is needed in v1.
4. Streak rules (does a weekend count? does a quiz count double?) and whether certificates are downloadable.
