import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditEraForm from "./edit-form";

export default async function EditEraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const era = await prisma.era.findUnique({ where: { id } });

  if (!era) notFound();

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit era</h1>
          <p className="admin-page-description">
            Update this chapter while keeping its published content intact.
          </p>
        </div>
      </header>
      <EditEraForm era={era} />
    </main>
  );
}
