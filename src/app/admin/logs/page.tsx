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
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-6">Activity Logs</h1>

      <table className="w-full border-collapse">
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
                      ? "text-green-400"
                      : log.action === "UPDATE"
                        ? "text-monthly-blue"
                        : "text-red-400"
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

      {logs.length === 0 && (
        <p className="text-text-muted mt-8">No activity yet.</p>
      )}
    </main>
  );
}
