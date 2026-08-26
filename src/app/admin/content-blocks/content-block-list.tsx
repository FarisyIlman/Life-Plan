"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ContentBlock, Era } from "@prisma/client";
import { reorderContentBlocks } from "@/lib/actions/content-block";
import DeleteContentBlockButton from "./delete-button";
import ToggleCompleteButton from "./toggle-complete-button";

type BlockWithEra = ContentBlock & { era: Era };

export default function ContentBlockList({
  blocks: initialBlocks,
  draggable,
}: {
  blocks: BlockWithEra[];
  draggable: boolean;
}) {
  const router = useRouter();
  const [blocks, setBlocks] = useState(initialBlocks);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Group by era, preserving era order of first appearance
  const grouped = new Map<string, { era: Era; items: BlockWithEra[] }>();
  for (const block of blocks) {
    if (!grouped.has(block.eraId)) {
      grouped.set(block.eraId, { era: block.era, items: [] });
    }
    grouped.get(block.eraId)!.items.push(block);
  }

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDragOver = (
    e: React.DragEvent,
    overId: string,
    eraId: string,
  ) => {
    e.preventDefault();
    if (!draggedId || draggedId === overId) return;

    const draggedBlock = blocks.find((b) => b.id === draggedId);
    if (!draggedBlock || draggedBlock.eraId !== eraId) return; // only reorder within same era

    const draggedIndex = blocks.findIndex((b) => b.id === draggedId);
    const overIndex = blocks.findIndex((b) => b.id === overId);
    if (draggedIndex === -1 || overIndex === -1) return;

    const reordered = [...blocks];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(overIndex, 0, moved);
    setBlocks(reordered);
  };

  const handleDragEnd = async (eraId: string) => {
    setDraggedId(null);
    const idsInEra = blocks.filter((b) => b.eraId === eraId).map((b) => b.id);
    await reorderContentBlocks(idsInEra);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {Array.from(grouped.values()).map(({ era, items }) => (
        <div key={era.id}>
          <h3 className="font-heading text-lg text-text-primary mb-2">
            {era.title}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border text-text-muted text-left text-sm">
                  {draggable && <th className="py-2 w-8">⋮⋮</th>}
                  <th className="py-2">Type</th>
                  <th className="py-2">Title</th>
                  <th className="py-2">Deadline</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Completed</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((block) => (
                  <tr
                    key={block.id}
                    draggable={draggable}
                    onDragStart={() => draggable && handleDragStart(block.id)}
                    onDragOver={(e) =>
                      draggable && handleDragOver(e, block.id, era.id)
                    }
                    onDragEnd={() => draggable && handleDragEnd(era.id)}
                    className={`border-b border-border ${
                      draggable ? "cursor-move" : ""
                    } ${draggedId === block.id ? "opacity-40" : ""}`}
                  >
                    {draggable && (
                      <td className="py-3 text-text-muted select-none">⋮⋮</td>
                    )}
                    <td className="py-3">{block.type}</td>
                    <td className="py-3">{block.title}</td>
                    <td className="py-3 text-text-muted">
                      {block.deadline
                        ? new Date(block.deadline).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                    <td className="py-3">
                      <span
                        className={
                          block.isPublished
                            ? "text-green-400"
                            : "text-text-muted"
                        }
                      >
                        {block.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3">
                      <ToggleCompleteButton
                        id={block.id}
                        isCompleted={block.isCompleted}
                      />
                    </td>
                    <td className="py-3 space-x-3">
                      <Link
                        href={`/admin/content-blocks/${block.id}/edit`}
                        className="text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteContentBlockButton id={block.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
