"use client";

import { useRouter } from "next/navigation";
import { deleteContentBlock } from "@/lib/actions/content-block";

export default function DeleteContentBlockButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm("Move this content block to trash? You can restore it later.")
    ) {
      return;
    }
    await deleteContentBlock(id);
    router.refresh();
  };

  return (
    <button onClick={handleDelete} className="text-red-400 hover:underline">
      Delete
    </button>
  );
}
