"use client";

import { deleteEra } from "@/lib/actions/era";

export default function DeleteEraButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this era? This cannot be undone.",
      )
    ) {
      return;
    }
    await deleteEra(id);
  };

  return (
    <button onClick={handleDelete} className="text-red-400 hover:underline">
      Delete
    </button>
  );
}
