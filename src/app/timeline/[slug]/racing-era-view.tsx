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

export default function RacingEraView({
  era,
  prevEra,
  nextEra,
}: {
  era: EraWithData;
  prevEra: EraNav;
  nextEra: EraNav;
}) {
  // Group achievement goals by year
  const goalsByYear = new Map<number, AchievementGoal[]>();
  for (const goal of era.achievementGoals) {
    if (!goalsByYear.has(goal.year)) goalsByYear.set(goal.year, []);
    goalsByYear.get(goal.year)!.push(goal);
  }
  const years = Array.from(goalsByYear.keys()).sort((a, b) => a - b);

  const totalGoals = era.achievementGoals.length;
  const achievedGoals = era.achievementGoals.filter(
    (g) => g.status === "ACHIEVED" || g.status === "OVER_ACHIEVED",
  ).length;
  const overallProgress =
    totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      {/* Racing background accent */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-red-600/10 via-transparent to-transparent" />

      <div className="px-6 pt-6">
        <Link
          href="/timeline"
          className="text-text-muted text-sm hover:text-accent"
        >
          ← Back to Timeline
        </Link>
      </div>

      <section className="text-center px-6 py-16">
        <p className="text-red-400 font-racing tracking-widest text-sm mb-2">
          {era.startYear}–{era.endYear} GRAND PRIX
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-racing text-5xl md:text-6xl text-text-primary mb-4"
        >
          {era.title}
        </motion.h1>
        {era.description && (
          <p className="text-text-muted max-w-xl mx-auto">{era.description}</p>
        )}

        {totalGoals > 0 && (
          <div className="max-w-md mx-auto mt-8">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Race Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <section className="px-6 pb-12 max-w-4xl mx-auto">
        {years.length === 0 ? (
          <p className="text-text-muted text-center">
            No achievement goals set yet for this era.
          </p>
        ) : (
          years.map((year) => (
            <AchievementTracker
              key={year}
              year={year}
              goals={goalsByYear.get(year)!}
            />
          ))
        )}
      </section>

      {/* Additional content blocks, if any */}
      {era.contentBlocks.length > 0 && (
        <section className="px-6 pb-20 max-w-4xl mx-auto">
          <h3 className="font-racing text-xl text-text-primary mb-4">
            Additional Notes
          </h3>
          <div className="space-y-3">
            {era.contentBlocks.map((block) => {
              const data = block.data as { description?: string };
              return (
                <div
                  key={block.id}
                  className="bg-bg-secondary border border-border rounded-lg p-4 border-l-4 border-l-red-500"
                >
                  <h4 className="text-text-primary text-sm">{block.title}</h4>
                  {data.description && (
                    <p className="text-text-muted text-sm mt-1">
                      {data.description}
                    </p>
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
