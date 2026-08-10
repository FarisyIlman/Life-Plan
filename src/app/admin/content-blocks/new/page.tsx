import { prisma } from "@/lib/prisma";
import NewContentBlockForm from "./new-form";

export default async function NewContentBlockPage() {
  const eras = await prisma.era.findMany({
    orderBy: { order: "asc" },
    select: { id: true, title: true },
  });

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-6">New Content Block</h1>
      <NewContentBlockForm eras={eras} />
    </main>
  );
}
