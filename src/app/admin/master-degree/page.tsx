import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import FlowchartEditor from "./flowchart-editor";

export default async function MasterDegreePage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const nodes = await prisma.masterDegreeNode.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-2">
        Master&apos;s Degree Flowchart
      </h1>
      <p className="text-text-muted text-sm mb-6">
        Drag nodes to reposition. Click a node to edit or delete it.
      </p>
      <FlowchartEditor initialNodes={nodes} />
    </main>
  );
}
