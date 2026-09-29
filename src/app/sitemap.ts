import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl().origin;

  const eras = await prisma.era.findMany({
    where: { isPublished: true, deletedAt: null },
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
      url: `${baseUrl}/calendar`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    ...eraUrls,
  ];
}
