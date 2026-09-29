import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import AdminNavigation from "./admin-navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Only fetch unread count if logged in (login page itself has no session yet)
  const unreadCount = session?.user
    ? await prisma.notification.count({ where: { isRead: false } })
    : 0;

  return (
    <div className="admin-theme min-h-screen bg-admin-canvas text-admin-text">
      {session?.user ? (
        <>
          <AdminNavigation unreadCount={unreadCount} />
          <div className="min-w-0 lg:ml-64">{children}</div>
        </>
      ) : (
        children
      )}
    </div>
  );
}
