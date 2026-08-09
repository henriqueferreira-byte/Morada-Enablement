"use client";

import { useEffect, useState } from "react";
import {
  IconFlame,
  IconLayoutSidebar,
  IconSearch,
  IconUserCircle,
} from "@tabler/icons-react";
import { Button } from "@/niemeyer/components";
import { markOnboarded } from "@/lib/actions/profile";

type Step = {
  selector: string;
  icon: typeof IconSearch;
  title: string;
  description: string;
  placement: "right" | "bottom";
};

const STEPS: Step[] = [
  {
    selector: '[data-tour="nav-links"]',
    icon: IconLayoutSidebar,
    title: "Navegue pelo hub",
    description: "Home, Trilhas, Materiais e Meu progresso ficam sempre aqui, junto com os módulos.",
    placement: "right",
  },
  {
    selector: '[data-tour="search"]',
    icon: IconSearch,
    title: "Busque rápido",
    description: "Procure por aula, trilha ou material direto por aqui, de qualquer tela.",
    placement: "bottom",
  },
  {
    selector: '[data-tour="streak"]',
    icon: IconFlame,
    title: "Sua ofensiva",
    description: "Dias úteis seguidos estudando pelo menos 1 aula. Fim de semana não conta contra você.",
    placement: "bottom",
  },
  {
    selector: '[data-tour="avatar"]',
    icon: IconUserCircle,
    title: "Seu perfil",
    description: "Veja seus dados, escolha seu time e saia da conta por aqui.",
    placement: "bottom",
  },
];

export function OnboardingTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (open) setStepIndex(0);
  }, [open]);

  const step = STEPS[stepIndex];

  useEffect(() => {
    if (!open || !step) return;

    function updateRect() {
      const el = document.querySelector(step!.selector);
      const box = el?.getBoundingClientRect();
      setRect(box && box.width > 0 ? box : null);
    }

    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [open, step]);

  if (!open || !step) return null;

  function finish() {
    onClose();
    void markOnboarded();
  }

  function next() {
    if (stepIndex === STEPS.length - 1) finish();
    else setStepIndex((i) => i + 1);
  }

  const Icon = step.icon;
  const tooltipWidth = 300;
  const tooltipStyle = rect
    ? step.placement === "right"
      ? {
          top: Math.min(rect.top, window.innerHeight - 240),
          left: Math.min(rect.right + 14, window.innerWidth - tooltipWidth - 12),
        }
      : {
          top: rect.bottom + 14,
          left: Math.min(Math.max(12, rect.left), window.innerWidth - tooltipWidth - 12),
        }
    : { top: 88, left: 24 };

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-foreground/15"
        onClick={finish}
        role="presentation"
      />
      {rect && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[101] rounded-lg ring-2 ring-primary ring-offset-2 transition-all duration-200"
          style={{ top: rect.top - 4, left: rect.left - 4, width: rect.width + 8, height: rect.height + 8 }}
        />
      )}
      <div
        role="dialog"
        aria-label="Tour de boas-vindas"
        className="fixed z-[102] flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-xl transition-all duration-200"
        style={{ ...tooltipStyle, width: tooltipWidth }}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">
              {stepIndex + 1} de {STEPS.length}
            </p>
            <p className="truncate font-heading text-sm font-semibold text-foreground">{step.title}</p>
          </div>
        </div>
        <p className="text-[13px] text-neutral-600">{step.description}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={`h-1.5 rounded-full transition-all ${
                  i === stepIndex ? "w-4 bg-primary" : "w-1.5 bg-neutral-200"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={finish}>
              Pular
            </Button>
            <Button size="sm" onClick={next}>
              {stepIndex === STEPS.length - 1 ? "Concluir" : "Próximo"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
