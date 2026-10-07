import { CheckCircle2, AlertTriangle, XCircle, Info, type LucideIcon } from "lucide-react";

export type BadgeTone = "green" | "amber" | "red" | "blue";

const TONE_ICON: Record<BadgeTone, LucideIcon> = {
  green: CheckCircle2,
  amber: AlertTriangle,
  red: XCircle,
  blue: Info,
};

export function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  const Icon = TONE_ICON[tone];
  return (
    <span className={`badge badge-${tone}`}>
      <Icon size={16} strokeWidth={2.5} />
      {children}
    </span>
  );
}

export function InfoCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="info-callout">
      <Info size={18} className="mt-0.5 shrink-0 text-[var(--accent)]" />
      <span>{children}</span>
    </div>
  );
}
