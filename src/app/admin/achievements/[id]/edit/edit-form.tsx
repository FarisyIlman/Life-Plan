"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAchievementGoal } from "@/lib/actions/achievement-goal";
import type { AchievementGoal } from "@prisma/client";

const CATEGORIES = [
  "SALARY",
  "SAVING",
  "ACADEMIC",
  "INVESTMENT",
  "CERTIFICATION",
] as const;
const STATUSES = [
  "PENDING",
  "UNDER_ACHIEVED",
  "ACHIEVED",
  "OVER_ACHIEVED",
] as const;
const MONETARY_CATEGORIES = ["SALARY", "SAVING", "INVESTMENT"];

export default function EditAchievementForm({
  goal,
  eras,
}: {
  goal: AchievementGoal;
  eras: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    goal.category,
  );

  const isMonetary = MONETARY_CATEGORIES.includes(selectedCategory);
  const unitLabel = isMonetary ? " (Rp)" : "";

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors({});

    const res = await updateAchievementGoal(goal.id, formData);

    setLoading(false);

    if (res?.error) {
      setErrors(res.error);
      return;
    }

    router.push("/admin/achievements");
  };

  return (
    <form action={handleSubmit} className="max-w-lg space-y-4">
      {errors._form && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded p-3">
          {errors._form[0]}
        </p>
      )}

      <div>
        <label className="block text-text-muted text-sm mb-1">Era</label>
        <select
          name="eraId"
          defaultValue={goal.eraId}
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        >
          {eras.map((era) => (
            <option key={era.id} value={era.id}>
              {era.title}
            </option>
          ))}
        </select>
        {errors.eraId && (
          <p className="text-red-400 text-sm mt-1">{errors.eraId[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">Year</label>
        <input
          name="year"
          type="number"
          defaultValue={goal.year}
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
        {errors.year && (
          <p className="text-red-400 text-sm mt-1">{errors.year[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">Category</label>
        <select
          name="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-400 text-sm mt-1">{errors.category[0]}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-text-muted text-sm mb-1">
            Target Min{unitLabel}
          </label>
          <input
            name="targetMin"
            type="number"
            step="any"
            defaultValue={goal.targetMin}
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
          {errors.targetMin && (
            <p className="text-red-400 text-sm mt-1">{errors.targetMin[0]}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-text-muted text-sm mb-1">
            Target Ideal{unitLabel}
          </label>
          <input
            name="targetIdeal"
            type="number"
            step="any"
            defaultValue={goal.targetIdeal}
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
          {errors.targetIdeal && (
            <p className="text-red-400 text-sm mt-1">{errors.targetIdeal[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">
          Actual Value{unitLabel} (optional)
        </label>
        <input
          name="actualValue"
          type="number"
          step="any"
          defaultValue={goal.actualValue ?? ""}
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">Status</label>
        <select
          name="status"
          defaultValue={goal.status}
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">
          Note (optional)
        </label>
        <textarea
          name="note"
          rows={3}
          defaultValue={goal.note ?? ""}
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-white px-6 py-2 rounded font-heading hover:opacity-90"
      >
        {loading ? "Saving..." : "Update Goal"}
      </button>
    </form>
  );
}
