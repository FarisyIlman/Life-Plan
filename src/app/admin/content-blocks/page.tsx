import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import ContentBlockList from "./content-block-list";

const THEMES = ["GALAXY", "MONTHLY", "RACING", "VOYAGE", "TREE"] as const;

export default async function ContentBlocksPage({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: string;
    q?: string;
    eraId?: string;
    theme?: string;
    published?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { filter, q, eraId, theme, published } = await searchParams;

  const eras = await prisma.era.findMany({
    orderBy: { order: "asc" },
    select: { id: true, title: true, theme: true },
  });

  const where: Record<string, unknown> = {};

  if (filter === "completed") where.isCompleted = true;
  if (filter === "pending") where.isCompleted = false;
  if (q) where.title = { contains: q, mode: "insensitive" };
  if (eraId) where.eraId = eraId;
  if (published === "true") where.isPublished = true;
  if (published === "false") where.isPublished = false;
  if (theme) where.era = { theme };

  const blocks = await prisma.contentBlock.findMany({
    where,
    orderBy: [{ eraId: "asc" }, { order: "asc" }],
    include: { era: true },
  });

  const allBlocks = await prisma.contentBlock.findMany({
    include: { era: { select: { title: true, id: true } } },
  });

  const progressByEra = new Map<
    string,
    { title: string; total: number; completed: number }
  >();

  for (const block of allBlocks) {
    const key = block.era.id;
    if (!progressByEra.has(key)) {
      progressByEra.set(key, {
        title: block.era.title,
        total: 0,
        completed: 0,
      });
    }
    const entry = progressByEra.get(key)!;
    entry.total++;
    if (block.isCompleted) entry.completed++;
  }

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { filter, q, eraId, theme, published, ...overrides };
    Object.entries(merged).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const qs = params.toString();
    return qs ? `/admin/content-blocks?${qs}` : "/admin/content-blocks";
  };

  const hasActiveFilters = !!(filter || q || eraId || theme || published);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl">Content Blocks</h1>
        <Link
          href="/admin/content-blocks/new"
          className="bg-accent text-white px-4 py-2 rounded font-heading hover:opacity-90"
        >
          + New Content Block
        </Link>
      </div>

      {/* Progress per era */}
      {progressByEra.size > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array.from(progressByEra.values()).map((entry) => {
            const pct =
              entry.total > 0
                ? Math.round((entry.completed / entry.total) * 100)
                : 0;
            return (
              <div
                key={entry.title}
                className="bg-bg-secondary border border-border rounded-lg p-4"
              >
                <p className="text-text-primary text-sm mb-2">{entry.title}</p>
                <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-text-muted text-xs">
                  {entry.completed}/{entry.total} completed ({pct}%)
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Search bar */}
      <form action="/admin/content-blocks" method="get" className="mb-4">
        {eraId && <input type="hidden" name="eraId" value={eraId} />}
        {theme && <input type="hidden" name="theme" value={theme} />}
        {published && (
          <input type="hidden" name="published" value={published} />
        )}
        {filter && <input type="hidden" name="filter" value={filter} />}
        <input
          type="text"
          name="q"
          defaultValue={q || ""}
          placeholder="Search by title..."
          className="w-full max-w-md p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
      </form>

      {/* Filter dropdowns */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="flex gap-1 flex-wrap">
          <Link
            href={buildQuery({ eraId: undefined })}
            className={`px-3 py-1.5 rounded text-xs ${
              !eraId
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-muted hover:text-text-primary"
            }`}
          >
            All Eras
          </Link>
          {eras.map((era) => (
            <Link
              key={era.id}
              href={buildQuery({ eraId: era.id })}
              className={`px-3 py-1.5 rounded text-xs ${
                eraId === era.id
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-muted hover:text-text-primary"
              }`}
            >
              {era.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex gap-1 flex-wrap">
          <Link
            href={buildQuery({ theme: undefined })}
            className={`px-3 py-1.5 rounded text-xs ${
              !theme
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-muted hover:text-text-primary"
            }`}
          >
            All Themes
          </Link>
          {THEMES.map((t) => (
            <Link
              key={t}
              href={buildQuery({ theme: t })}
              className={`px-3 py-1.5 rounded text-xs ${
                theme === t
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-muted hover:text-text-primary"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex gap-1">
          <Link
            href={buildQuery({ published: undefined })}
            className={`px-3 py-1.5 rounded text-xs ${
              !published
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-muted hover:text-text-primary"
            }`}
          >
            All
          </Link>
          <Link
            href={buildQuery({ published: "true" })}
            className={`px-3 py-1.5 rounded text-xs ${
              published === "true"
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-muted hover:text-text-primary"
            }`}
          >
            Published
          </Link>
          <Link
            href={buildQuery({ published: "false" })}
            className={`px-3 py-1.5 rounded text-xs ${
              published === "false"
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-muted hover:text-text-primary"
            }`}
          >
            Draft
          </Link>
        </div>

        <div className="flex gap-1">
          <Link
            href={buildQuery({ filter: undefined })}
            className={`px-3 py-1.5 rounded text-xs ${
              !filter
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-muted hover:text-text-primary"
            }`}
          >
            All Status
          </Link>
          <Link
            href={buildQuery({ filter: "pending" })}
            className={`px-3 py-1.5 rounded text-xs ${
              filter === "pending"
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-muted hover:text-text-primary"
            }`}
          >
            Pending
          </Link>
          <Link
            href={buildQuery({ filter: "completed" })}
            className={`px-3 py-1.5 rounded text-xs ${
              filter === "completed"
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-muted hover:text-text-primary"
            }`}
          >
            Completed
          </Link>
        </div>

        {hasActiveFilters && (
          <Link
            href="/admin/content-blocks"
            className="px-3 py-1.5 rounded text-xs text-red-400 hover:underline"
          >
            Clear all filters
          </Link>
        )}
      </div>

      {blocks.length === 0 ? (
        <p className="text-text-muted mt-8">
          No content blocks match your filters.
        </p>
      ) : (
        <ContentBlockList blocks={blocks} draggable={!hasActiveFilters} />
      )}
    </main>
  );
}
