import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import NewEraForm from "./new-form";

export default async function NewEraPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Create era</h1>
          <p className="admin-page-description">
            Define the chapter theme, year range, and publication details.
          </p>
        </div>
      </header>
      <NewEraForm />
    </main>
  );
}
