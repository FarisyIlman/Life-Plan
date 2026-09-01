"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAdminUser } from "@/lib/actions/admin-user";

export default function DeleteAdminButton({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Delete this admin account? This cannot be undone.")) return;

    const res = await deleteAdminUser(id);
    if (res?.error) {
      setError(res.error._form?.[0] || "Failed to delete admin.");
      return;
    }
    router.refresh();
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        className="text-red-400 hover:underline text-sm"
      >
        Delete
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
