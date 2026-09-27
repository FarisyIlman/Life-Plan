"use client";

import { motion } from "framer-motion";
import type { ContentBlock } from "@prisma/client";
import type { ContentBlockPreview } from "@/lib/types";
import MarkdownContent from "@/components/MarkdownContent";

export default function CardGalaxyTheme({
  block,
}: {
  block: ContentBlock | ContentBlockPreview;
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
  };
  const isPrivate = data.visibility === "PRIVATE";
  const isSummary = data.visibility === "SUMMARY";

  if (isPrivate) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="group relative bg-bg-secondary/80 border border-galaxy-purple/40 rounded-lg p-5 overflow-hidden shadow-[0_0_28px_rgba(109,40,217,0.08)] transition-colors hover:border-galaxy-cyan/70"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-galaxy-purple opacity-20 blur-2xl" />
      <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-galaxy-cyan shadow-[0_0_12px_rgba(34,211,238,0.9)] transition-transform group-hover:scale-150" />

      {block.deadline && (
        <p className="text-galaxy-gold text-xs mb-2 font-heading tracking-wide uppercase">
          Deadline: {new Date(block.deadline).toLocaleDateString("en-GB")}
        </p>
      )}

      <h3
        className="font-galaxy text-xl mb-1"
        style={{ color: data.textColor || undefined }}
      >
        {block.title}
      </h3>
      {block.subtitle && (
        <p className="text-text-muted text-sm mb-4">{block.subtitle}</p>
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
          <span className="text-galaxy-gold font-heading">WHY IT MATTERS</span>
          <br />
          {data.why}
        </p>
      )}

      {data.linkedGoal && (
        <p className="text-text-muted text-xs mb-3">
          <span className="text-galaxy-gold font-heading">SUPPORTS GOAL</span>{" "}
          {data.linkedGoal.year} {data.linkedGoal.category.replaceAll("_", " ")}
        </p>
      )}

      {data.techStack && !isPrivate && !isSummary && (
        <div className="mb-3">
          <p className="text-galaxy-cyan text-xs font-heading mb-1">
            TECH STACK
          </p>
          <p className="text-text-muted text-sm">{data.techStack}</p>
        </div>
      )}

      {data.responsibilities && !isPrivate && !isSummary && (
        <div>
          <p className="text-galaxy-cyan text-xs font-heading mb-1">
            RESPONSIBILITIES
          </p>
          <p className="text-text-muted text-sm">{data.responsibilities}</p>
        </div>
      )}

      {data.nextAction && !isPrivate && !isSummary && (
        <p className="text-text-muted text-sm mt-3">
          <span className="text-galaxy-cyan font-heading">NEXT ACTION</span>
          <br />
          {data.nextAction}
        </p>
      )}

      {data.evidenceUrl && !isPrivate && !isSummary && (
        <a
          href={data.evidenceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 text-galaxy-cyan text-xs font-heading hover:underline"
        >
          View evidence ↗
        </a>
      )}

      {block.isCompleted && (
        <span className="inline-flex items-center gap-1 mt-4 text-green-400 text-xs font-heading">
          <span aria-hidden="true">✓</span> Signal complete
        </span>
      )}
    </motion.div>
  );
}
