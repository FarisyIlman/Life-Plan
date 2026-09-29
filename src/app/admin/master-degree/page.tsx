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
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Master&apos;s degree flowchart</h1>
          <p className="admin-page-description">
            Drag nodes to reposition. Select a node to edit or remove it.
          </p>
        </div>
      </header>
      <FlowchartEditor initialNodes={nodes} />
    </main>
  );
}
