import { auth } from "@/../auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl">Admin Dashboard</h1>
      <p className="text-text-muted mt-2">You&apos;re logged in ✅</p>
    </main>
  );
}
