import { Fragment, type ReactNode } from "react";
import "../css/highlightText.css";

export function highlightText(text: string, words: string[]): ReactNode {
  const cleanWords = words.filter(Boolean);
  if (cleanWords.length === 0) return text;

  const escaped = [...cleanWords]
    .sort((a, b) => b.length - a.length)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);

  let variant = -1;

  return parts.map((part, i) => {
    const isMatch = cleanWords.some((w) => w.toLowerCase() === part.toLowerCase());
    if (!isMatch || part === "") {
      return <Fragment key={i}>{part}</Fragment>;
    }
    variant = (variant + 1) % 3;
    return (
      <mark key={i} className={`pf-highlight pf-highlight-${variant}`}>
        {part}
      </mark>
    );
  });
}
