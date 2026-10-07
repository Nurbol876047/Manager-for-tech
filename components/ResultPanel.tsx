"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, type LucideIcon } from "lucide-react";
import { renderStructuredText, extractVerdict } from "@/components/Render";
import { Badge } from "@/components/Badge";

export function ResultPanel({
  loading,
  result,
  emptyIcon: EmptyIcon = Sparkles,
  emptyTitle = "Нәтиже осында шығады",
  emptyText,
  showVerdict,
  headerExtra,
}: {
  loading: boolean;
  result: string | null;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyText: string;
  showVerdict?: boolean;
  headerExtra?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const verdict = showVerdict && result ? extractVerdict(result) : null;

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="surface-card flex h-full min-h-[340px] flex-col p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[13.5px] font-bold tracking-wide text-[var(--ink-faint)] uppercase">
          Нәтиже
        </h2>
        <div className="flex items-center gap-2">
          {headerExtra}
          {result && !loading && (
            <button type="button" onClick={handleCopy} className="btn-ghost">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Көшірілді" : "Көшіру"}
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex-1 space-y-3">
          <div className="skeleton-line h-5 w-2/3" />
          <div className="skeleton-line h-3.5 w-full" />
          <div className="skeleton-line h-3.5 w-11/12" />
          <div className="skeleton-line h-3.5 w-4/5" />
          <div className="skeleton-line mt-5 h-5 w-1/2" />
          <div className="skeleton-line h-3.5 w-full" />
          <div className="skeleton-line h-3.5 w-3/4" />
        </div>
      )}

      {!loading && !result && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3.5 py-10 text-center">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-[var(--accent)]"
            style={{ background: "var(--accent-soft)" }}
          >
            <EmptyIcon size={28} />
          </span>
          <p className="text-[16.5px] font-semibold text-[var(--ink)]">{emptyTitle}</p>
          <p className="max-w-[260px] text-[14.5px] leading-relaxed text-[var(--ink-faint)]">
            {emptyText}
          </p>
        </div>
      )}

      {!loading && result && (
        <div className="fade-in flex-1">
          {verdict && (
            <div className="mb-4">
              <Badge tone={verdict.tone}>{verdict.label}</Badge>
            </div>
          )}
          <div className="prose-result">{renderStructuredText(result)}</div>
        </div>
      )}
    </div>
  );
}
