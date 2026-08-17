import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GalaxyEraView from "./galaxy-era-view";
import MonthlyEraView from "./monthly-era-view";

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

  const allEras = await prisma.era.findMany({
    where: { isPublished: true },
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
    default:
      return <GalaxyEraView era={era} prevEra={prevEra} nextEra={nextEra} />;
  }
}
