"use client";

import { useState } from "react";
import { MessageCircle, Bot, Send, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { renderInline } from "@/components/Render";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function KenesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/kenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Белгісіз қате.");
      } else {
        setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setError("Сұранысты жіберу кезінде қате шықты. Интернет байланысын тексеріңіз.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="4-БӨЛІМ · ЖЕДЕЛ КЕҢЕС"
        icon={MessageCircle}
        title="AI-кеңесші"
        subtitle="Басқарушылық сұрағыңызды жазыңыз — жедел, нақты кеңес аласыз."
      />

      <div className="surface-card flex h-[65vh] min-h-[420px] flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-white"
                style={{ background: "var(--gradient-accent)" }}
              >
                <Bot size={28} />
              </span>
              <p className="max-w-[300px] text-[16px] leading-relaxed text-[var(--ink-faint)]">
                Мысалы: «Мектепте мұғалімдер тапшылығы бар, қалай шешуге болады?»
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`fade-in flex items-end gap-2.5 ${
                m.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {m.role === "assistant" && (
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: "var(--gradient-accent)" }}
                >
                  <Bot size={17} />
                </span>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-[16px] leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "text-white"
                    : "border border-[var(--surface-border)] bg-[var(--surface-muted)] text-[var(--ink)]"
                }`}
                style={m.role === "user" ? { background: "var(--gradient-accent)" } : undefined}
              >
                {m.role === "assistant" ? renderInline(m.content, `msg-${i}`) : m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="fade-in flex items-end gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: "var(--gradient-accent)" }}
              >
                <Bot size={17} />
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)] px-5 py-3.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--ink-faint)] [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--ink-faint)]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--ink-faint)] [animation-delay:0.2s]" />
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="flex items-center gap-2 border-t border-[var(--surface-border)] px-5 py-3 text-[15px] font-medium text-[var(--red)]">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </p>
        )}

        <div className="flex items-end gap-2.5 border-t border-[var(--surface-border)] bg-[var(--surface)] p-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Сұрағыңызды жазыңыз…"
            rows={1}
            className="field-base min-h-0 flex-1 resize-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading}
            aria-label="Жіберу"
            className="btn-primary !px-4 !py-3.5"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
