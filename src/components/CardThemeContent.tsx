"use client";

import type { ContentBlock } from "@prisma/client";
import type { ContentBlockPreview } from "@/lib/types";
import MarkdownContent from "@/components/MarkdownContent";

type Theme = "VOYAGE" | "TREE" | "GENERIC";

export default function CardThemeContent({
  block,
  theme,
}: {
  block: ContentBlock | ContentBlockPreview;
  theme: Theme;
}) {
  const data = (block.data ?? {}) as {
    description?: string;
    techStack?: string;
    responsibilities?: string;
    textColor?: string;
  };
  const themeStyles = {
    VOYAGE: {
      accent: "#0D9488",
      font: "font-voyage",
      label: "Tech Stack",
    },
    TREE: {
      accent: "#166534",
      font: "font-heading",
      label: "Responsibilities",
    },
    GENERIC: {
      accent: "#7C6FEF",
      font: "font-heading",
      label: "Details",
    },
  }[theme];

  return (
    <div
      className="bg-bg-secondary border border-border rounded-lg p-5 border-l-4"
      style={{ borderLeftColor: themeStyles.accent }}
    >
      {block.deadline && (
        <p
          className={`text-xs mb-1 ${themeStyles.font}`}
          style={{ color: themeStyles.accent }}
        >
          {new Date(block.deadline).toLocaleDateString("en-GB")}
        </p>
      )}
      <h4
        className={`${themeStyles.font} text-lg text-text-primary mb-1`}
        style={{ color: data.textColor || undefined }}
      >
        {block.title}
      </h4>
      {block.subtitle && (
        <p className="text-text-muted text-sm mb-2">{block.subtitle}</p>
      )}
      {data.description ? (
        <div
          className="text-text-primary text-sm mb-4"
          style={{ color: data.textColor || undefined }}
        >
          <MarkdownContent content={data.description} />
        </div>
      ) : (
        <p className="text-text-muted text-sm mb-4">No description provided.</p>
      )}
      {data.techStack && (
        <p className="text-text-muted text-xs mb-1">
          <span style={{ color: themeStyles.accent }}>Tech:</span>{" "}
          {data.techStack}
        </p>
      )}
      {data.responsibilities && (
        <p className="text-text-muted text-xs">
          <span style={{ color: themeStyles.accent }}>
            {themeStyles.label}:
          </span>{" "}
          {data.responsibilities}
        </p>
      )}
      {block.isCompleted && (
        <span className="inline-block mt-3 text-green-400 text-xs font-heading">
          ✓ Completed
        </span>
      )}
    </div>
  );
}
