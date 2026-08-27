"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createContentBlock } from "@/lib/actions/content-block";
import CardGalaxyTheme from "@/components/CardGalaxyTheme";
import type { ContentBlockPreview } from "@/lib/types";

const TYPES = ["card", "monthly-card"] as const;

export default function NewContentBlockForm({
  eras,
}: {
  eras: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // Preview state — mirrors form fields
  const [preview, setPreview] = useState({
    title: "",
    subtitle: "",
    description: "",
    techStack: "",
    responsibilities: "",
    deadline: "",
    isCompleted: false,
  });

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

  // Fake block object shaped like Prisma's ContentBlock, for the preview card
  const previewBlock: ContentBlockPreview = {
    id: "preview",
    title: preview.title || "Untitled",
    subtitle: preview.subtitle || null,
    deadline: preview.deadline ? new Date(preview.deadline) : null,
    isCompleted: preview.isCompleted,
    data: {
      description: preview.description,
      techStack: preview.techStack,
      responsibilities: preview.responsibilities,
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          <label className="block text-text-muted text-sm mb-1">
            Month (only for Monthly theme, 1-12)
          </label>
          <input
            name="month"
            type="number"
            min={1}
            max={12}
            defaultValue=""
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">Title</label>
          <input
            name="title"
            placeholder="Internship at PT Dirgantara Indonesia"
            value={preview.title}
            onChange={(e) =>
              setPreview((p) => ({ ...p, title: e.target.value }))
            }
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
            value={preview.subtitle}
            onChange={(e) =>
              setPreview((p) => ({ ...p, subtitle: e.target.value }))
            }
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
            value={preview.description}
            onChange={(e) =>
              setPreview((p) => ({ ...p, description: e.target.value }))
            }
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">
            Tech Stack
          </label>
          <textarea
            name="techStack"
            rows={2}
            placeholder="Next.js, Prisma, PostgreSQL"
            value={preview.techStack}
            onChange={(e) =>
              setPreview((p) => ({ ...p, techStack: e.target.value }))
            }
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
            value={preview.responsibilities}
            onChange={(e) =>
              setPreview((p) => ({ ...p, responsibilities: e.target.value }))
            }
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">Deadline</label>
          <input
            name="deadline"
            type="date"
            value={preview.deadline}
            onChange={(e) =>
              setPreview((p) => ({ ...p, deadline: e.target.value }))
            }
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isCompleted"
            id="isCompleted"
            value="true"
            checked={preview.isCompleted}
            onChange={(e) =>
              setPreview((p) => ({ ...p, isCompleted: e.target.checked }))
            }
          />
          <label htmlFor="isCompleted" className="text-text-muted text-sm">
            Completed
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

      {/* Live preview panel */}
      <div>
        <p className="text-text-muted text-xs font-heading tracking-wide mb-3">
          LIVE PREVIEW (Galaxy style)
        </p>
        <CardGalaxyTheme block={previewBlock} />
      </div>
    </div>
  );
}
