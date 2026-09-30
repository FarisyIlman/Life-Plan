import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getTimelineSignals, getTimelineSummary } from "@/lib/timeline-utils";
import TimelineClient from "./timeline-client";

export const metadata: Metadata = {
  title: "Timeline — Farisy's Life Journey",
  description: "The full journey from 2026 into the future.",
  alternates: { canonical: "/timeline" },
  openGraph: {
    title: "Timeline — Farisy's Life Journey",
    description: "The full journey from 2026 into the future.",
    url: "/timeline",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Timeline — Farisy's Life Journey",
    description: "The full journey from 2026 into the future.",
    images: ["/opengraph-image"],
  },
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
      achievementGoals: {
        where: { visibility: { not: "PRIVATE" } },
        select: { id: true },
      },
    },
  });

  const now = new Date();
  const summary = getTimelineSummary(eras, now);
  const publicEras = eras.map((era) => ({
    id: era.id,
    slug: era.slug,
    title: era.title,
    theme: era.theme,
    startYear: era.startYear,
    endYear: era.endYear,
    description: era.description,
    signals: getTimelineSignals(era, now),
  }));

  return <TimelineClient eras={publicEras} summary={summary} />;
}
