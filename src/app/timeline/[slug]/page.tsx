import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getPublicAchievementGoals } from "@/lib/achievement-visibility";
import GalaxyEraView from "./galaxy-era-view";
import MonthlyEraView from "./monthly-era-view";
import RacingEraView from "./racing-era-view";
import VoyageEraView from "./voyage-era-view";
import TreeEraView from "./tree-era-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const era = await prisma.era.findFirst({
    where: { slug, deletedAt: null, isPublished: true },
  });

  if (!era) return { title: "Not Found" };

  return {
    title: `${era.title} | Through The Time`,
    description: era.description || `Explore the ${era.title} era.`,
    alternates: { canonical: `/timeline/${era.slug}` },
    openGraph: {
      title: `${era.title} | Through The Time`,
      description: era.description || `Explore the ${era.title} era.`,
      url: `/timeline/${era.slug}`,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${era.title} | Through The Time`,
      description: era.description || `Explore the ${era.title} era.`,
      images: ["/opengraph-image"],
    },
  };
}

export default async function EraDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const era = await prisma.era.findUnique({
    where: { slug, deletedAt: null, isPublished: true },
    include: {
      contentBlocks: {
        where: { isPublished: true, deletedAt: null },
        orderBy: { order: "asc" },
        include: {
          achievementGoal: {
            select: {
              year: true,
              category: true,
              status: true,
              visibility: true,
            },
          },
        },
      },
      achievementGoals: {
        where: { visibility: { not: "PRIVATE" } },
        orderBy: [{ year: "asc" }, { category: "asc" }],
      },
    },
  });

  if (!era || !era.isPublished) notFound();

  const eraWithGoalContext = {
    ...era,
    contentBlocks: era.contentBlocks.map((block) => {
      const { achievementGoal, ...publicBlock } = block;

      return {
        ...publicBlock,
        data: {
          ...(typeof block.data === "object" && block.data !== null
            ? block.data
            : {}),
          linkedGoal:
            achievementGoal && achievementGoal.visibility !== "PRIVATE"
              ? {
                  year: achievementGoal.year,
                  category: achievementGoal.category,
                  status: achievementGoal.status,
                }
              : null,
        },
      };
    }),
    achievementGoals: getPublicAchievementGoals(era.achievementGoals),
  };

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
      return (
        <GalaxyEraView
          era={eraWithGoalContext}
          prevEra={prevEra}
          nextEra={nextEra}
        />
      );
    case "MONTHLY":
      return (
        <MonthlyEraView
          era={eraWithGoalContext}
          prevEra={prevEra}
          nextEra={nextEra}
        />
      );
    case "RACING":
      return (
        <RacingEraView
          era={eraWithGoalContext}
          prevEra={prevEra}
          nextEra={nextEra}
        />
      );
    case "VOYAGE": {
      const flowchartNodes = await prisma.masterDegreeNode.findMany({
        orderBy: { createdAt: "asc" },
      });
      return (
        <VoyageEraView
          era={eraWithGoalContext}
          prevEra={prevEra}
          nextEra={nextEra}
          flowchartNodes={flowchartNodes}
        />
      );
    }
    case "TREE":
      return (
        <TreeEraView
          era={eraWithGoalContext}
          prevEra={prevEra}
          nextEra={nextEra}
        />
      );
    default:
      return (
        <TreeEraView
          era={eraWithGoalContext}
          prevEra={prevEra}
          nextEra={nextEra}
        />
      );
  }
}
