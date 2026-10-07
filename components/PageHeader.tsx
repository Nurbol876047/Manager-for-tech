import type { LucideIcon } from "lucide-react";

export function PageHeader({
  eyebrow,
  icon: Icon,
  title,
  subtitle,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="mb-7">
      <span className="eyebrow-badge">
        <Icon size={15} strokeWidth={2.5} />
        {eyebrow}
      </span>
      <h1 className="mt-3.5 text-[28px] font-extrabold tracking-tight text-[var(--ink)] sm:text-[34px]">
        {title}
      </h1>
      <p className="mt-2 max-w-xl text-[16px] text-[var(--ink-muted)]">{subtitle}</p>
    </header>
  );
}
