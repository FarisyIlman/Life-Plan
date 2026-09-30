"use client";

import type { ContentBlock } from "@prisma/client";
import Image from "next/image";
import type { ContentBlockPreview } from "@/lib/types";
import MarkdownContent from "@/components/MarkdownContent";
import { formatTimelineDate } from "@/lib/timeline-utils";

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
    why?: string;
    nextAction?: string;
    evidenceUrl?: string;
    visibility?: "PUBLIC" | "SUMMARY" | "PRIVATE";
    linkedGoal?: { year: number; category: string; status: string } | null;
    techStack?: string;
    responsibilities?: string;
    textColor?: string;
    imageUrl?: string;
    imageCaption?: string;
  };
  const isPrivate = data.visibility === "PRIVATE";
  const isSummary = data.visibility === "SUMMARY";

  if (isPrivate) return null;
  const themeStyles = {
    VOYAGE: {
      accent: "var(--color-theme-voyage)",
      font: "font-voyage",
      label: "Tech Stack",
    },
    TREE: {
      accent: "var(--color-theme-tree)",
      font: "font-heading",
      label: "Responsibilities",
    },
    GENERIC: {
      accent: "var(--color-accent)",
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
          {formatTimelineDate(new Date(block.deadline))}
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
      {data.imageUrl && !isPrivate && !isSummary && (
        <figure className="mb-4 overflow-hidden rounded border border-border">
          <Image
            src={data.imageUrl}
            alt={data.imageCaption || block.title}
            width={800}
            height={450}
            className="h-auto max-h-64 w-full object-cover"
            unoptimized
          />
          {data.imageCaption && (
            <figcaption className="px-3 py-2 text-xs text-text-muted">
              {data.imageCaption}
            </figcaption>
          )}
        </figure>
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
      {data.why && (
        <p className="text-text-muted text-sm mb-3">
          <span style={{ color: themeStyles.accent }}>Why it matters:</span>{" "}
          {data.why}
        </p>
      )}
      {data.linkedGoal && (
        <p className="text-text-muted text-xs mb-3">
          <span style={{ color: themeStyles.accent }}>Supports goal:</span>{" "}
          {data.linkedGoal.year} {data.linkedGoal.category.replaceAll("_", " ")}
        </p>
      )}
      {data.techStack && !isPrivate && !isSummary && (
        <p className="text-text-muted text-xs mb-1">
          <span style={{ color: themeStyles.accent }}>Tech:</span>{" "}
          {data.techStack}
        </p>
      )}
      {data.responsibilities && !isPrivate && !isSummary && (
        <p className="text-text-muted text-xs">
          <span style={{ color: themeStyles.accent }}>
            {themeStyles.label}:
          </span>{" "}
          {data.responsibilities}
        </p>
      )}
      {data.nextAction && !isPrivate && !isSummary && (
        <p className="text-text-muted text-sm mt-3">
          <span style={{ color: themeStyles.accent }}>Next action:</span>{" "}
          {data.nextAction}
        </p>
      )}
      {data.evidenceUrl && !isPrivate && !isSummary && (
        <a
          href={data.evidenceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 text-xs font-heading hover:underline"
          style={{ color: themeStyles.accent }}
        >
          View evidence ↗
        </a>
      )}
      {block.isCompleted && (
        <span className="inline-block mt-3 text-green-400 text-xs font-heading">
          ✓ Completed
        </span>
      )}
    </div>
  );
}
