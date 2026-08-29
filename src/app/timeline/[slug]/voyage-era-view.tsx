"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Era, ContentBlock, MasterDegreeNode } from "@prisma/client";
import MasterFlowchart from "@/components/MasterFlowchart";

type EraWithData = Era & {
  contentBlocks: ContentBlock[];
};
type EraNav = { slug: string; title: string } | null;

export default function VoyageEraView({
  era,
  prevEra,
  nextEra,
  flowchartNodes,
}: {
  era: EraWithData;
  prevEra: EraNav;
  nextEra: EraNav;
  flowchartNodes: MasterDegreeNode[];
}) {
  const total = era.contentBlocks.length;
  const completed = era.contentBlocks.filter((b) => b.isCompleted).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-600/10 via-transparent to-transparent" />

      <div className="px-6 pt-6">
        <Link
          href="/timeline"
          className="text-text-muted text-sm hover:text-accent"
        >
          ← Back to Timeline
        </Link>
      </div>

      <section className="text-center px-6 py-16">
        <p className="text-voyage-teal font-voyage tracking-widest text-sm mb-2">
          {era.startYear === era.endYear
            ? era.startYear
            : `${era.startYear}–${era.endYear}`}{" "}
          · THE VOYAGE
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-voyage text-5xl md:text-6xl text-text-primary mb-4"
        >
          {era.title}
        </motion.h1>
        {era.description && (
          <p className="text-text-muted max-w-xl mx-auto">{era.description}</p>
        )}

        {total > 0 && (
          <div className="max-w-md mx-auto mt-8">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Journey Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-voyage-teal transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Master's Degree Flowchart */}
      <section className="px-6 pb-12 max-w-5xl mx-auto">
        <h3 className="font-voyage text-2xl text-text-primary mb-4 text-center">
          Charting the Destination
        </h3>
        <MasterFlowchart nodes={flowchartNodes} />
      </section>

      {/* Content blocks */}
      {total > 0 && (
        <section className="px-6 pb-20 max-w-3xl mx-auto">
          <div className="space-y-4">
            {era.contentBlocks.map((block) => {
              const data = block.data as { description?: string };
              return (
                <div
                  key={block.id}
                  className="bg-bg-secondary border border-border rounded-lg p-5 border-l-4 border-l-teal-500"
                >
                  {block.deadline && (
                    <p className="text-voyage-teal text-xs mb-1 font-voyage">
                      {new Date(block.deadline).toLocaleDateString("en-GB")}
                    </p>
                  )}
                  <h4 className="font-voyage text-lg text-text-primary mb-1">
                    {block.title}
                  </h4>
                  {block.subtitle && (
                    <p className="text-text-muted text-sm mb-2">
                      {block.subtitle}
                    </p>
                  )}
                  {data.description && (
                    <p className="text-text-primary text-sm">
                      {data.description}
                    </p>
                  )}
                  {block.isCompleted && (
                    <span className="inline-block mt-3 text-green-400 text-xs font-heading">
                      ✓ Completed
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="border-t border-border px-6 py-8 flex justify-between items-center max-w-5xl mx-auto">
        {prevEra ? (
          <Link
            href={`/timeline/${prevEra.slug}`}
            className="text-text-muted hover:text-accent transition"
          >
            ← {prevEra.title}
          </Link>
        ) : (
          <span />
        )}
        {nextEra ? (
          <Link
            href={`/timeline/${nextEra.slug}`}
            className="text-text-muted hover:text-accent transition"
          >
            {nextEra.title} →
          </Link>
        ) : (
          <span />
        )}
      </section>
    </div>
  );
}
