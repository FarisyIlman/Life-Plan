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
  });

  return <TimelineClient eras={eras} />;
}
