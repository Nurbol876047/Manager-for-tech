"use client";

import { useState } from "react";
import { Briefcase, Wand2, AlertCircle } from "lucide-react";
import { TASKS } from "@/lib/tasks";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton } from "@/components/Button";
import { ResultPanel } from "@/components/ResultPanel";

export default function Home() {
  const [taskId, setTaskId] = useState(TASKS[0].id);
  const [facts, setFacts] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const task = TASKS.find((t) => t.id === taskId)!;

  async function handleSubmit() {
    if (!facts.trim()) {
      setError("Алдымен жағдай бойынша фактілерді жазыңыз.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, facts }),
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
        eyebrow="1-БӨЛІМ · БАСҚАРУ"
        icon={Briefcase}
        title="Менеджмент-AI"
        subtitle="Жағдайды жазыңыз — AI құрылымдалған басқарушылық құжат жасайды."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="surface-card p-6 sm:p-7">
          <label className="field-label">Тапсырма түрі</label>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TASKS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTaskId(t.id)}
                className={`min-h-[68px] rounded-[var(--radius-sm)] border px-5 py-4 text-left text-[16px] leading-snug font-medium transition-colors ${
                  t.id === taskId
                    ? "border-[var(--accent)]/40 text-[var(--accent)] shadow-[var(--shadow-sm)]"
                    : "border-[var(--surface-border)] bg-[var(--surface-muted)] text-[var(--ink-muted)] hover:border-[var(--accent)]/30 hover:text-[var(--ink)]"
                }`}
                style={t.id === taskId ? { background: "var(--accent-soft)" } : undefined}
              >
                {t.label}
              </button>
            ))}
          </div>

          <label className="field-label">Нақты жағдай / фактілер</label>
          <p className="mb-2.5 text-[14.5px] text-[var(--ink-faint)]">{task.hint}</p>
          <textarea
            value={facts}
            onChange={(e) => setFacts(e.target.value)}
            placeholder={task.placeholder}
            rows={6}
            className="field-base resize-y"
          />

          <div className="mt-5 flex flex-col gap-3">
            <PrimaryButton
              icon={Wand2}
              loading={loading}
              loadingText="Талдау жасалуда…"
              onClick={handleSubmit}
              className="self-start"
            >
              Талдау жасау
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
          emptyIcon={Briefcase}
          emptyText="Тапсырма түрін таңдап, фактілерді жазыңыз — дайын құжат осында шығады."
        />
      </div>
    </main>
  );
}
