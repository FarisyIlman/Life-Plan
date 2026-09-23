"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEra } from "@/lib/actions/era";

export default function DeleteEraButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Move this era to trash? You can restore it later.")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await deleteEra(id);
      if (result?.error) {
        setError(result.error._form?.[0] || "Failed to move era to trash.");
        return;
      }
      router.refresh();
    } catch {
      setError("Failed to move era to trash.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-400 hover:underline disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>
      {error && (
        <span className="block text-red-400 text-xs mt-1">{error}</span>
      )}
    </span>
  );
}
