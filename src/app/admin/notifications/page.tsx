import { prisma } from "@/lib/prisma";
import MarkReadButton from "./mark-read-button";

export default async function NotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    include: { contentBlock: { select: { title: true } } },
  });

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-6">Notifications</h1>

      <div className="space-y-3 max-w-2xl">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex justify-between items-center p-4 rounded-lg border ${
              notif.isRead
                ? "bg-bg-secondary border-border opacity-60"
                : "bg-bg-secondary border-accent"
            }`}
          >
            <div>
              <span
                className={`text-xs font-heading tracking-wide mr-2 ${
                  notif.type === "DEADLINE_1D"
                    ? "text-red-400"
                    : notif.type === "DEADLINE_3D"
                      ? "text-galaxy-gold"
                      : "text-monthly-blue"
                }`}
              >
                {notif.type.replace("_", " ")}
              </span>
              <p className="text-text-primary text-sm mt-1">{notif.message}</p>
              <p className="text-text-muted text-xs mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>
            {!notif.isRead && <MarkReadButton id={notif.id} />}
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <p className="text-text-muted mt-8">No notifications yet.</p>
      )}
    </main>
  );
}
