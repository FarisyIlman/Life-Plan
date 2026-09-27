"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Era, ContentBlock, AchievementGoal } from "@prisma/client";
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

export default function TreeEraView({
  era,
  prevEra,
  nextEra,
}: {
  era: EraWithData;
  prevEra: EraNav;
  nextEra: EraNav;
}) {
  const { total, percentage: progress } = getContentProgress(era.contentBlocks);
  const publicContentBlocks = getPublicContentBlocks(era.contentBlocks);

  const isBeyond = era.slug.toLowerCase().includes("beyond");
  const founderName = era.founderName || "Farisy";
  const holdingName = era.holdingName || "My Holding Company";
  const operatingName = era.operatingName || "The Company";
  const foundingPartners = (era.foundingPartners || "Farisy, Umar, Ucup")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-bg-primary relative">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-green-800/10 via-transparent to-transparent" />

      <div className="px-6 pt-20">
        <Link
          href="/timeline"
          className="text-text-muted text-sm hover:text-accent"
        >
          ← Back to Timeline
        </Link>
      </div>

      <section className="text-center px-6 py-16">
        <p className="text-tree-gold font-heading tracking-widest text-sm mb-2">
          {isBeyond ? "THE COMPANY" : `${era.startYear} — ONWARD`}
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-heading font-light text-4xl sm:text-5xl md:text-6xl text-text-primary mb-4 break-words"
        >
          {era.title}
        </motion.h1>
        {era.description && (
          <p className="text-text-muted max-w-xl mx-auto">{era.description}</p>
        )}

        <p className="text-tree-green text-sm mt-6 italic">
          {isBeyond
            ? "Roots, trunk, branches — growing indefinitely, together."
            : "No finish line — only growth."}
        </p>

        {total > 0 && (
          <div className="max-w-md mx-auto mt-8">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>{isBeyond ? "Building Progress" : "Rooted Progress"}</span>
              <span>{progress}%</span>
            </div>
            <div
              className="h-2 bg-bg-secondary rounded-full overflow-hidden"
              role="progressbar"
              aria-label="Growth progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full bg-tree-green transition-all duration-700"
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
        accent="#D4A72C"
      />

      {/* Beyond-only: ownership structure */}
      {isBeyond && (
        <section className="px-6 pb-12 max-w-3xl mx-auto">
          <h3 className="font-heading text-xl text-text-primary mb-6 text-center">
            Ownership Structure
          </h3>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-bg-secondary border border-tree-gold rounded-lg px-6 py-3 text-center">
              <p className="text-tree-gold text-xs font-heading tracking-wide">
                FOUNDER
              </p>
              <p className="text-text-primary">{founderName}</p>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="bg-bg-secondary border border-border rounded-lg px-6 py-3 text-center">
              <p className="text-text-muted text-xs font-heading tracking-wide">
                HOLDING
              </p>
              <p className="text-text-primary">{holdingName}</p>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="bg-bg-secondary border border-tree-green rounded-lg px-6 py-3 text-center">
              <p className="text-tree-green text-xs font-heading tracking-wide">
                OPERATING
              </p>
              <p className="text-text-primary">{operatingName}</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-text-muted text-xs font-heading tracking-wide mb-3">
              FOUNDING PARTNERS
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {foundingPartners.map((name) => (
                <span
                  key={name}
                  className="bg-bg-secondary border border-border rounded-full px-4 py-1.5 text-sm text-text-primary"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 pb-12 max-w-4xl mx-auto" aria-label="Growth map">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-3 w-3 rounded-full bg-tree-gold shadow-[0_0_12px_rgba(202,138,4,0.55)]" />
          <div>
            <p className="text-tree-gold text-xs font-heading tracking-widest uppercase">
              Root to outcome
            </p>
            <p className="text-text-muted text-sm">
              Each block is a branch in this era&apos;s growth system.
            </p>
          </div>
        </div>
        <div className="relative pl-6 border-l border-tree-green/60 space-y-3">
          {publicContentBlocks.slice(0, 4).map((block, index) => (
            <div key={block.id} className="relative flex items-center gap-3">
              <span className="absolute -left-[31px] h-3 w-3 rounded-full border-2 border-tree-green bg-bg-primary" />
              <span className="text-tree-green text-xs font-heading">
                BRANCH {index + 1}
              </span>
              <span className="text-text-primary text-sm break-words">
                {block.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 max-w-3xl mx-auto">
        {publicContentBlocks.length === 0 ? (
          <p className="text-text-muted text-center">
            No content yet for this era.
          </p>
        ) : (
          <div className="space-y-4">
            {publicContentBlocks.map((block) => (
              <CardThemeContent key={block.id} block={block} theme="TREE" />
            ))}
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
                theme="TREE"
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
