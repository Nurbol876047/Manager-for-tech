"use client";

import { useState } from "react";
import { ScanSearch, ImageIcon, FileText, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton } from "@/components/Button";
import { ResultPanel } from "@/components/ResultPanel";
import { InfoCallout } from "@/components/Badge";
import { FileDrop } from "@/components/FileDrop";
import { SegmentedTabs } from "@/components/SegmentedTabs";

const MAX_FILE_BYTES = 6 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function TekseruPage() {
  const [mode, setMode] = useState<"image" | "text">("image");
  const [context, setContext] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSelectFile(f: File) {
    if (f.size > MAX_FILE_BYTES) {
      setError("Файл тым үлкен (6 МБ-тан аспауы керек).");
      return;
    }
    setError(null);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function clearFile() {
    setFile(null);
    setPreviewUrl(null);
  }

  async function handleSubmit() {
    if (mode === "image" && !file) {
      setError("Суретті жүктеңіз.");
      return;
    }
    if (mode === "text" && !text.trim()) {
      setError("Мәтінді енгізіңіз.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      let imageBase64: string | undefined;
      let mimeType: string | undefined;
      if (mode === "image" && file) {
        imageBase64 = await fileToBase64(file);
        mimeType = file.type || "image/jpeg";
      }
      const res = await fetch("/api/tekseru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          text: mode === "text" ? text : undefined,
          context,
        }),
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
        eyebrow="2-БӨЛІМ · САПАНЫ БАҚЫЛАУ"
        icon={ScanSearch}
        title="Тапсырма/құжатты тексеру"
        subtitle="Фото немесе мәтін жүктеңіз — AI мазмұнын сипаттап, сапасын бағалайды."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="surface-card flex flex-col gap-5 p-6 sm:p-7">
          <InfoCallout>
            Бұл дерекқормен салыстыратын толыққанды антиплагиат жүйесі емес — бастапқы
            сапа бақылауға арналған AI-көмекші.
          </InfoCallout>

          <div>
            <label className="field-label">Контекст (міндетті емес)</label>
            <input
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Мысалы: 9-сынып, информатика пәні, эссе тапсырмасы"
              className="field-base"
            />
          </div>

          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <label className="field-label mb-0">Тексерілетін материал</label>
              <SegmentedTabs
                value={mode}
                onChange={setMode}
                options={[
                  { id: "image", label: "Сурет", icon: ImageIcon },
                  { id: "text", label: "Мәтін", icon: FileText },
                ]}
              />
            </div>

            {mode === "image" ? (
              <FileDrop
                file={file}
                previewUrl={previewUrl}
                onSelect={handleSelectFile}
                onClear={clearFile}
              />
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Мәтінді осында қойыңыз…"
                rows={7}
                className="field-base resize-y"
              />
            )}
          </div>

          <div className="flex flex-col gap-3">
            <PrimaryButton
              icon={ScanSearch}
              loading={loading}
              loadingText="Тексерілуде…"
              onClick={handleSubmit}
              className="self-start"
            >
              Тексеру
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
          showVerdict
          emptyIcon={ScanSearch}
          emptyText="Сурет немесе мәтін жүктеп, «Тексеру» басыңыз — бағалау осында шығады."
        />
      </div>
    </main>
  );
}
