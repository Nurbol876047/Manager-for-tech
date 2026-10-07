"use client";

import { useState } from "react";
import { ListChecks, Minus, Plus, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton } from "@/components/Button";
import { ResultPanel } from "@/components/ResultPanel";

export default function TestPage() {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function clampCount(n: number) {
    return Math.min(30, Math.max(1, n));
  }

  async function handleSubmit() {
    if (!prompt.trim()) {
      setError("Тест тақырыбын жазыңыз.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, count }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Белгісіз қате.");
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Сұранысты жіберу кезінде қате шықты. Интернет байланысын тексеріңіз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="3-БӨЛІМ · ОҚУ ПРОЦЕСІН ЖОСПАРЛАУ"
        icon={ListChecks}
        title="Тест генераторы"
        subtitle="Тақырыпты жазыңыз — сұрақтар мен жауаптар кілті бірден дайын болады."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="surface-card flex flex-col gap-5 p-6 sm:p-7">
          <div>
            <label className="field-label">Тақырып</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Мысалы: 7-сынып, жаратылыстану, «Судың қасиеттері» тақырыбы"
              rows={5}
              className="field-base resize-y"
            />
          </div>

          <div>
            <label className="field-label">Сұрақ саны</label>
            <div className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--surface-border)] bg-[var(--surface-muted)] p-1.5">
              <button
                type="button"
                onClick={() => setCount((c) => clampCount(c - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-[8px] text-[var(--ink-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--accent)]"
                aria-label="Азайту"
              >
                <Minus size={19} />
              </button>
              <input
                type="number"
                min={1}
                max={30}
                value={count}
                onChange={(e) => setCount(clampCount(Number(e.target.value)))}
                className="w-14 bg-transparent text-center text-[18px] font-semibold text-[var(--ink)] outline-none"
              />
              <button
                type="button"
                onClick={() => setCount((c) => clampCount(c + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-[8px] text-[var(--ink-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--accent)]"
                aria-label="Көбейту"
              >
                <Plus size={19} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <PrimaryButton
              icon={ListChecks}
              loading={loading}
              loadingText="Тест құрастырылуда…"
              onClick={handleSubmit}
              className="self-start"
            >
              Тест жасау
            </PrimaryButton>

            {error && (
              <p className="flex items-center gap-2 text-[15px] font-medium text-[var(--red)]">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </p>
            )}
          </div>
        </div>

        <ResultPanel
          loading={loading}
          result={result}
          emptyIcon={ListChecks}
          emptyText="Тақырыпты жазып, «Тест жасау» басыңыз — дайын тест осында шығады."
        />
      </div>
    </main>
  );
}
