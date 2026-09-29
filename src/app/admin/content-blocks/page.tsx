import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import { Plus, Search, X } from "lucide-react";
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
    where: { deletedAt: null },
    orderBy: { order: "asc" },
    select: { id: true, title: true, theme: true },
  });

  const where: Record<string, unknown> = { deletedAt: null };

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
    where: { deletedAt: null },
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

  const hasActiveFilters = !!(filter || q || eraId || theme || published);

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Content blocks</h1>
          <p className="admin-page-description">
            Find, edit, and publish milestones across your timeline.
          </p>
        </div>
        <Link
          href="/admin/content-blocks/new"
          className="inline-flex min-h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition hover:brightness-110"
        >
          <Plus size={16} aria-hidden="true" />
          New content block
        </Link>
      </header>

      {progressByEra.size > 0 && (
        <section className="mb-6" aria-label="Progress by era">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Progress by era
          </h2>
          <div className="admin-panel divide-y divide-border overflow-hidden">
            {Array.from(progressByEra.values()).map((entry) => {
              const pct =
                entry.total > 0
                  ? Math.round((entry.completed / entry.total) * 100)
                  : 0;
              return (
                <div
                  key={entry.title}
                  className="grid grid-cols-1 items-center gap-2 px-4 py-3 sm:grid-cols-[minmax(10rem,0.8fr)_minmax(12rem,2fr)_auto] sm:gap-5"
                >
                  <p className="truncate text-sm font-medium text-text-primary">
                    {entry.title}
                  </p>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-bg-primary"
                    role="progressbar"
                    aria-label={`${entry.title} completion`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                  >
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-muted sm:text-right">
                    {entry.completed}/{entry.total} complete · {pct}%
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <form
        action="/admin/content-blocks"
        method="get"
        className="admin-panel mb-6 grid grid-cols-1 items-end gap-3 p-4 sm:grid-cols-2 xl:grid-cols-[minmax(14rem,1.5fr)_repeat(4,minmax(9rem,1fr))_auto]"
      >
        <div>
          <label
            htmlFor="content-search"
            className="mb-1.5 block text-xs font-medium text-text-muted"
          >
            Search
          </label>
          <input
            id="content-search"
            type="search"
            name="q"
            defaultValue={q || ""}
            placeholder="Search titles"
            className="min-h-10 w-full rounded-md border border-border bg-bg-primary px-3 text-sm text-text-primary placeholder:text-text-muted"
          />
        </div>
        <div>
          <label
            htmlFor="filter-era"
            className="mb-1.5 block text-xs font-medium text-text-muted"
          >
            Era
          </label>
          <select
            id="filter-era"
            name="eraId"
            defaultValue={eraId || ""}
            className="min-h-10 w-full rounded-md border border-border bg-bg-primary px-3 text-sm text-text-primary"
          >
            <option value="">All eras</option>
            {eras.map((era) => (
              <option key={era.id} value={era.id}>
                {era.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="filter-theme"
            className="mb-1.5 block text-xs font-medium text-text-muted"
          >
            Theme
          </label>
          <select
            id="filter-theme"
            name="theme"
            defaultValue={theme || ""}
            className="min-h-10 w-full rounded-md border border-border bg-bg-primary px-3 text-sm text-text-primary"
          >
            <option value="">All themes</option>
            {THEMES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="filter-published"
            className="mb-1.5 block text-xs font-medium text-text-muted"
          >
            Publication
          </label>
          <select
            id="filter-published"
            name="published"
            defaultValue={published || ""}
            className="min-h-10 w-full rounded-md border border-border bg-bg-primary px-3 text-sm text-text-primary"
          >
            <option value="">All content</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="filter-completion"
            className="mb-1.5 block text-xs font-medium text-text-muted"
          >
            Completion
          </label>
          <select
            id="filter-completion"
            name="filter"
            defaultValue={filter || ""}
            className="min-h-10 w-full rounded-md border border-border bg-bg-primary px-3 text-sm text-text-primary"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-white transition hover:brightness-110"
          >
            <Search size={15} aria-hidden="true" />
            Apply
          </button>
          {hasActiveFilters && (
            <Link
              href="/admin/content-blocks"
              aria-label="Clear all filters"
              title="Clear all filters"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-text-muted transition hover:bg-admin-raised hover:text-text-primary"
            >
              <X size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </form>

      {blocks.length === 0 ? (
        <div className="admin-panel px-5 py-10 text-center">
          <p className="text-sm font-medium text-text-primary">
            No content blocks match these filters.
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Adjust the search or filter values and try again.
          </p>
          {hasActiveFilters && (
            <Link
              href="/admin/content-blocks"
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 text-sm text-text-primary hover:bg-admin-raised"
            >
              <X size={15} aria-hidden="true" />
              Clear filters
            </Link>
          )}
        </div>
      ) : (
        <ContentBlockList blocks={blocks} draggable={!hasActiveFilters} />
      )}
    </main>
  );
}
