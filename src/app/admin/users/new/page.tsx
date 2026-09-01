import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import NewAdminForm from "./new-form";

export default async function NewAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-6">New Admin</h1>
      <NewAdminForm />
    </main>
  );
}
