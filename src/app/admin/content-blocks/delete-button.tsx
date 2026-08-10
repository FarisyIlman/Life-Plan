"use client";

import { deleteContentBlock } from "@/lib/actions/content-block";

export default function DeleteContentBlockButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this content block?")) {
      return;
    }
    await deleteContentBlock(id);
  };

  return (
    <button onClick={handleDelete} className="text-red-400 hover:underline">
      Delete
    </button>
  );
}
