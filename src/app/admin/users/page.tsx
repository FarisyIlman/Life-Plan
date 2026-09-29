import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteAdminButton from "./delete-button";
import { Plus } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admin users</h1>
          <p className="admin-page-description">
            Manage accounts with access to the Life Plan CMS.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex min-h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition hover:brightness-110"
        >
          <Plus size={16} aria-hidden="true" />
          New admin
        </Link>
      </header>

      <div className="admin-panel overflow-x-auto">
        <table className="w-full border-collapse min-w-150">
          <thead>
            <tr className="border-b border-border text-text-muted text-left text-sm">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Username</th>
              <th className="py-2">Joined</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-border">
                <td className="py-3">
                  {admin.name}
                  {admin.id === session.user.id && (
                    <span className="text-accent text-xs ml-2">(you)</span>
                  )}
                </td>
                <td className="py-3 text-text-muted">{admin.email}</td>
                <td className="py-3 text-text-muted">{admin.username}</td>
                <td className="py-3 text-text-muted">
                  {new Date(admin.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="py-3">
                  {admin.id !== session.user.id && (
                    <DeleteAdminButton id={admin.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
