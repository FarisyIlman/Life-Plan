import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import EditContentBlockForm from "./edit-form";

export default async function EditContentBlockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  const [block, eras] = await Promise.all([
    prisma.contentBlock.findUnique({ where: { id } }),
    prisma.era.findMany({
      orderBy: { order: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  if (!block) notFound();

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-6">Edit Content Block</h1>
      <EditContentBlockForm block={block} eras={eras} />
    </main>
  );
}
