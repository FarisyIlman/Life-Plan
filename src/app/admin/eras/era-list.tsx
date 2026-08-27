"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Era } from "@prisma/client";
import { reorderEras } from "@/lib/actions/era";
import DeleteEraButton from "./delete-button";

export default function EraList({ eras: initialEras }: { eras: Era[] }) {
  const router = useRouter();
  const [eras, setEras] = useState(initialEras);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === overId) return;

    const draggedIndex = eras.findIndex((e) => e.id === draggedId);
    const overIndex = eras.findIndex((e) => e.id === overId);
    if (draggedIndex === -1 || overIndex === -1) return;

    const reordered = [...eras];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(overIndex, 0, moved);
    setEras(reordered);
  };

  const handleDragEnd = async () => {
    setDraggedId(null);
    await reorderEras(eras.map((e) => e.id));
    router.refresh();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-175">
        <thead>
          <tr className="border-b border-border text-text-muted text-left text-sm">
            <th className="py-2">⋮⋮</th>
            <th className="py-2">Order</th>
            <th className="py-2">Title</th>
            <th className="py-2">Slug</th>
            <th className="py-2">Theme</th>
            <th className="py-2">Years</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {eras.map((era, index) => (
            <tr
              key={era.id}
              draggable
              onDragStart={() => handleDragStart(era.id)}
              onDragOver={(e) => handleDragOver(e, era.id)}
              onDragEnd={handleDragEnd}
              className={`border-b border-border cursor-move ${
                draggedId === era.id ? "opacity-40" : ""
              }`}
            >
              <td className="py-3 text-text-muted select-none">⋮⋮</td>
              <td className="py-3">{index}</td>
              <td className="py-3">{era.title}</td>
              <td className="py-3 text-text-muted">{era.slug}</td>
              <td className="py-3">{era.theme}</td>
              <td className="py-3">
                {era.startYear === era.endYear
                  ? era.startYear
                  : `${era.startYear}–${era.endYear}`}
              </td>
              <td className="py-3">
                <span
                  className={
                    era.isPublished ? "text-green-400" : "text-text-muted"
                  }
                >
                  {era.isPublished ? "Published" : "Draft"}
                </span>
              </td>
              <td className="py-3 space-x-3">
                <Link
                  href={`/admin/eras/${era.id}/edit`}
                  className="text-accent hover:underline"
                >
                  Edit
                </Link>
                <DeleteEraButton id={era.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
