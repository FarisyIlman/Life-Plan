import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import TimelineClient from "./timeline-client";

export const metadata: Metadata = {
  title: "Timeline — Farisy's Life Journey",
  description: "The full journey from 2026 into the future.",
};

export default async function TimelinePage() {
  const eras = await prisma.era.findMany({
    where: { isPublished: true, deletedAt: null },
    orderBy: { order: "asc" },
    include: {
      contentBlocks: {
        where: { isPublished: true, deletedAt: null },
        select: { data: true, deadline: true, isCompleted: true },
      },
      achievementGoals: { select: { id: true } },
    },
  });

  const summary = eras.reduce(
    (result, era) => {
      result.goals += era.achievementGoals.length;
      result.projects += era.contentBlocks.length;
      result.completed += era.contentBlocks.filter(
        (block) => block.isCompleted,
      ).length;
      result.evidence += era.contentBlocks.filter((block) => {
        const data = block.data as {
          evidenceUrl?: string;
          visibility?: string;
        };
        return Boolean(data.evidenceUrl) && data.visibility !== "PRIVATE";
      }).length;
      result.upcoming += era.contentBlocks.filter(
        (block) => block.deadline && block.deadline >= new Date(),
      ).length;
      return result;
    },
    { goals: 0, projects: 0, completed: 0, evidence: 0, upcoming: 0 },
  );

  return <TimelineClient eras={eras} summary={summary} />;
}
