# Hub de Enablement — Morada.ai

Plataforma interna de conteúdo para Vendas, CS, Onboarding e Marketing: novidades do produto, trilhas de aprendizado, biblioteca de materiais e progresso por pessoa.

Ver [design-reference/CLAUDE_CODE_PROMPT.md](design-reference/CLAUDE_CODE_PROMPT.md) e [design-reference/README.md](design-reference/README.md) para a spec original (schema, critérios de aceite por tela, plano de build).

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind 4 · design system Niemeyer (vendorizado em `niemeyer/`, sem acesso ao registry `@morada-ai/niemeyer` — ver nota abaixo) · `@tabler/icons-react` · Supabase (Auth, Postgres, Storage) · Vercel.

**Nota sobre o Niemeyer:** o pacote `@morada-ai/niemeyer` é privado e este projeto não tinha acesso ao registry. O snapshot de componentes/tokens fornecido foi copiado para `niemeyer/` e importado localmente (`@/niemeyer/components`) em vez de instalado via `pnpm add`. Dois arquivos que o snapshot referenciava mas não incluía (`ScrollArea`, usado pelo `Dialog`; o wrapper do `sonner` para toasts) foram escritos localmente em `niemeyer/components/ui/`. Quatro componentes que a spec original citava (`DataTable`, `KpiCard`, `FileUploader`, `Wizard`) também não existiam no snapshot — foram construídos como componentes do próprio app em `components/` (não como parte do design system), compondo os primitivos existentes (`Table`, `Card`, `Progress`, etc.).

## Rodando local

```bash
pnpm install
cp .env.example .env.local   # preencha as variáveis abaixo
pnpm dev
```

Abre em `http://localhost:3000`.

### 1. Projeto Supabase

Crie um projeto em [supabase.com](https://supabase.com/dashboard) (ou use um existente) e, no **SQL Editor**, rode em ordem:

1. `supabase/migrations/0001_init.sql` — schema, RLS, trigger `auth.users → profiles`.
2. `supabase/migrations/0002_storage.sql` — RLS do Storage (veja o passo 2 abaixo antes de rodar este).
3. `supabase/migrations/0003_gerenciar.sql` — `status`/`is_highlight`/`created_by` em `lessons`.
4. `supabase/seed.sql` — catálogo inicial (produtos, features, trilhas, aulas, materiais), copiado do protótipo `Hub de Enablement.dc.html`. Conteúdo placeholder — troque pelos títulos/links reais quando o time de enablement definir o catálogo.

### 2. Storage

Crie o bucket **privado** `hub-materials` (Storage → New bucket → Public = off) antes de rodar `0002_storage.sql`, que depende dele existir. Pelo dashboard ou via script:

```js
const { createClient } = require("@supabase/supabase-js");
createClient(SUPABASE_URL, SERVICE_ROLE_KEY).storage.createBucket("hub-materials", { public: false });
```

O limite de tamanho por arquivo do bucket segue o limite global do projeto (Storage → Settings). A cópia da tela "Gerenciar" anuncia "até 200 MB" — no plano gratuito do Supabase esse teto costuma ser menor; ajuste em Storage → Settings ou no bucket se precisar dos 200 MB reais.

### 3. Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com) → Credentials → OAuth Client ID (tipo **Web**). Redirect URI: `https://<seu-projeto>.supabase.co/auth/v1/callback`.
2. Supabase → **Authentication → Providers → Google**: cole Client ID e Secret, habilite.
3. Supabase → **Authentication → URL Configuration**: adicione a URL de produção (Vercel) e `http://localhost:3000` em Redirect URLs.

### 4. Variáveis de ambiente

```
NEXT_PUBLIC_SUPABASE_URL=          # Project Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Project Settings → API → anon/publishable key
SUPABASE_SERVICE_ROLE_KEY=         # Project Settings → API → service_role/secret key — nunca expor no client
ALLOWED_EMAIL_DOMAIN=morada.ai
SLACK_WEBHOOK_URL=                 # opcional — aviso de publicação em Gerenciar
```

### 5. Primeiro admin

Ninguém nasce admin. Faça login pelo menos uma vez com a conta que deve administrar o hub (isso cria a `profile` via trigger), depois:

```sql
update profiles set role = 'admin' where email = 'seu-email@morada.ai';
```

## Deploy (Vercel)

1. Importe o repositório em [vercel.com/new](https://vercel.com/new).
2. Configure as mesmas variáveis de ambiente do passo 4 (Production + Preview).
3. Deploy. Depois, adicione a URL de produção em Supabase → Authentication → URL Configuration (redirect URLs) — sem isso o login quebra em produção.

## Estrutura

```
app/(auth)/login          Login
app/(app)/                Home, Trilhas, Materiais, Progresso, Gerenciar (AppShell)
app/auth/callback         Troca do code OAuth por sessão + gate de domínio
proxy.ts                  Gate de sessão + domínio em toda rota fora de /login e /auth (Next 16 renomeou middleware → proxy)
lib/auth.ts               requireUser() / requireAdmin() — usados em toda página server
lib/queries/               Leituras (catálogo, progresso, materiais, streak, gerenciar)
lib/actions/                Server actions (progresso, feedback, materiais, gerenciar, auth)
niemeyer/                  Design system vendorizado (não editar como se fosse código do app)
components/                Composições do app sobre o Niemeyer
supabase/migrations/       Schema + RLS, em ordem
supabase/seed.sql          Catálogo placeholder
design-reference/          Spec original, prototype HTML, UI kits — só referência, não é build
```

## O que não foi construído (por escopo, dia 1)

Editor de quiz, player de vídeo próprio, certificado em PDF, versionamento de material, notificação por e-mail, comentários entre colegas, dark mode, app mobile — ver `design-reference/CLAUDE_CODE_PROMPT.md` §7.

Duração das aulas criadas via Gerenciar fica `0 min` (não há campo de duração no formulário, só no upload/link); o tipo de conteúdo (vídeo/artigo/deck/template/link) é inferido pela extensão do arquivo ou pelo domínio do link, já que o formulário não pergunta isso explicitamente.

## QA

Checklist completo em `design-reference/CLAUDE_CODE_PROMPT.md` §6. Testado manualmente contra um projeto Supabase real durante o desenvolvimento (login, conclusão de aula + avaliação, upload real no Storage, publicação de material/aula, KPIs de progresso) — sem suíte automatizada.
