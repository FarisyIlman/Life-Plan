import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteAdminButton from "./delete-button";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl">Admin Users</h1>
        <Link
          href="/admin/users/new"
          className="bg-accent text-white px-4 py-2 rounded font-heading hover:opacity-90"
        >
          + New Admin
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
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
