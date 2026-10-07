"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import {
  Sparkles,
  Briefcase,
  ScanSearch,
  ListChecks,
  MessageCircle,
  User,
  type LucideIcon,
} from "lucide-react";

const SECTIONS: { href: string; label: string; short: string; icon: LucideIcon }[] = [
  { href: "/", label: "Менеджмент", short: "Менедж.", icon: Briefcase },
  { href: "/tekseru", label: "Тексеру", short: "Тексеру", icon: ScanSearch },
  { href: "/test", label: "Тест генераторы", short: "Тест", icon: ListChecks },
  { href: "/kenes", label: "AI-кеңесші", short: "Кеңесші", icon: MessageCircle },
];

export function Nav() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(
    null
  );

  const activeIndex = SECTIONS.findIndex((s) => s.href === pathname);

  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];
    const container = containerRef.current;
    if (!el || !container) return;
    const update = () => {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicator({ left: elRect.left - containerRect.left, width: elRect.width });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeIndex, pathname]);

  return (
    <>
      {/* Desktop / tablet header */}
      <header
        className="sticky top-0 z-40 border-b border-[var(--surface-border)] backdrop-blur-lg"
        style={{ background: "color-mix(in srgb, var(--surface) 80%, transparent)" }}
      >
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
              style={{ background: "var(--gradient-accent)" }}
            >
              <Sparkles size={23} />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-[16.5px] font-extrabold text-[var(--ink)]">
                Менеджмент-AI
              </span>
              <span className="text-[13px] font-medium text-[var(--ink-faint)]">
                Білім беру менеджменті
              </span>
            </span>
          </Link>

          <div
            ref={containerRef}
            className="relative hidden items-center gap-1 rounded-full border border-[var(--surface-border)] bg-[var(--surface-muted)] p-1.5 sm:flex"
          >
            {indicator && (
              <span
                className="absolute top-1.5 bottom-1.5 rounded-full bg-[var(--surface)] shadow-[var(--shadow-sm)] transition-all duration-300 ease-out"
                style={{ left: indicator.left, width: indicator.width }}
              />
            )}
            {SECTIONS.map((s, i) => {
              const active = i === activeIndex;
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-3 text-[15.5px] font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? "text-[var(--accent)]"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  <Icon size={19} strokeWidth={2.3} />
                  {s.label}
                </Link>
              );
            })}
          </div>

          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-muted)] text-[var(--ink-faint)]">
            <User size={20} />
          </span>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--surface-border)] backdrop-blur-lg sm:hidden"
        style={{ background: "color-mix(in srgb, var(--surface) 92%, transparent)" }}
      >
        {SECTIONS.map((s, i) => {
          const active = i === activeIndex;
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-1 flex-col items-center gap-1.5 py-3.5 text-[13px] font-semibold"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                  active ? "text-[var(--accent)]" : "text-[var(--ink-faint)]"
                }`}
                style={active ? { background: "var(--accent-soft)" } : undefined}
              >
                <Icon size={21} strokeWidth={2.3} />
              </span>
              <span className={active ? "text-[var(--accent)]" : "text-[var(--ink-faint)]"}>
                {s.short}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
