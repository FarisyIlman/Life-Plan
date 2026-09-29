import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import DeleteAchievementButton from "./delete-button";
import { Plus } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-text-muted",
  UNDER_ACHIEVED: "text-red-400",
  ACHIEVED: "text-green-400",
  OVER_ACHIEVED: "text-galaxy-gold",
};

const MONETARY_CATEGORIES = ["SALARY", "SAVING", "INVESTMENT"];

function formatValue(value: number, category: string) {
  if (MONETARY_CATEGORIES.includes(category)) {
    return `Rp ${value.toLocaleString("id-ID")}`;
  }
  return value.toLocaleString("id-ID");
}

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const goals = await prisma.achievementGoal.findMany({
    orderBy: [{ year: "asc" }, { category: "asc" }],
    include: { era: { select: { title: true } } },
  });

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Achievement goals</h1>
          <p className="admin-page-description">
            Track targets and choose what values or evidence may appear
            publicly.
          </p>
        </div>
        <Link
          href="/admin/achievements/new"
          className="inline-flex min-h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition hover:brightness-110"
        >
          <Plus size={16} aria-hidden="true" />
          New goal
        </Link>
      </header>

      <div className="admin-panel overflow-x-auto">
        <table className="w-full border-collapse min-w-175">
          <thead>
            <tr className="border-b border-border text-text-muted text-left text-sm">
              <th className="py-2">Era</th>
              <th className="py-2">Year</th>
              <th className="py-2">Category</th>
              <th className="py-2">Target (Min/Ideal)</th>
              <th className="py-2">Actual</th>
              <th className="py-2">Status</th>
              <th className="py-2">Visibility</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr key={goal.id} className="border-b border-border">
                <td className="py-3 text-text-muted">{goal.era.title}</td>
                <td className="py-3">{goal.year}</td>
                <td className="py-3">{goal.category}</td>
                <td className="py-3 text-text-muted">
                  {formatValue(goal.targetMin, goal.category)} /{" "}
                  {formatValue(goal.targetIdeal, goal.category)}
                </td>
                <td className="py-3">
                  {goal.actualValue != null
                    ? formatValue(goal.actualValue, goal.category)
                    : "-"}
                </td>
                <td className="py-3">
                  <span className={STATUS_COLORS[goal.status]}>
                    {goal.status.replace("_", " ")}
                  </span>
                </td>
                <td className="py-3 text-text-muted">{goal.visibility}</td>
                <td className="py-3 space-x-3">
                  <Link
                    href={`/admin/achievements/${goal.id}/edit`}
                    className="text-accent hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteAchievementButton id={goal.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {goals.length === 0 && (
        <p className="text-text-muted mt-8">
          No achievement goals yet. Create your first one.
        </p>
      )}
    </main>
  );
}
