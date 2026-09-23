"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAchievementGoal } from "@/lib/actions/achievement-goal";

export default function DeleteAchievementButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Delete this achievement goal?")) return;
    setLoading(true);
    setError(null);
    try {
      const result = await deleteAchievementGoal(id);
      if (result?.error) {
        setError(result.error._form?.[0] || "Failed to delete achievement.");
        return;
      }
      router.refresh();
    } catch {
      setError("Failed to delete achievement.");
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
