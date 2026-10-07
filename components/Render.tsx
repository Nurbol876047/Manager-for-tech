import type { BadgeTone } from "@/components/Badge";

export function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={`${keyPrefix}-${i}`}>{part}</strong> : part
  );
}

export function renderStructuredText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      return <h3 key={i}>{renderInline(trimmed.slice(3), `${i}`)}</h3>;
    }
    if (trimmed.startsWith("# ")) {
      return <h3 key={i}>{renderInline(trimmed.slice(2), `${i}`)}</h3>;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return <li key={i}>{renderInline(trimmed.slice(2), `${i}`)}</li>;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      return <li key={i}>{renderInline(trimmed.replace(/^\d+\.\s/, ""), `${i}`)}</li>;
    }
    if (trimmed === "") {
      return <div key={i} className="h-1.5" />;
    }
    return <p key={i}>{renderInline(trimmed, `${i}`)}</p>;
  });
}

const VERDICTS: { match: string; tone: BadgeTone; label: string }[] = [
  { match: "өзіндік болуы ықтимал", tone: "green", label: "Өзіндік болуы ықтимал" },
  { match: "қосымша тексеру қажет", tone: "amber", label: "Қосымша тексеру қажет" },
  { match: "анықтау мүмкін емес", tone: "red", label: "Анықтау мүмкін емес" },
];

export function extractVerdict(text: string): { tone: BadgeTone; label: string } | null {
  const lower = text.toLowerCase();
  for (const v of VERDICTS) {
    if (lower.includes(v.match)) return v;
  }
  return null;
}
