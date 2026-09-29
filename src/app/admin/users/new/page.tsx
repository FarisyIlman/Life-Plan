import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import NewAdminForm from "./new-form";

export default async function NewAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Create admin account</h1>
          <p className="admin-page-description">
            Add an account with full access to the CMS.
          </p>
        </div>
      </header>
      <NewAdminForm />
    </main>
  );
}
