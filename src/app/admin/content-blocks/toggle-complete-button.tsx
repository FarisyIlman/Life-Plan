"use client";

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

  const handleClick = async () => {
    await toggleContentBlockComplete(id);
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      className={
        isCompleted
          ? "text-green-400 hover:underline text-sm"
          : "text-text-muted hover:text-accent hover:underline text-sm"
      }
    >
      {isCompleted ? "✓ Done" : "Mark complete"}
    </button>
  );
}
