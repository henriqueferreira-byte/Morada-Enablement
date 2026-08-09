export const TEAM_OPTIONS = [
  "suporte",
  "onboarding",
  "produto",
  "marketing_produto",
  "marketing",
  "vendas",
  "tecnologia",
] as const;

export type Team = (typeof TEAM_OPTIONS)[number];

export const TEAM_LABELS: Record<Team, string> = {
  suporte: "Suporte",
  onboarding: "Onboarding",
  produto: "Produto",
  marketing_produto: "Marketing de Produto",
  marketing: "Marketing",
  vendas: "Vendas",
  tecnologia: "Tecnologia",
};

export function isValidTeam(value: string): value is Team {
  return (TEAM_OPTIONS as readonly string[]).includes(value);
}
