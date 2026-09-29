import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";

export default async function LogsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { admin: { select: { name: true, email: true } } },
  });

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Activity log</h1>
          <p className="admin-page-description">
            A recent audit trail of changes made by admin accounts.
          </p>
        </div>
      </header>

      <div className="admin-panel overflow-x-auto">
        <table className="w-full border-collapse min-w-150">
          <thead>
            <tr className="border-b border-border text-text-muted text-left text-sm">
              <th className="py-2">Time</th>
              <th className="py-2">Admin</th>
              <th className="py-2">Action</th>
              <th className="py-2">Entity Type</th>
              <th className="py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border text-sm">
                <td className="py-3 text-text-muted">
                  {new Date(log.createdAt).toLocaleString("en-GB")}
                </td>
                <td className="py-3">{log.admin.name}</td>
                <td className="py-3">
                  <span
                    className={
                      log.action === "CREATE"
                        ? "text-status-success"
                        : log.action === "UPDATE"
                          ? "text-admin-accent"
                          : "text-status-danger"
                    }
                  >
                    {log.action}
                  </span>
                </td>
                <td className="py-3 text-text-muted">{log.entityType}</td>
                <td className="py-3 text-text-muted">
                  {log.detail ? JSON.stringify(log.detail) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <p className="admin-panel mt-4 px-5 py-8 text-center text-sm text-text-muted">
          No activity yet.
        </p>
      )}
    </main>
  );
}
