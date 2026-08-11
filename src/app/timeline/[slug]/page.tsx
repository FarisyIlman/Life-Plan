import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GalaxyEraView from "./galaxy-era-view";

export default async function EraDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const era = await prisma.era.findUnique({
    where: { slug },
    include: {
      contentBlocks: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!era || !era.isPublished) notFound();

  // Get prev/next era for navigation
  const allEras = await prisma.era.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    select: { slug: true, title: true, order: true },
  });
  const currentIndex = allEras.findIndex((e) => e.slug === slug);
  const prevEra = currentIndex > 0 ? allEras[currentIndex - 1] : null;
  const nextEra =
    currentIndex < allEras.length - 1 ? allEras[currentIndex + 1] : null;

  // Route to theme-specific view based on era.theme
  switch (era.theme) {
    case "GALAXY":
      return <GalaxyEraView era={era} prevEra={prevEra} nextEra={nextEra} />;
    default:
      // Fallback for themes not yet built (Monthly, Racing, etc.)
      return <GalaxyEraView era={era} prevEra={prevEra} nextEra={nextEra} />;
  }
}
