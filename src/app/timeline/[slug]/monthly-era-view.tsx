"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Era, ContentBlock } from "@prisma/client";
import CardMonthlyTheme from "@/components/CardMonthlyTheme";

type EraWithBlocks = Era & { contentBlocks: ContentBlock[] };
type EraNav = { slug: string; title: string } | null;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthlyEraView({
  era,
  prevEra,
  nextEra,
}: {
  era: EraWithBlocks;
  prevEra: EraNav;
  nextEra: EraNav;
}) {
  const total = era.contentBlocks.length;
  const completed = era.contentBlocks.filter((b) => b.isCompleted).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Group content blocks by month
  const blocksByMonth: Record<number, ContentBlock[]> = {};
  for (const block of era.contentBlocks) {
    const data = block.data as { month?: number };
    const month = data.month ?? 0;
    if (!blocksByMonth[month]) blocksByMonth[month] = [];
    blocksByMonth[month].push(block);
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Breadcrumb */}
      <div className="px-6 pt-6">
        <Link
          href="/timeline"
          className="text-text-muted text-sm hover:text-accent"
        >
          ← Back to Timeline
        </Link>
      </div>

      {/* Hero */}
      <section className="text-center px-6 py-16">
        <p className="text-monthly-blue font-heading tracking-widest text-sm mb-2">
          {era.startYear === era.endYear
            ? era.startYear
            : `${era.startYear}–${era.endYear}`}
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-heading text-5xl md:text-6xl text-text-primary mb-4"
        >
          {era.title}
        </motion.h1>
        {era.description && (
          <p className="text-text-muted max-w-xl mx-auto">{era.description}</p>
        )}

        {total > 0 && (
          <div className="max-w-md mx-auto mt-8">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-monthly-blue transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Monthly grid */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        {total === 0 ? (
          <p className="text-text-muted text-center">
            No content yet for this era.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MONTH_NAMES.map((monthName, i) => {
              const monthNum = i + 1;
              const blocks = blocksByMonth[monthNum];
              if (!blocks || blocks.length === 0) return null;

              return (
                <div key={monthNum}>
                  <h3 className="font-heading text-xl text-text-primary mb-3 border-b border-border pb-2">
                    {monthName}
                  </h3>
                  <div className="space-y-3">
                    {blocks.map((block) => (
                      <CardMonthlyTheme key={block.id} block={block} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Prev/Next navigation */}
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
