"use client";

import {
  Archive,
  Award,
  Bell,
  CalendarDays,
  ChevronRight,
  FileStack,
  GitBranch,
  LayoutDashboard,
  Layers,
  Menu,
  ScrollText,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Planning",
    items: [
      { label: "Eras", href: "/admin/eras", icon: Layers },
      {
        label: "Content blocks",
        href: "/admin/content-blocks",
        icon: FileStack,
      },
      { label: "Achievements", href: "/admin/achievements", icon: Award },
      { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
      { label: "Master flow", href: "/admin/master-degree", icon: GitBranch },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "Admin users", href: "/admin/users", icon: Users },
      { label: "Activity log", href: "/admin/logs", icon: ScrollText },
      { label: "Trash", href: "/admin/trash", icon: Archive },
    ],
  },
] as const;

function NavigationLinks({
  unreadCount,
  onNavigate,
}: {
  unreadCount: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="space-y-7">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-admin-muted">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map(({ label, href, icon: Icon }) => {
              const isActive =
                pathname === href ||
                (href !== "/admin/dashboard" &&
                  pathname.startsWith(`${href}/`));

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex min-h-11 items-center gap-3 rounded-md border px-3 text-sm transition-colors ${
                    isActive
                      ? "border-admin-accent/25 bg-admin-active text-admin-text"
                      : "border-transparent text-admin-muted hover:bg-admin-raised hover:text-admin-text"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {href === "/admin/notifications" && unreadCount > 0 && (
                    <span
                      aria-label={`${unreadCount} unread notifications`}
                      className="min-w-5 rounded-full bg-admin-danger px-1.5 py-0.5 text-center text-[10px] font-semibold leading-4 text-white"
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight
                      size={15}
                      className="text-admin-accent"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function AdminNavigation({
  unreadCount,
}: {
  unreadCount: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-admin-border bg-admin-canvas/95 px-4 backdrop-blur lg:hidden">
        <Link
          href="/admin/dashboard"
          className="font-heading text-sm font-semibold text-admin-text"
        >
          LIFE PLAN <span className="ml-1 text-admin-muted">/ ADMIN</span>
        </Link>
        <button
          type="button"
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex size-10 items-center justify-center rounded-md border border-admin-border text-admin-text hover:bg-admin-raised"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-admin-border bg-admin-sidebar px-3 py-5 lg:flex">
        <Link
          href="/admin/dashboard"
          className="mb-9 flex items-center gap-3 px-3"
        >
          <span className="flex size-9 items-center justify-center rounded-md border border-admin-accent/30 bg-admin-active font-heading text-sm font-bold text-admin-accent">
            LP
          </span>
          <span>
            <span className="block font-heading text-sm font-semibold text-admin-text">
              Life Plan
            </span>
            <span className="block text-xs text-admin-muted">
              Admin workspace
            </span>
          </span>
        </Link>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          <NavigationLinks unreadCount={unreadCount} />
        </div>
        <div className="mt-5 border-t border-admin-border px-3 pt-4 text-xs text-admin-muted">
          Through The Time
        </div>
      </aside>

      <div
        id="admin-mobile-navigation"
        hidden={!mobileOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape") setMobileOpen(false);
        }}
        className="fixed inset-x-0 bottom-0 top-14 z-30 overflow-y-auto border-b border-admin-border bg-admin-sidebar px-4 py-6 shadow-xl lg:hidden"
      >
        <NavigationLinks
          unreadCount={unreadCount}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>
    </>
  );
}
