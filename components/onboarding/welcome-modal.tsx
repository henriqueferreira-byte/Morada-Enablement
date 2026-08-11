"use client";

import { useState } from "react";
import {
  IconAward,
  IconFolder,
  IconHome,
  IconSettings,
  IconStack2,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Button, Dialog, DialogContent } from "@/niemeyer/components";
import { cn } from "@/lib/utils";

type Slide = {
  icon: typeof IconHome;
  eyebrow: string;
  title: string;
  description: string;
};

const BASE_SLIDES: Slide[] = [
  {
    icon: IconHome,
    eyebrow: "Bem-vindo",
    title: "O Hub de Enablement da Morada",
    description:
      "Um só lugar para o time de Vendas, CS, Onboarding e Marketing ficar por dentro de tudo que muda no produto — trilhas de aprendizado, materiais de apoio e o seu progresso.",
  },
  {
    icon: IconStack2,
    eyebrow: "Trilhas",
    title: "Aprenda no seu ritmo",
    description:
      "Sequências de aulas organizadas por módulo do produto. Marque as aulas como vistas, avalie o conteúdo ao final e receba um certificado ao concluir uma trilha inteira.",
  },
  {
    icon: IconFolder,
    eyebrow: "Materiais",
    title: "A biblioteca do time",
    description:
      "Decks, apresentações, one-pagers e templates organizados por produto e feature. Busque pelo que precisa, abra ou baixe direto daqui.",
  },
  {
    icon: IconAward,
    eyebrow: "Meu progresso",
    title: "Acompanhe sua evolução",
    description:
      "Aulas concluídas, sua ofensiva de dias úteis estudando e os certificados que você já conquistou — tudo num só painel.",
  },
];

const ADMIN_SLIDE: Slide = {
  icon: IconSettings,
  eyebrow: "Gerenciar",
  title: "Publique conteúdo novo",
  description:
    "Suba materiais e aulas, acompanhe o feedback do time sobre as aulas e responda às solicitações de conteúdo — tudo em um único lugar, só para o time de enablement.",
};

const LEADER_SLIDE: Slide = {
  icon: IconUsersGroup,
  eyebrow: "Painel de liderança",
  title: "Acompanhe seu time",
  description:
    "Veja quem do seu time já engajou, quem ainda não começou e trilhas obrigatórias pendentes — tudo num painel só seu.",
};

export function WelcomeModal({
  open,
  isAdmin,
  isLeader,
  onFinish,
}: {
  open: boolean;
  isAdmin: boolean;
  isLeader: boolean;
  onFinish: () => void;
}) {
  const slides = isAdmin ? [...BASE_SLIDES, ADMIN_SLIDE] : isLeader ? [...BASE_SLIDES, LEADER_SLIDE] : BASE_SLIDES;
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  if (!slide) return null;
  const Icon = slide.icon;

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="overflow-hidden sm:max-w-[480px]"
      >
        <div
          className="relative -m-4 mb-0 flex h-40 items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg,#00224d 0%,#0058c4 45%,#0aa6f0 100%)" }}
        >
          <div
            aria-hidden
            className="absolute -right-10 -top-20 size-52 rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(0,255,224,.32), transparent 62%)" }}
          />
          <span className="relative flex size-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
            <Icon className="size-8" />
          </span>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{slide.eyebrow}</span>
          <h2 className="font-heading text-xl font-semibold text-foreground">{slide.title}</h2>
          <p className="text-sm text-neutral-600">{slide.description}</p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-4">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-5 bg-primary" : "w-1.5 bg-neutral-200",
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {index > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setIndex((i) => i - 1)}>
                Voltar
              </Button>
            )}
            <Button size="sm" onClick={() => (isLast ? onFinish() : setIndex((i) => i + 1))}>
              {isLast ? "Vamos começar" : "Próximo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
