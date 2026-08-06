-- Catalog seed — lifted from the prototype's TRILHAS / NOVIDADES / PRODUTOS_MAT
-- (design-reference/Hub de Enablement.dc.html). Placeholder content per
-- CLAUDE_CODE_PROMPT.md: "content is plausible placeholder copy... treat as
-- seed data, not spec." Run via `supabase db reset` (applies migrations then
-- this file) or `psql -f supabase/seed.sql` against an already-migrated db.

-- ── Products (trilha "módulos" + materials top level) ───────────────────────

insert into products (id, name, accent, description, position) values
  ('vendas', 'Morada Vendas', '#0073ff', 'Materiais de pipeline, filas, MIA na qualificação e tudo que vai para a mesa do cliente.', 1),
  ('relacionamento', 'Morada Relacionamento', '#02cfff', 'Materiais de atendimento no Talk, campanhas, reengajamento e retenção.', 2),
  ('institucional', 'Institucional', '#f7b87d', 'Marca, apresentação da empresa e comunicação de roadmap e releases.', 3),
  ('transversal', 'Transversal', '#f7b87d', 'Onboarding geral, para quem entra na empresa em qualquer time.', 4);

-- ── Features (materials folders) ────────────────────────────────────────────

insert into features (id, product_id, name, description, position) values
  ('vendas:filas', 'vendas', 'Filas e distribuição', 'Round-robin, pesos por corretor e regras de repasse.', 1),
  ('vendas:negocios', 'vendas', 'Negócios e pipeline', 'Etapas, cards de negócio e leitura de funil.', 2),
  ('vendas:mia', 'vendas', 'MIA na qualificação', 'Roteiro da MIA, transição para o corretor e objeções sobre IA.', 3),
  ('vendas:propostas', 'vendas', 'Pitch e propostas', 'Pitch institucional, planos e modelo de proposta.', 4),
  ('relacionamento:talk', 'relacionamento', 'Talk e atendimento', 'Inbox, supervisão e qualidade de atendimento.', 1),
  ('relacionamento:campanhas', 'relacionamento', 'Campanhas e reengajamento', 'Réguas, janelas de envio e reativação de base.', 2),
  ('relacionamento:retencao', 'relacionamento', 'Retenção e pós-venda', 'Handoff, reunião de resultado e risco de churn.', 3),
  ('institucional:marca', 'institucional', 'Marca e apresentação', 'Logo, deck institucional e apresentação da empresa.', 1),
  ('institucional:roadmap', 'institucional', 'Roadmap e releases', 'O que vem por aí e o histórico do que já subiu.', 2);

-- ── Materials ────────────────────────────────────────────────────────────────

insert into materials (feature_id, title, description, ext, format, external_url, created_at, updated_at) values
  ('vendas:filas', 'Release de agosto: peso por corretor', '12 slides com o que muda na configuração e o roteiro de comunicação.', 'PPTX', 'Apresentação', 'https://drive.google.com/placeholder-release-agosto', now() - interval '2 days', now() - interval '2 days'),
  ('vendas:filas', 'One-pager de filas', 'Uma página para enviar depois da reunião de configuração.', 'PDF', 'PDF', 'https://drive.google.com/placeholder-onepager-filas', now() - interval '7 days', now() - interval '7 days'),
  ('vendas:filas', 'Simulador de distribuição', 'Planilha para estimar volume por corretor antes de ativar a fila.', 'XLSX', 'Planilha', 'https://drive.google.com/placeholder-simulador', now() - interval '21 days', now() - interval '21 days'),
  ('vendas:negocios', 'Deck comercial — pipeline', '18 slides, versão para incorporadoras.', 'PPTX', 'Apresentação', 'https://drive.google.com/placeholder-deck-pipeline', now() - interval '5 days', now() - interval '5 days'),
  ('vendas:negocios', 'One-pager Morada Vendas', 'Resumo do módulo para envio pós-primeira conversa.', 'PDF', 'PDF', 'https://drive.google.com/placeholder-onepager-vendas', now() - interval '7 days', now() - interval '7 days'),
  ('vendas:negocios', 'Roteiro de demo tela por tela', 'O que falar em cada tela e o que não abrir na demo.', 'PDF', 'PDF', 'https://drive.google.com/placeholder-roteiro-demo', now() - interval '14 days', now() - interval '14 days'),
  ('vendas:mia', 'Release: MIA com resumo de conversa', 'Novidade da última release, com prints e antes/depois.', 'PPTX', 'Apresentação', 'https://drive.google.com/placeholder-mia-resumo', now() - interval '2 days', now() - interval '2 days'),
  ('vendas:mia', 'Script: transição MIA → corretor', 'Mensagens prontas para assumir a conversa sem atrito.', 'DOCX', 'Documento', 'https://drive.google.com/placeholder-script-transicao', now() - interval '6 days', now() - interval '6 days'),
  ('vendas:mia', 'FAQ de objeções sobre IA', 'As 8 perguntas mais comuns e as respostas aprovadas.', 'PDF', 'PDF', 'https://drive.google.com/placeholder-faq-ia', now() - interval '21 days', now() - interval '21 days'),
  ('vendas:propostas', 'Deck institucional 2026', 'Apresentação padrão de primeira reunião.', 'PPTX', 'Apresentação', 'https://drive.google.com/placeholder-deck-institucional', now() - interval '5 days', now() - interval '5 days'),
  ('vendas:propostas', 'Tabela de planos e limites', 'Planos vigentes, limites de uso e regras de desconto.', 'XLSX', 'Planilha', 'https://drive.google.com/placeholder-tabela-planos', now() - interval '3 days', now() - interval '3 days'),
  ('vendas:propostas', 'Modelo de proposta comercial', 'Escopo, prazo de implantação e condições.', 'DOCX', 'Documento', 'https://drive.google.com/placeholder-modelo-proposta', now() - interval '7 days', now() - interval '7 days'),
  ('relacionamento:talk', 'Release: resumo automático do atendimento', 'O que muda para o supervisor, com prints da tela nova.', 'PPTX', 'Apresentação', 'https://drive.google.com/placeholder-release-resumo', now() - interval '2 days', now() - interval '2 days'),
  ('relacionamento:talk', 'One-pager Morada Relacionamento', 'Uma página com foco em atendimento e supervisão.', 'PDF', 'PDF', 'https://drive.google.com/placeholder-onepager-relacionamento', now() - interval '7 days', now() - interval '7 days'),
  ('relacionamento:talk', 'Guia de supervisão de filas', 'Rotina diária sugerida para o supervisor do Talk.', 'PDF', 'PDF', 'https://drive.google.com/placeholder-guia-supervisao', now() - interval '14 days', now() - interval '14 days'),
  ('relacionamento:campanhas', 'Régua de reengajamento', 'Cadência, mensagens e critérios de saída da régua.', 'LINK', 'Drive', 'https://drive.google.com/placeholder-regua-reengajamento', now() - interval '4 days', now() - interval '4 days'),
  ('relacionamento:campanhas', 'Deck de campanhas para o cliente', 'Como apresentar o módulo de campanhas em reunião.', 'PPTX', 'Apresentação', 'https://drive.google.com/placeholder-deck-campanhas', now() - interval '14 days', now() - interval '14 days'),
  ('relacionamento:campanhas', 'Limites de envio do WhatsApp', 'O que pode e o que não pode dentro da janela de 24h.', 'LINK', 'Notion', 'https://notion.so/placeholder-limites-whatsapp', now() - interval '30 days', now() - interval '30 days'),
  ('relacionamento:retencao', 'Roteiro de reunião de resultado', 'Pauta de 30 minutos com os indicadores que o cliente espera.', 'DOCX', 'Documento', 'https://drive.google.com/placeholder-roteiro-reuniao', now() - interval '7 days', now() - interval '7 days'),
  ('relacionamento:retencao', 'Playbook de risco de churn', 'Sinais, prazos de ação e quem acionar em cada caso.', 'PDF', 'PDF', 'https://drive.google.com/placeholder-playbook-churn', now() - interval '21 days', now() - interval '21 days'),
  ('relacionamento:retencao', 'Cases e números por segmento', 'Resultados aprovados para citar, com cliente e período.', 'LINK', 'Notion', 'https://notion.so/placeholder-cases-numeros', now() - interval '4 days', now() - interval '4 days'),
  ('institucional:marca', 'Kit de marca Morada', 'Logos, cores e regras de uso da marca.', 'LINK', 'Drive', 'https://drive.google.com/placeholder-kit-marca', now() - interval '14 days', now() - interval '14 days'),
  ('institucional:marca', 'Apresentação da empresa', 'Quem somos, números e clientes — versão para cliente.', 'PDF', 'PDF', 'https://drive.google.com/placeholder-apresentacao-empresa', now() - interval '21 days', now() - interval '21 days'),
  ('institucional:roadmap', 'Release notes de agosto', 'Consolidado das novidades do mês nos dois produtos.', 'PPTX', 'Apresentação', 'https://drive.google.com/placeholder-release-notes', now() - interval '2 days', now() - interval '2 days'),
  ('institucional:roadmap', 'Roadmap trimestral — visão cliente', 'Versão aprovada para reunião de resultado, sem datas firmes.', 'PDF', 'PDF', 'https://drive.google.com/placeholder-roadmap-trimestral', now() - interval '7 days', now() - interval '7 days'),
  ('institucional:roadmap', 'Calendário de releases', 'Datas previstas e responsáveis por comunicar cada release.', 'LINK', 'Notion', 'https://notion.so/placeholder-calendario-releases', now() - interval '7 days', now() - interval '7 days');

-- ── Tracks ───────────────────────────────────────────────────────────────────

insert into tracks (id, product_id, title, description, level, audience, owner_name, owner_role, position, updated_at) values
  ('v1', 'vendas', 'Fundamentos do Morada Vendas', 'O caminho completo do lead até o negócio fechado dentro do módulo Vendas.', 'Essencial', 'SDRs e closers nos primeiros 30 dias, e quem faz demo do módulo.', 'Rafael Lima', 'Enablement · Vendas', 1, now() - interval '3 days'),
  ('v2', 'vendas', 'Filas e distribuição de leads', 'Round-robin, pesos por corretor e o que fazer quando a fila estoura no fim do dia.', 'Intermediário', 'Gestores de vendas e quem configura filas para o cliente.', 'Rafael Lima', 'Enablement · Vendas', 2, now() - interval '7 days'),
  ('v3', 'vendas', 'MIA na qualificação', 'O que a MIA pergunta, como ajustar o roteiro e o momento certo de assumir a conversa.', 'Intermediário', 'SDRs, closers e times de pré-venda.', 'Suzane Alves', 'Enablement · Produto', 3, now() - interval '2 days'),
  ('v4', 'vendas', 'Pitch e objeções', 'Pitch de 3 minutos, as objeções mais comuns e uma simulação gravada para treinar.', 'Avançado', 'Closers e gerentes comerciais.', 'Camila Rocha', 'Head de Vendas', 4, now() - interval '2 days'),
  ('r1', 'relacionamento', 'Fundamentos do Morada Relacionamento', 'Atendimento, conversa e supervisão no Talk — a base para quem cuida do cliente.', 'Essencial', 'CS, suporte e implantação nos primeiros 30 dias.', 'Bruno Teixeira', 'Enablement · CS', 1, now() - interval '5 days'),
  ('r2', 'relacionamento', 'Campanhas e reengajamento', 'Como montar uma campanha de reativação sem esbarrar nos limites do WhatsApp.', 'Intermediário', 'CS, marketing e quem opera campanhas do cliente.', 'Bruno Teixeira', 'Enablement · CS', 2, now() - interval '4 days'),
  ('r3', 'relacionamento', 'Pós-venda e retenção', 'Do handoff de vendas para o CS até a leitura dos sinais de risco de churn.', 'Avançado', 'CS, suporte e lideranças de conta.', 'Marina Duarte', 'Head de CS', 3, now() - interval '14 days'),
  ('t1', 'transversal', 'Onboarding Morada: primeira semana', 'Quem é a Morada, o que vendemos e como andar pela plataforma sem se perder.', 'Essencial', 'Todo mundo que entra na empresa, em qualquer time.', 'Suzane Alves', 'Enablement · Produto', 1, now() - interval '14 days');

-- ── Lessons ──────────────────────────────────────────────────────────────────
-- published_at: the five lessons called out in the prototype's NOVIDADES feed
-- get a recent timestamp (drives "Novidades no hub" + the NOVO badge, <= 7
-- days); everything else is older, established content.

insert into lessons (track_id, position, title, kind, duration_min, source_label, published_at) values
  ('v1', 1, 'Visão geral do módulo Vendas', 'video', 6, 'Gravação interna', now() - interval '45 days'),
  ('v1', 2, 'Como o lead entra na Morada', 'artigo', 4, 'Base de conhecimento', now() - interval '45 days'),
  ('v1', 3, 'Anatomia do card de negócio', 'video', 8, 'Gravação interna', now() - interval '45 days'),
  ('v1', 4, 'Etapas do pipeline padrão', 'deck', 5, 'Deck de produto', now() - interval '45 days'),
  ('v1', 5, 'Quiz: fundamentos de Vendas', 'quiz', 3, '8 perguntas', now() - interval '45 days'),

  ('v2', 1, 'Como funciona o round-robin', 'video', 7, 'Gravação interna', now() - interval '40 days'),
  ('v2', 2, 'Configurando pesos por corretor', 'artigo', 6, 'Base de conhecimento', now() - interval '40 days'),
  ('v2', 3, 'Playbook: fila cheia no fim do dia', 'template', 4, 'Drive', now() - interval '40 days'),
  ('v2', 4, 'Quiz: filas', 'quiz', 3, '6 perguntas', now() - interval '7 days'),

  ('v3', 1, 'O que a MIA pergunta e por quê', 'video', 9, 'Gravação interna', now() - interval '35 days'),
  ('v3', 2, 'Ajustando o roteiro de qualificação', 'artigo', 7, 'Base de conhecimento', now() - interval '2 days'),
  ('v3', 3, 'Quando assumir a conversa', 'video', 5, 'Gravação interna', now() - interval '35 days'),
  ('v3', 4, 'Script: transição MIA → corretor', 'template', 3, 'Drive', now() - interval '35 days'),

  ('v4', 1, 'Pitch de 3 minutos', 'video', 4, 'Gravação interna', now() - interval '30 days'),
  ('v4', 2, 'As 8 objeções mais comuns', 'deck', 10, 'Deck comercial', now() - interval '30 days'),
  ('v4', 3, 'Simulação gravada: objeção de preço', 'video', 12, 'Gravação interna', now() - interval '2 days'),
  ('v4', 4, 'Quiz: objeções', 'quiz', 4, '10 perguntas', now() - interval '30 days'),

  ('r1', 1, 'Visão geral do módulo Relacionamento', 'video', 6, 'Gravação interna', now() - interval '50 days'),
  ('r1', 2, 'Atendimento x conversa: o que muda', 'artigo', 5, 'Base de conhecimento', now() - interval '50 days'),
  ('r1', 3, 'Supervisão de atendimentos no Talk', 'video', 8, 'Gravação interna', now() - interval '50 days'),
  ('r1', 4, 'Indicadores que o CS acompanha', 'deck', 6, 'Deck de produto', now() - interval '5 days'),
  ('r1', 5, 'Quiz: fundamentos de Relacionamento', 'quiz', 3, '8 perguntas', now() - interval '50 days'),

  ('r2', 1, 'Montando uma campanha de reativação', 'video', 10, 'Gravação interna', now() - interval '25 days'),
  ('r2', 2, 'Boas práticas de janela de 24h', 'artigo', 5, 'Base de conhecimento', now() - interval '25 days'),
  ('r2', 3, 'Template: régua de reengajamento', 'template', 4, 'Drive', now() - interval '4 days'),
  ('r2', 4, 'Limites de envio do WhatsApp', 'link', 3, 'Central de ajuda', now() - interval '25 days'),

  ('r3', 1, 'Handoff de vendas para CS', 'video', 7, 'Gravação interna', now() - interval '60 days'),
  ('r3', 2, 'Sinais de risco de churn', 'artigo', 6, 'Base de conhecimento', now() - interval '60 days'),
  ('r3', 3, 'Reunião de resultado: roteiro', 'template', 5, 'Drive', now() - interval '60 days'),
  ('r3', 4, 'Quiz: retenção', 'quiz', 3, '6 perguntas', now() - interval '60 days'),

  ('t1', 1, 'Quem é a Morada e o que vendemos', 'video', 8, 'Gravação interna', now() - interval '60 days'),
  ('t1', 2, 'Glossário do produto', 'artigo', 6, 'Base de conhecimento', now() - interval '60 days'),
  ('t1', 3, 'Tour pela plataforma', 'video', 14, 'Gravação interna', now() - interval '60 days'),
  ('t1', 4, 'Rotinas do seu time', 'deck', 5, 'Deck interno', now() - interval '60 days'),
  ('t1', 5, 'Checklist da primeira semana', 'link', 2, 'Notion', now() - interval '60 days');
