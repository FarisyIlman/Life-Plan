"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Era, ContentBlock, AchievementGoal } from "@prisma/client";
import AchievementTracker from "@/components/AchievementTracker";

type EraWithData = Era & {
  contentBlocks: ContentBlock[];
  achievementGoals: AchievementGoal[];
};
type EraNav = { slug: string; title: string } | null;

export default function TreeEraView({
  era,
  prevEra,
  nextEra,
}: {
  era: EraWithData;
  prevEra: EraNav;
  nextEra: EraNav;
}) {
  const total = era.contentBlocks.length;
  const completed = era.contentBlocks.filter((b) => b.isCompleted).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-800/10 via-transparent to-transparent" />

      <div className="px-6 pt-6">
        <Link
          href="/timeline"
          className="text-text-muted text-sm hover:text-accent"
        >
          ← Back to Timeline
        </Link>
      </div>

      <section className="text-center px-6 py-16">
        <p className="text-tree-gold font-heading tracking-widest text-sm mb-2">
          {era.startYear} — ONWARD
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-heading font-light text-5xl md:text-6xl text-text-primary mb-4"
        >
          {era.title}
        </motion.h1>
        {era.description && (
          <p className="text-text-muted max-w-xl mx-auto">{era.description}</p>
        )}

        <p className="text-tree-green text-sm mt-6 italic">
          No finish line — only growth.
        </p>

        {total > 0 && (
          <div className="max-w-md mx-auto mt-8">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Rooted Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-tree-green transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <section className="px-6 pb-20 max-w-3xl mx-auto">
        {total === 0 ? (
          <p className="text-text-muted text-center">
            No content yet for this era.
          </p>
        ) : (
          <div className="space-y-4">
            {era.contentBlocks.map((block) => {
              const data = block.data as { description?: string };
              return (
                <div
                  key={block.id}
                  className="bg-bg-secondary border border-border rounded-lg p-5 border-l-4 border-l-green-700"
                >
                  <h4 className="font-heading text-lg text-text-primary mb-1">
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
        )}
      </section>

      {/* Achievement goals, if any */}
      {era.achievementGoals.length > 0 && (
        <section className="px-6 pb-12 max-w-4xl mx-auto">
          {Array.from(new Set(era.achievementGoals.map((g) => g.year)))
            .sort((a, b) => a - b)
            .map((year) => (
              <AchievementTracker
                key={year}
                year={year}
                goals={era.achievementGoals.filter((g) => g.year === year)}
              />
            ))}
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
