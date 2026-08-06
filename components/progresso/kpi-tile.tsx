import type { ComponentType } from "react";

const TONE_STYLES = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success-background text-success-text",
  warning: "bg-warning-background text-warning-text",
  info: "bg-info-background text-info-text",
} as const;

export function KpiTile({
  icon: Icon,
  tone,
  label,
  value,
  delta,
  subtitle,
}: {
  icon: ComponentType<{ className?: string }>;
  tone: keyof typeof TONE_STYLES;
  label: string;
  value: string | number;
  delta?: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-[132px] flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <span className={`flex size-8 items-center justify-center rounded-lg ${TONE_STYLES[tone]}`}>
          <Icon className="size-4" />
        </span>
        {delta && <span className="text-xs font-bold text-success-text">{delta}</span>}
      </div>
      <span className="font-heading text-2xl font-semibold text-foreground">{value}</span>
      <div>
        <p className="text-[13px] font-semibold text-neutral-700">{label}</p>
        <p className="text-xs text-neutral-500">{subtitle}</p>
      </div>
    </div>
  );
}
