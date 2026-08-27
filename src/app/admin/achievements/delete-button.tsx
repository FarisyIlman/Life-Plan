"use client";

import { useRouter } from "next/navigation";
import { deleteAchievementGoal } from "@/lib/actions/achievement-goal";

export default function DeleteAchievementButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this achievement goal?")) return;
    await deleteAchievementGoal(id);
    router.refresh();
  };

  return (
    <button onClick={handleDelete} className="text-red-400 hover:underline">
      Delete
    </button>
  );
}
