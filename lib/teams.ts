export const TEAM_OPTIONS = [
  "suporte",
  "cs",
  "onboarding",
  "produto",
  "marketing_produto",
  "marketing",
  "vendas",
  "tecnologia",
  "rh",
  "financeiro",
  "cfo",
] as const;

export type Team = (typeof TEAM_OPTIONS)[number];

export const TEAM_LABELS: Record<Team, string> = {
  suporte: "Suporte",
  cs: "CS",
  onboarding: "Onboarding",
  produto: "Produto",
  marketing_produto: "Marketing de Produto",
  marketing: "Marketing",
  vendas: "Comercial",
  tecnologia: "Tecnologia",
  rh: "RH",
  financeiro: "Financeiro",
  cfo: "CFO",
};

export function isValidTeam(value: string): value is Team {
  return (TEAM_OPTIONS as readonly string[]).includes(value);
}
