import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TimelinePreview() {
  const eras = await prisma.era.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  if (eras.length === 0) return null;

  return (
    <section className="py-20 px-6">
      <h2 className="font-heading text-3xl text-center mb-10">The Journey</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {eras.map((era) => (
          <Link
            key={era.id}
            href={`/timeline/${era.slug}`}
            className="bg-bg-secondary border border-border rounded-lg p-6 hover:border-accent transition"
          >
            <p className="text-text-muted text-sm mb-1">
              {era.startYear === era.endYear
                ? era.startYear
                : `${era.startYear}–${era.endYear}`}
            </p>
            <h3 className="font-heading text-xl text-text-primary">
              {era.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
