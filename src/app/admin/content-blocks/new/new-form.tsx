"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createContentBlock } from "@/lib/actions/content-block";

const TYPES = ["card", "monthly-card"] as const;

export default function NewContentBlockForm({
  eras,
}: {
  eras: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors({});

    const res = await createContentBlock(formData);

    setLoading(false);

    if (res?.error) {
      setErrors(res.error);
      return;
    }

    router.push("/admin/content-blocks");
  };

  return (
    <form action={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block text-text-muted text-sm mb-1">Era</label>
        <select
          name="eraId"
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
        <label className="block text-text-muted text-sm mb-1">Type</label>
        <select
          name="type"
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="text-red-400 text-sm mt-1">{errors.type[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">Title</label>
        <input
          name="title"
          placeholder="Internship at PT Dirgantara Indonesia"
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">Subtitle</label>
        <input
          name="subtitle"
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
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
        <label className="block text-text-muted text-sm mb-1">Tech Stack</label>
        <textarea
          name="techStack"
          rows={2}
          placeholder="Next.js, Prisma, PostgreSQL"
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">
          Responsibilities
        </label>
        <textarea
          name="responsibilities"
          rows={3}
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">Deadline</label>
        <input
          name="deadline"
          type="date"
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
        {loading ? "Saving..." : "Create Content Block"}
      </button>
    </form>
  );
}
