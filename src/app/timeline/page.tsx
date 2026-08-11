import { prisma } from "@/lib/prisma";
import TimelineClient from "./timeline-client";

export default async function TimelinePage() {
  const eras = await prisma.era.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return <TimelineClient eras={eras} />;
}
