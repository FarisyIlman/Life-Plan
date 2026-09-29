import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import MarkReadButton from "./mark-read-button";
import MarkAllReadButton from "./mark-all-read-button";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    include: { contentBlock: { select: { title: true } } },
  });

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Notifications</h1>
          <p className="admin-page-description">
            Deadline reminders and activity that may need your attention.
          </p>
        </div>
        {hasUnread && <MarkAllReadButton />}
      </header>

      <section
        className="admin-panel max-w-4xl overflow-hidden"
        aria-label="Notification list"
      >
        <ul className="divide-y divide-border">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`flex items-center justify-between gap-4 border-l-2 p-4 sm:px-5 ${
                notif.isRead
                  ? "border-l-transparent opacity-70"
                  : "border-l-accent bg-admin-raised/40"
              }`}
            >
              <div className="min-w-0">
                <span
                  className={`text-xs font-heading tracking-wide mr-2 ${
                    notif.type === "DEADLINE_1D"
                      ? "text-status-danger"
                      : notif.type === "DEADLINE_3D"
                        ? "text-status-warning"
                        : "text-status-neutral"
                  }`}
                >
                  {notif.type.replace("_", " ")}
                </span>
                <p className="text-text-primary text-sm mt-1">
                  {notif.message}
                </p>
                <p className="text-text-muted text-xs mt-1">
                  {new Date(notif.createdAt).toLocaleString("en-GB")}
                </p>
              </div>
              {!notif.isRead && <MarkReadButton id={notif.id} />}
            </li>
          ))}
        </ul>

        {notifications.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-text-muted">
            No notifications yet.
          </p>
        )}
      </section>
    </main>
  );
}
