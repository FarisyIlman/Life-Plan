"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Era, ContentBlock, AchievementGoal } from "@prisma/client";
import AchievementTracker from "@/components/AchievementTracker";
import MarkdownContent from "@/components/MarkdownContent";
import EraReflection from "@/components/EraReflection";
import { getPublicContentBlocks } from "@/lib/content-progress";

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
  const publicContentBlocks = getPublicContentBlocks(era.contentBlocks);

  const totalGoals = era.achievementGoals.length;
  const achievedGoals = era.achievementGoals.filter(
    (g) => g.status === "ACHIEVED" || g.status === "OVER_ACHIEVED",
  ).length;
  const measurableGoals = era.achievementGoals.filter(
    (goal) => goal.actualValue != null && goal.targetIdeal > 0,
  );
  const actualProgress =
    measurableGoals.length > 0
      ? Math.min(
          100,
          Math.round(
            measurableGoals.reduce(
              (sum, goal) => sum + (goal.actualValue! / goal.targetIdeal) * 100,
              0,
            ) / measurableGoals.length,
          ),
        )
      : 0;
  const statusProgress =
    totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0;
  const overallProgress =
    measurableGoals.length > 0 ? actualProgress : statusProgress;

  return (
    <div className="min-h-screen bg-bg-primary relative">
      {/* Racing background accent */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-red-600/10 via-transparent to-transparent" />

      <div className="px-6 pt-20">
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
          className="font-racing text-4xl sm:text-5xl md:text-6xl text-text-primary mb-4 break-words"
        >
          {era.title}
        </motion.h1>
        {era.description && (
          <p className="text-text-muted max-w-xl mx-auto">{era.description}</p>
        )}

        {totalGoals > 0 && (
          <div className="max-w-md mx-auto mt-8">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Lap progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div
              className="h-2 bg-bg-secondary rounded-full overflow-hidden"
              role="progressbar"
              aria-label="Race progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={overallProgress}
            >
              <div
                className="h-full bg-red-500 transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <section
        className="px-6 pb-12 max-w-4xl mx-auto"
        aria-label="Race dashboard"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-red-500/40 bg-bg-secondary/70 p-4 rounded-lg">
            <p className="text-red-400 text-xs font-racing tracking-widest uppercase">
              Checkpoints
            </p>
            <p className="font-racing text-3xl text-text-primary mt-1">
              {totalGoals}
            </p>
          </div>
          <div className="border border-yellow-400/40 bg-bg-secondary/70 p-4 rounded-lg">
            <p className="text-yellow-300 text-xs font-racing tracking-widest uppercase">
              Cleared
            </p>
            <p className="font-racing text-3xl text-text-primary mt-1">
              {achievedGoals}
            </p>
          </div>
          <div className="border border-border bg-bg-secondary/70 p-4 rounded-lg">
            <p className="text-text-muted text-xs font-racing tracking-widest uppercase">
              Measured pace
            </p>
            <p className="font-racing text-3xl text-text-primary mt-1">
              {measurableGoals.length ? `${actualProgress}%` : "--"}
            </p>
          </div>
        </div>
      </section>

      <EraReflection
        thesis={era.thesis}
        tradeOff={era.tradeOff}
        successIndicators={era.successIndicators}
        retrospective={era.retrospective}
        accent="#DC2626"
        fontClassName="font-racing"
      />

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
              theme="RACING"
            />
          ))
        )}
      </section>

      {/* Additional content blocks, if any */}
      {publicContentBlocks.length > 0 && (
        <section className="px-6 pb-20 max-w-4xl mx-auto">
          <h3 className="font-racing text-xl text-text-primary mb-4">
            Pit notes
          </h3>
          <div className="space-y-3">
            {publicContentBlocks.map((block) => {
              const data = block.data as {
                description?: string;
                textColor?: string;
              };
              return (
                <div
                  key={block.id}
                  className="bg-bg-secondary border border-border rounded-lg p-4 border-l-4 border-l-red-500"
                >
                  <h4 className="text-text-primary text-sm">{block.title}</h4>
                  {data.description && (
                    <div
                      className="text-text-primary text-sm mb-4"
                      style={{ color: data.textColor || undefined }}
                    >
                      <MarkdownContent content={data.description} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="border-t border-border px-6 py-8 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center max-w-5xl mx-auto">
        {prevEra ? (
          <Link
            href={`/timeline/${prevEra.slug}`}
            className="min-h-11 flex items-center text-text-muted hover:text-accent transition break-words"
          >
            ← {prevEra.title}
          </Link>
        ) : (
          <span />
        )}
        {nextEra ? (
          <Link
            href={`/timeline/${nextEra.slug}`}
            className="min-h-11 flex items-center justify-end text-text-muted hover:text-accent transition break-words sm:text-right"
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
