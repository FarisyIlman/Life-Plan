import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";

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
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {session?.user && (
        <nav className="border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 bg-bg-primary z-40">
          <div className="flex items-center gap-5 overflow-x-auto">
            <Link
              href="/admin/dashboard"
              className="font-heading text-sm hover:text-accent whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/eras"
              className="text-sm text-text-muted hover:text-accent whitespace-nowrap"
            >
              Eras
            </Link>
            <Link
              href="/admin/content-blocks"
              className="text-sm text-text-muted hover:text-accent whitespace-nowrap"
            >
              Content
            </Link>
            <Link
              href="/admin/calendar"
              className="text-sm text-text-muted hover:text-accent whitespace-nowrap"
            >
              Calendar
            </Link>
            <Link
              href="/admin/notifications"
              className="relative text-sm text-text-muted hover:text-accent whitespace-nowrap"
            >
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <Link
              href="/admin/logs"
              className="text-sm text-text-muted hover:text-accent whitespace-nowrap"
            >
              Logs
            </Link>
            <Link
              href="/admin/trash"
              className="text-sm text-text-muted hover:text-accent whitespace-nowrap"
            >
              Trash
            </Link>
          </div>
        </nav>
      )}
      {children}
    </div>
  );
}
