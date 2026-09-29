"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, Check } from "lucide-react";
import type { ContentBlock } from "@prisma/client";
import type { ContentBlockPreview } from "@/lib/types";
import MarkdownContent from "@/components/MarkdownContent";

export default function CardGalaxyTheme({
  block,
  sequence,
  reduceMotion = false,
}: {
  block: ContentBlock | ContentBlockPreview;
  sequence?: number;
  reduceMotion?: boolean;
}) {
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
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
      className="galaxy-mission-card group relative min-w-0 p-5 sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase text-galaxy-purple">
          <span className="h-px w-5 bg-galaxy-purple/70" />
          {sequence
            ? `Mission signal ${String(sequence).padStart(2, "0")}`
            : "Mission signal"}
        </span>
        {block.isCompleted ? (
          <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-status-success/25 bg-status-success/8 px-2.5 text-xs font-medium text-status-success">
            <Check size={13} aria-hidden="true" />
            Complete
          </span>
        ) : block.deadline ? (
          <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-galaxy-gold/25 bg-galaxy-gold/8 px-2.5 text-xs font-medium text-galaxy-gold">
            <CalendarDays size={13} aria-hidden="true" />
            {new Date(block.deadline).toLocaleDateString("en-GB")}
          </span>
        ) : null}
      </div>

      <h3
        className="mb-2 wrap-break-word font-heading text-xl font-semibold leading-snug text-text-primary sm:text-2xl"
        style={{ color: data.textColor || undefined }}
      >
        {block.title}
      </h3>
      {block.subtitle && (
        <p className="mb-4 text-sm leading-6 text-text-muted">
          {block.subtitle}
        </p>
      )}

      {data.imageUrl && !isPrivate && !isSummary && (
        <figure className="mb-5 overflow-hidden rounded-lg border border-white/10 bg-black/20">
          <Image
            src={data.imageUrl}
            alt={data.imageCaption || block.title}
            width={800}
            height={450}
            className="h-auto max-h-72 w-full object-cover"
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
          className="mb-5 text-sm leading-7 text-text-primary"
          style={{ color: data.textColor || undefined }}
        >
          <MarkdownContent content={data.description} />
        </div>
      )}

      {data.why && (
        <div className="mb-5 border-l-2 border-galaxy-gold/60 pl-3">
          <p className="mb-1 text-[11px] font-semibold uppercase text-galaxy-gold">
            Why it matters
          </p>
          <p className="text-sm leading-6 text-text-muted">{data.why}</p>
        </div>
      )}

      {data.linkedGoal && (
        <p className="mb-4 text-xs text-text-muted">
          <span className="font-medium text-galaxy-purple">Supports goal</span>
          <span aria-hidden="true"> · </span>
          {data.linkedGoal.year} {data.linkedGoal.category.replaceAll("_", " ")}
        </p>
      )}

      {(data.techStack || data.responsibilities) &&
        !isPrivate &&
        !isSummary && (
          <dl className="grid grid-cols-1 gap-4 border-t border-white/8 pt-4 sm:grid-cols-2">
            {data.techStack && (
              <div>
                <dt className="mb-1 text-[11px] font-semibold uppercase text-galaxy-cyan">
                  Tech stack
                </dt>
                <dd className="text-sm leading-6 text-text-muted">
                  {data.techStack}
                </dd>
              </div>
            )}
            {data.responsibilities && (
              <div>
                <dt className="mb-1 text-[11px] font-semibold uppercase text-galaxy-cyan">
                  Responsibilities
                </dt>
                <dd className="text-sm leading-6 text-text-muted">
                  {data.responsibilities}
                </dd>
              </div>
            )}
          </dl>
        )}

      {data.nextAction && !isPrivate && !isSummary && (
        <div className="mt-5 border-t border-white/8 pt-4">
          <p className="mb-1 text-[11px] font-semibold uppercase text-galaxy-cyan">
            Next action
          </p>
          <p className="text-sm leading-6 text-text-muted">{data.nextAction}</p>
        </div>
      )}

      {data.evidenceUrl && !isPrivate && !isSummary && (
        <a
          href={data.evidenceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-galaxy-cyan hover:underline"
        >
          View evidence <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      )}
    </motion.div>
  );
}
