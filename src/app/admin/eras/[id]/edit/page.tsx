import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditEraForm from "./edit-form";

export default async function EditEraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const era = await prisma.era.findUnique({ where: { id } });

  if (!era) notFound();

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-6">Edit Era</h1>
      <EditEraForm era={era} />
    </main>
  );
}
