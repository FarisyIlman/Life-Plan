"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAchievementGoal } from "@/lib/actions/achievement-goal";
import type { AchievementGoal } from "@prisma/client";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";

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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(goal.imageUrl || "");
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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      setImageUrl(await uploadToCloudinary(file));
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={handleSubmit} className="admin-form admin-panel">
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
          Public visibility
        </label>
        <select
          name="visibility"
          defaultValue={goal.visibility}
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        >
          <option value="PRIVATE">Private: hidden from public</option>
          <option value="SUMMARY">Summary: category and status only</option>
          <option value="PUBLIC">Public: selected details may be shown</option>
        </select>
      </div>

      <fieldset className="space-y-3 rounded border border-border p-3">
        <legend className="px-1 text-text-muted text-sm">Public details</legend>
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input type="hidden" name="showValues" value="false" />
          <input
            type="checkbox"
            name="showValues"
            value="true"
            defaultChecked={goal.showValues}
            className="accent-accent"
          />
          Show target and actual values (only for Public goals)
        </label>
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input type="hidden" name="showEvidence" value="false" />
          <input
            type="checkbox"
            name="showEvidence"
            value="true"
            defaultChecked={goal.showEvidence}
            className="accent-accent"
          />
          Show evidence image (only for Public goals)
        </label>
      </fieldset>

      <div>
        <label className="block text-text-muted text-sm mb-1">
          Evidence image (optional)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          disabled={uploading}
          className="block w-full text-sm text-text-muted file:mr-3 file:rounded file:border-0 file:bg-bg-secondary file:px-3 file:py-2 file:text-text-primary"
        />
        <input type="hidden" name="imageUrl" value={imageUrl} />
        {uploading && (
          <p className="mt-1 text-xs text-text-muted">Uploading image...</p>
        )}
        {uploadError && (
          <p className="mt-1 text-xs text-red-400">{uploadError}</p>
        )}
        {imageUrl && (
          <p className="mt-1 text-xs text-green-400">
            Evidence image uploaded.
          </p>
        )}
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
        disabled={loading || uploading}
        className="bg-accent text-white px-6 py-2 rounded font-heading hover:opacity-90"
      >
        {loading ? "Saving..." : "Update Goal"}
      </button>
    </form>
  );
}
