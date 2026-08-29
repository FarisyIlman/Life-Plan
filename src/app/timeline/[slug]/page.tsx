import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GalaxyEraView from "./galaxy-era-view";
import MonthlyEraView from "./monthly-era-view";
import RacingEraView from "./racing-era-view";
import VoyageEraView from "./voyage-era-view";
import TreeEraView from "./tree-era-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const era = await prisma.era.findUnique({ where: { slug, deletedAt: null } });

  if (!era) return { title: "Not Found" };

  return {
    title: `${era.title} | Through The Time`,
    description: era.description || `Explore the ${era.title} era.`,
  };
}

export default async function EraDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const era = await prisma.era.findUnique({
    where: { slug, deletedAt: null },
    include: {
      contentBlocks: {
        where: { isPublished: true, deletedAt: null },
        orderBy: { order: "asc" },
      },
      achievementGoals: {
        orderBy: [{ year: "asc" }, { category: "asc" }],
      },
    },
  });

  if (!era || !era.isPublished) notFound();

  const allEras = await prisma.era.findMany({
    where: { isPublished: true, deletedAt: null },
    orderBy: { order: "asc" },
    select: { slug: true, title: true, order: true },
  });
  const currentIndex = allEras.findIndex((e) => e.slug === slug);
  const prevEra = currentIndex > 0 ? allEras[currentIndex - 1] : null;
  const nextEra =
    currentIndex < allEras.length - 1 ? allEras[currentIndex + 1] : null;

  switch (era.theme) {
    case "GALAXY":
      return <GalaxyEraView era={era} prevEra={prevEra} nextEra={nextEra} />;
    case "MONTHLY":
      return <MonthlyEraView era={era} prevEra={prevEra} nextEra={nextEra} />;
    case "RACING":
      return <RacingEraView era={era} prevEra={prevEra} nextEra={nextEra} />;
    case "VOYAGE": {
      const flowchartNodes = await prisma.masterDegreeNode.findMany({
        orderBy: { createdAt: "asc" },
      });
      return (
        <VoyageEraView
          era={era}
          prevEra={prevEra}
          nextEra={nextEra}
          flowchartNodes={flowchartNodes}
        />
      );
    }
    case "TREE":
      return <TreeEraView era={era} prevEra={prevEra} nextEra={nextEra} />;
    default:
      return <TreeEraView era={era} prevEra={prevEra} nextEra={nextEra} />;
  }
}
