"use client";

import { useEffect, useState } from "react";
import { Button } from "@/niemeyer/components";
import { markOnboarded } from "@/lib/actions/profile";

type Step = {
  selector: string;
  title: string;
  description: string;
  placement: "right" | "bottom";
};

const STEPS: Step[] = [
  {
    selector: '[data-tour="nav-links"]',
    title: "Navegue pelo hub",
    description: "Home, Trilhas, Materiais e Meu progresso ficam sempre aqui, junto com os módulos.",
    placement: "right",
  },
  {
    selector: '[data-tour="search"]',
    title: "Busque rápido",
    description: "Procure por aula, trilha ou material direto por aqui, de qualquer tela.",
    placement: "bottom",
  },
  {
    selector: '[data-tour="streak"]',
    title: "Sua ofensiva",
    description: "Dias úteis seguidos estudando pelo menos 1 aula. Fim de semana não conta contra você.",
    placement: "bottom",
  },
  {
    selector: '[data-tour="avatar"]',
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

  const tooltipWidth = 288;
  const tooltipStyle = rect
    ? step.placement === "right"
      ? {
          top: Math.min(rect.top, window.innerHeight - 220),
          left: Math.min(rect.right + 12, window.innerWidth - tooltipWidth - 12),
        }
      : {
          top: rect.bottom + 12,
          left: Math.min(Math.max(12, rect.left), window.innerWidth - tooltipWidth - 12),
        }
    : { top: 88, left: 24 };

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-foreground/10"
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
        className="fixed z-[102] flex flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-xl transition-all duration-200"
        style={{ ...tooltipStyle, width: tooltipWidth }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
          {stepIndex + 1} de {STEPS.length}
        </p>
        <p className="font-heading text-sm font-semibold text-foreground">{step.title}</p>
        <p className="text-[13px] text-neutral-600">{step.description}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={finish}>
            Pular
          </Button>
          <Button size="sm" onClick={next}>
            {stepIndex === STEPS.length - 1 ? "Concluir" : "Próximo"}
          </Button>
        </div>
      </div>
    </>
  );
}
