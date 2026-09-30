"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { ContentBlock } from "@prisma/client";
import type { ContentBlockPreview } from "@/lib/types";
import MarkdownContent from "@/components/MarkdownContent";
import { formatTimelineDate } from "@/lib/timeline-utils";

export default function CardMonthlyTheme({
  block,
}: {
  block: ContentBlock | ContentBlockPreview;
}) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const data = block.data as {
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

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      className="bg-bg-secondary border border-border rounded-lg p-5 border-l-4"
      style={{ borderLeftColor: "var(--color-theme-monthly)" }}
    >
      {block.deadline && (
        <p className="text-monthly-blue text-xs mb-1 font-heading">
          {formatTimelineDate(new Date(block.deadline))}
        </p>
      )}

      <h3
        className="font-heading text-lg mb-1"
        style={{ color: data.textColor || undefined }}
      >
        {block.title}
      </h3>
      {block.subtitle && (
        <p className="text-text-muted text-sm mb-3">{block.subtitle}</p>
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

      {data.description && (
        <div
          className="text-text-primary text-sm mb-4"
          style={{ color: data.textColor || undefined }}
        >
          <MarkdownContent content={data.description} />
        </div>
      )}

      {data.why && (
        <p className="text-text-muted text-sm mb-3">
          <span className="text-monthly-blue font-heading">WHY IT MATTERS</span>
          <br />
          {data.why}
        </p>
      )}

      {data.linkedGoal && (
        <p className="text-text-muted text-xs mb-3">
          <span className="text-monthly-blue font-heading">SUPPORTS GOAL</span>{" "}
          {data.linkedGoal.year} {data.linkedGoal.category.replaceAll("_", " ")}
        </p>
      )}

      {data.techStack && !isPrivate && !isSummary && (
        <p className="text-text-muted text-xs mb-1">
          <span className="text-monthly-blue">Tech:</span> {data.techStack}
        </p>
      )}

      {data.responsibilities && !isPrivate && !isSummary && (
        <p className="text-text-muted text-xs">
          <span className="text-monthly-blue">Tasks:</span>{" "}
          {data.responsibilities}
        </p>
      )}

      {data.nextAction && !isPrivate && !isSummary && (
        <p className="text-text-muted text-sm mt-3">
          <span className="text-monthly-blue font-heading">NEXT ACTION</span>
          <br />
          {data.nextAction}
        </p>
      )}

      {data.evidenceUrl && !isPrivate && !isSummary && (
        <a
          href={data.evidenceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 text-monthly-blue text-xs font-heading hover:underline"
        >
          View evidence ↗
        </a>
      )}

      {block.isCompleted && (
        <span className="inline-block mt-3 text-green-400 text-xs font-heading">
          ✓ Completed
        </span>
      )}
    </motion.div>
  );
}
