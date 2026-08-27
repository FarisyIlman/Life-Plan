"use client";

import { motion } from "framer-motion";
import type { ContentBlock } from "@prisma/client";
import type { ContentBlockPreview } from "@/lib/types";

export default function CardGalaxyTheme({
  block,
}: {
  block: ContentBlock | ContentBlockPreview;
}) {
  const data = block.data as {
    description?: string;
    techStack?: string;
    responsibilities?: string;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="relative bg-bg-secondary border border-border rounded-xl p-6 overflow-hidden"
    >
      {/* subtle glow accent */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-galaxy-purple opacity-20 blur-2xl" />

      {block.deadline && (
        <p className="text-galaxy-gold text-xs mb-2 font-heading tracking-wide">
          Deadline: {new Date(block.deadline).toLocaleDateString("en-GB")}
        </p>
      )}

      <h3 className="font-galaxy text-xl text-text-primary mb-1">
        {block.title}
      </h3>
      {block.subtitle && (
        <p className="text-text-muted text-sm mb-4">{block.subtitle}</p>
      )}

      {data.description && (
        <p className="text-text-primary text-sm mb-4">{data.description}</p>
      )}

      {data.techStack && (
        <div className="mb-3">
          <p className="text-galaxy-cyan text-xs font-heading mb-1">
            TECH STACK
          </p>
          <p className="text-text-muted text-sm">{data.techStack}</p>
        </div>
      )}

      {data.responsibilities && (
        <div>
          <p className="text-galaxy-cyan text-xs font-heading mb-1">
            RESPONSIBILITIES
          </p>
          <p className="text-text-muted text-sm">{data.responsibilities}</p>
        </div>
      )}

      {block.isCompleted && (
        <span className="inline-block mt-4 text-green-400 text-xs font-heading">
          ✓ Completed
        </span>
      )}
    </motion.div>
  );
}
