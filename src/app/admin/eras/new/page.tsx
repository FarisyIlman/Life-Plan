"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEra } from "@/lib/actions/era";

const THEMES = ["GALAXY", "MONTHLY", "RACING", "VOYAGE", "TREE"] as const;

export default function NewEraPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors({});

    const res = await createEra(formData);

    setLoading(false);

    if (res?.error) {
      setErrors(res.error);
      return;
    }

    router.push("/admin/eras");
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-6">New Era</h1>

      <form action={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-text-muted text-sm mb-1">Slug</label>
          <input
            name="slug"
            placeholder="2026"
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
          {errors.slug && (
            <p className="text-red-400 text-sm mt-1">{errors.slug[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">Title</label>
          <input
            name="title"
            placeholder="Galaxy Journey"
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">Theme</label>
          <select
            name="theme"
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          >
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.theme && (
            <p className="text-red-400 text-sm mt-1">{errors.theme[0]}</p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-text-muted text-sm mb-1">
              Start Year
            </label>
            <input
              name="startYear"
              type="number"
              placeholder="2026"
              className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
            />
            {errors.startYear && (
              <p className="text-red-400 text-sm mt-1">{errors.startYear[0]}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-text-muted text-sm mb-1">
              End Year
            </label>
            <input
              name="endYear"
              type="number"
              placeholder="2026"
              className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
            />
            {errors.endYear && (
              <p className="text-red-400 text-sm mt-1">{errors.endYear[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">Order</label>
          <input
            name="order"
            type="number"
            defaultValue={0}
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublished"
            id="isPublished"
            value="true"
          />
          <label htmlFor="isPublished" className="text-text-muted text-sm">
            Published
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-white px-6 py-2 rounded font-heading hover:opacity-90"
        >
          {loading ? "Saving..." : "Create Era"}
        </button>
      </form>
    </main>
  );
}
