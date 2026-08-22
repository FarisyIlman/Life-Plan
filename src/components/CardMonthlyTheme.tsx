"use client";

import { motion } from "framer-motion";
import type { ContentBlock } from "@prisma/client";

export default function CardMonthlyTheme({ block }: { block: ContentBlock }) {
  const data = block.data as {
    description?: string;
    techStack?: string;
    responsibilities?: string;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="bg-bg-secondary border border-border rounded-lg p-5 border-l-4"
      style={{ borderLeftColor: "#3B82F6" }}
    >
      {block.deadline && (
        <p className="text-monthly-blue text-xs mb-1 font-heading">
          {new Date(block.deadline).toLocaleDateString("en-GB")}
        </p>
      )}

      <h3 className="font-heading text-lg text-text-primary mb-1">
        {block.title}
      </h3>
      {block.subtitle && (
        <p className="text-text-muted text-sm mb-3">{block.subtitle}</p>
      )}

      {data.description && (
        <p className="text-text-primary text-sm mb-3">{data.description}</p>
      )}

      {data.techStack && (
        <p className="text-text-muted text-xs mb-1">
          <span className="text-monthly-blue">Tech:</span> {data.techStack}
        </p>
      )}

      {data.responsibilities && (
        <p className="text-text-muted text-xs">
          <span className="text-monthly-blue">Tasks:</span>{" "}
          {data.responsibilities}
        </p>
      )}

      {block.isCompleted && (
        <span className="inline-block mt-3 text-green-400 text-xs font-heading">
          ✓ Completed
        </span>
      )}
    </motion.div>
  );
}
