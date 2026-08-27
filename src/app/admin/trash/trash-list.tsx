"use client";

import { useState } from "react";
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
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRestoreEra = async (id: string) => {
    setLoadingId(id);
    setError(null);
    const res = await restoreEra(id);
    setLoadingId(null);
    if (res?.error) {
      setError(res.error._form?.[0] || "Failed to restore era.");
      return;
    }
    router.refresh();
  };

  const handlePermanentEra = async (id: string) => {
    if (!confirm("Permanently delete this era? This cannot be undone.")) return;
    setLoadingId(id);
    setError(null);
    const res = await permanentlyDeleteEra(id);
    setLoadingId(null);
    if (res?.error) {
      setError(res.error._form?.[0] || "Failed to delete era.");
      return;
    }
    router.refresh();
  };

  const handleRestoreBlock = async (id: string) => {
    setLoadingId(id);
    setError(null);
    const res = await restoreContentBlock(id);
    setLoadingId(null);
    if (res?.error) {
      setError(res.error._form?.[0] || "Failed to restore content block.");
      return;
    }
    router.refresh();
  };

  const handlePermanentBlock = async (id: string) => {
    if (
      !confirm("Permanently delete this content block? This cannot be undone.")
    )
      return;
    setLoadingId(id);
    setError(null);
    const res = await permanentlyDeleteContentBlock(id);
    setLoadingId(null);
    if (res?.error) {
      setError(res.error._form?.[0] || "Failed to delete content block.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-10">
      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded p-3">
          {error}
        </p>
      )}

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
                    disabled={loadingId !== null}
                    onClick={() => handleRestoreEra(era.id)}
                    className="text-accent hover:underline text-sm disabled:opacity-50"
                  >
                    {loadingId === era.id ? "..." : "Restore"}
                  </button>
                  <button
                    disabled={loadingId !== null}
                    onClick={() => handlePermanentEra(era.id)}
                    className="text-red-400 hover:underline text-sm disabled:opacity-50"
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
                    disabled={loadingId !== null}
                    onClick={() => handleRestoreBlock(block.id)}
                    className="text-accent hover:underline text-sm disabled:opacity-50"
                  >
                    {loadingId === block.id ? "..." : "Restore"}
                  </button>
                  <button
                    disabled={loadingId !== null}
                    onClick={() => handlePermanentBlock(block.id)}
                    className="text-red-400 hover:underline text-sm disabled:opacity-50"
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
