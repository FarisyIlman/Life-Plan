"use client";

import { useRouter } from "next/navigation";
import type { Era, ContentBlock } from "@prisma/client";
import { restoreEra, permanentlyDeleteEra } from "@/lib/actions/era";
import {
  restoreContentBlock,
  permanentlyDeleteContentBlock,
} from "@/lib/actions/content-block";

type BlockWithEra = ContentBlock & { era: { title: string } };

export default function TrashList({
  eras,
  blocks,
}: {
  eras: Era[];
  blocks: BlockWithEra[];
}) {
  const router = useRouter();

  const handleRestoreEra = async (id: string) => {
    await restoreEra(id);
    router.refresh();
  };

  const handlePermanentEra = async (id: string) => {
    if (!confirm("Permanently delete this era? This cannot be undone.")) return;
    await permanentlyDeleteEra(id);
    router.refresh();
  };

  const handleRestoreBlock = async (id: string) => {
    await restoreContentBlock(id);
    router.refresh();
  };

  const handlePermanentBlock = async (id: string) => {
    if (
      !confirm("Permanently delete this content block? This cannot be undone.")
    )
      return;
    await permanentlyDeleteContentBlock(id);
    router.refresh();
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading text-xl mb-4">Deleted Eras</h2>
        {eras.length === 0 ? (
          <p className="text-text-muted text-sm">No deleted eras.</p>
        ) : (
          <div className="space-y-2">
            {eras.map((era) => (
              <div
                key={era.id}
                className="flex justify-between items-center bg-bg-secondary border border-border rounded-lg p-4"
              >
                <div>
                  <p className="text-text-primary text-sm">{era.title}</p>
                  <p className="text-text-muted text-xs">
                    Deleted{" "}
                    {era.deletedAt &&
                      new Date(era.deletedAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => handleRestoreEra(era.id)}
                    className="text-accent hover:underline text-sm"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentEra(era.id)}
                    className="text-red-400 hover:underline text-sm"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-heading text-xl mb-4">Deleted Content Blocks</h2>
        {blocks.length === 0 ? (
          <p className="text-text-muted text-sm">No deleted content blocks.</p>
        ) : (
          <div className="space-y-2">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="flex justify-between items-center bg-bg-secondary border border-border rounded-lg p-4"
              >
                <div>
                  <p className="text-text-primary text-sm">{block.title}</p>
                  <p className="text-text-muted text-xs">
                    {block.era.title} · Deleted{" "}
                    {block.deletedAt &&
                      new Date(block.deletedAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => handleRestoreBlock(block.id)}
                    className="text-accent hover:underline text-sm"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentBlock(block.id)}
                    className="text-red-400 hover:underline text-sm"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
