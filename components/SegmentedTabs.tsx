"use client";

import type { LucideIcon } from "lucide-react";

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; icon: LucideIcon }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="inline-flex gap-1 rounded-full border border-[var(--surface-border)] bg-[var(--surface-muted)] p-1">
      {options.map((o) => {
        const Icon = o.icon;
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`flex items-center gap-2 rounded-full px-[18px] py-2.5 text-[15px] font-semibold transition-colors ${
              active
                ? "bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-sm)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            <Icon size={16} strokeWidth={2.3} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
