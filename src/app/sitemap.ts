import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";

  const eras = await prisma.era.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const eraUrls: MetadataRoute.Sitemap = eras.map((era) => ({
    url: `${baseUrl}/timeline/${era.slug}`,
    lastModified: era.updatedAt,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    ...eraUrls,
  ];
}
