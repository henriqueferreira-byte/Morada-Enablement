/* Mock data for the brokers panel UI kit.
 * Mirrors the shape of painel-corretores/src/app/(preview)/corretores/data.ts
 * with fewer rows, just enough to demonstrate the table at fidelity.
 */

const KPI_STATS = [
  { label: "Corretores ativos",   value: "38",    change: "+3",     dir: "up"   },
  { label: "Leads atribuídos",    value: "1.247", change: "+18,4%", dir: "up"   },
  { label: "Taxa de conversão",   value: "12,6%", change: "+1,3%",  dir: "up"   },
  { label: "Visitas no mês",      value: "342",   change: "-8",     dir: "down" },
];

const PERFORMANCE = [
  { mes: "Jan", leads: 980,  visitas: 290, conversoes: 98  },
  { mes: "Fev", leads: 1050, visitas: 310, conversoes: 112 },
  { mes: "Mar", leads: 1120, visitas: 295, conversoes: 108 },
  { mes: "Abr", leads: 1190, visitas: 320, conversoes: 124 },
  { mes: "Mai", leads: 1247, visitas: 342, conversoes: 131 },
];

const REGION_BARS = [
  { name: "Zona Sul",              value: 14 },
  { name: "Centro",                value: 10 },
  { name: "Zona Norte",            value: 8  },
  { name: "Zona Oeste",            value: 7  },
  { name: "Zona Leste",            value: 5  },
];

const SPECIALTY_SEGMENTS = [
  { name: "Residencial", value: 22, color: "var(--chart-1)" },
  { name: "Comercial",   value: 8,  color: "var(--chart-2)" },
  { name: "Lançamento",  value: 5,  color: "var(--chart-3)" },
  { name: "Industrial",  value: 3,  color: "var(--chart-4)" },
];

const CORRETORES = [
  { id: 1, initials: "MS", nome: "Mariana Souza",     especialidade: "Residencial", regiao: "Zona Sul",    imobiliaria: "Morada Prime",     status: "top",            leads: 42, visitas: 18, conversoes: 7,  meta: 84 },
  { id: 2, initials: "RC", nome: "Rafael Carvalho",   especialidade: "Lançamento",  regiao: "Centro",      imobiliaria: "Morada Prime",     status: "top",            leads: 38, visitas: 22, conversoes: 6,  meta: 72 },
  { id: 3, initials: "JS", nome: "Juliana Silva",     especialidade: "Residencial", regiao: "Zona Norte",  imobiliaria: "Rede Imóveis SP",  status: "desenvolvimento",leads: 24, visitas: 11, conversoes: 3,  meta: 58 },
  { id: 4, initials: "AP", nome: "André Pinheiro",    especialidade: "Comercial",   regiao: "Centro",      imobiliaria: "Casa & Cia",       status: "top",            leads: 36, visitas: 19, conversoes: 5,  meta: 78 },
  { id: 5, initials: "CO", nome: "Camila Oliveira",   especialidade: "Residencial", regiao: "Zona Oeste",  imobiliaria: "Imóveis Direto",   status: "desenvolvimento",leads: 19, visitas: 8,  conversoes: 2,  meta: 44 },
  { id: 6, initials: "LF", nome: "Lucas Ferreira",    especialidade: "Industrial",  regiao: "Zona Leste",  imobiliaria: "Morada Prime",     status: "inativo",        leads: 6,  visitas: 1,  conversoes: 0,  meta: 12 },
  { id: 7, initials: "BM", nome: "Beatriz Mendes",    especialidade: "Lançamento",  regiao: "Zona Sul",    imobiliaria: "Rede Imóveis SP",  status: "desenvolvimento",leads: 28, visitas: 14, conversoes: 4,  meta: 62 },
  { id: 8, initials: "TS", nome: "Thiago Santos",     especialidade: "Residencial", regiao: "Centro",      imobiliaria: "Casa & Cia",       status: "top",            leads: 41, visitas: 21, conversoes: 8,  meta: 88 },
];

Object.assign(window, { KPI_STATS, PERFORMANCE, REGION_BARS, SPECIALTY_SEGMENTS, CORRETORES });
