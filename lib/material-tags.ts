export const CONTENT_TYPE_OPTIONS = ["html", "ebook", "video", "apresentacao", "planilha"] as const;
export type ContentTypeTag = (typeof CONTENT_TYPE_OPTIONS)[number];

export const CONTENT_TYPE_LABELS: Record<ContentTypeTag, string> = {
  html: "Material em HTML",
  ebook: "Ebook",
  video: "Vídeo",
  apresentacao: "Apresentação",
  planilha: "Planilha",
};

export const CATEGORY_OPTIONS = ["comercial", "tecnico", "institucional", "onboarding"] as const;
export type CategoryTag = (typeof CATEGORY_OPTIONS)[number];

export const CATEGORY_LABELS: Record<CategoryTag, string> = {
  comercial: "Comercial",
  tecnico: "Técnico",
  institucional: "Institucional",
  onboarding: "Onboarding",
};

export function isValidContentType(value: string): value is ContentTypeTag {
  return (CONTENT_TYPE_OPTIONS as readonly string[]).includes(value);
}

export function isValidCategory(value: string): value is CategoryTag {
  return (CATEGORY_OPTIONS as readonly string[]).includes(value);
}
