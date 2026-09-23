"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleContentBlockComplete } from "@/lib/actions/content-block";

export default function ToggleCompleteButton({
  id,
  isCompleted,
}: {
  id: string;
  isCompleted: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await toggleContentBlockComplete(id);
      if (result?.error) {
        setError(result.error._form?.[0] || "Failed to update status.");
        return;
      }
      router.refresh();
    } catch {
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`min-h-11 px-2 disabled:opacity-50 ${
          isCompleted
            ? "text-green-400 hover:underline text-sm"
            : "text-text-muted hover:text-accent hover:underline text-sm"
        }`}
      >
        {loading ? "Updating..." : isCompleted ? "✓ Done" : "Mark complete"}
      </button>
      {error && <span className="block text-red-400 text-xs">{error}</span>}
    </span>
  );
}
