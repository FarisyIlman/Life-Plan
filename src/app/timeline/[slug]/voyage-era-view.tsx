"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type {
  Era,
  ContentBlock,
  MasterDegreeNode,
  AchievementGoal,
} from "@prisma/client";
import MasterFlowchart from "@/components/MasterFlowchart";
import AchievementTracker from "@/components/AchievementTracker";
import EraReflection from "@/components/EraReflection";
import CardThemeContent from "@/components/CardThemeContent";
import {
  getContentProgress,
  getPublicContentBlocks,
} from "@/lib/content-progress";

type EraWithData = Era & {
  contentBlocks: ContentBlock[];
  achievementGoals: AchievementGoal[];
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
  const { total, percentage: progress } = getContentProgress(era.contentBlocks);
  const publicContentBlocks = getPublicContentBlocks(era.contentBlocks);

  return (
    <div className="min-h-screen bg-bg-primary relative">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-teal-600/10 via-transparent to-transparent" />

      <div className="px-6 pt-20">
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
          className="font-voyage text-4xl sm:text-5xl md:text-6xl text-text-primary mb-4 break-words"
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
            <div
              className="h-2 bg-bg-secondary rounded-full overflow-hidden"
              role="progressbar"
              aria-label="Journey progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full bg-voyage-teal transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <EraReflection
        thesis={era.thesis}
        tradeOff={era.tradeOff}
        successIndicators={era.successIndicators}
        retrospective={era.retrospective}
        accent="#0D9488"
        fontClassName="font-voyage"
      />

      {/* Master's Degree Flowchart */}
      <section className="px-6 pb-12 max-w-5xl mx-auto">
        <h3 className="font-voyage text-2xl text-text-primary mb-4 text-center">
          Charting the Destination
        </h3>
        <div
          className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-4 text-xs text-text-muted"
          aria-label="Route legend"
        >
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-accent mr-2" />
            Origin
          </span>
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-voyage-navy mr-2" />
            Country
          </span>
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-voyage-teal mr-2" />
            University
          </span>
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-voyage-gold mr-2" />
            Program
          </span>
        </div>
        <MasterFlowchart nodes={flowchartNodes} />
      </section>

      {/* Content blocks */}
      {publicContentBlocks.length > 0 && (
        <section className="px-6 pb-20 max-w-3xl mx-auto">
          <div className="space-y-4">
            {publicContentBlocks.map((block) => (
              <CardThemeContent key={block.id} block={block} theme="VOYAGE" />
            ))}
          </div>
        </section>
      )}

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
                theme="VOYAGE"
              />
            ))}
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
