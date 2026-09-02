"use client";

import { useRouter } from "next/navigation";
import { deleteEra } from "@/lib/actions/era";

export default function DeleteEraButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Move this era to trash? You can restore it later.")) {
      return;
    }
    await deleteEra(id);
    router.refresh();
  };

  return (
    <button onClick={handleDelete} className="text-red-400 hover:underline">
      Delete
    </button>
  );
}
