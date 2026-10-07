"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, ImageIcon } from "lucide-react";

export function FileDrop({
  file,
  previewUrl,
  onSelect,
  onClear,
  accept = "image/*",
}: {
  file: File | null;
  previewUrl: string | null;
  onSelect: (file: File) => void;
  onClear: () => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  }

  if (file && previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--surface-border)] bg-[var(--surface-muted)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Жүктелген тапсырма" className="max-h-56 w-full object-contain" />
        <button
          type="button"
          onClick={onClear}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ink)]/80 text-white shadow-md transition hover:bg-[var(--ink)]"
          aria-label="Суретті алып тастау"
        >
          <X size={17} />
        </button>
        <div className="flex items-center gap-2 border-t border-[var(--surface-border)] px-4 py-3 text-[14px] text-[var(--ink-muted)]">
          <ImageIcon size={16} />
          <span className="truncate">{file.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border-2 border-dashed px-5 py-9 text-center transition-colors ${
        dragActive
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--surface-border)] bg-[var(--surface-muted)] hover:border-[var(--accent)]/50"
      }`}
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full text-[var(--accent)]"
        style={{ background: "var(--accent-soft)" }}
      >
        <UploadCloud size={26} />
      </span>
      <p className="text-[16.5px] font-medium text-[var(--ink)]">
        Суретті осында сүйреңіз немесе файлды таңдаңыз
      </p>
      <p className="text-[14px] text-[var(--ink-faint)]">PNG, JPG · 6 МБ-қа дейін</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
