"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateContentBlock } from "@/lib/actions/content-block";
import type { ContentBlock } from "@prisma/client";
import CardGalaxyTheme from "@/components/CardGalaxyTheme";
import CardMonthlyTheme from "@/components/CardMonthlyTheme";
import type { ContentBlockPreview } from "@/lib/types";

const TYPES = ["card", "monthly-card"] as const;

export default function EditContentBlockForm({
  block,
  eras,
}: {
  block: ContentBlock;
  eras: { id: string; title: string; theme: string }[];
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const data = (block.data ?? {}) as {
    description?: string;
    techStack?: string;
    responsibilities?: string;
    month?: number;
  };

  const [selectedEraId, setSelectedEraId] = useState(block.eraId);

  // Preview state — initialized from existing block data
  const [preview, setPreview] = useState({
    title: block.title || "",
    subtitle: block.subtitle || "",
    description: data.description || "",
    techStack: data.techStack || "",
    responsibilities: data.responsibilities || "",
    deadline: block.deadline
      ? new Date(block.deadline).toISOString().split("T")[0]
      : "",
    isCompleted: block.isCompleted,
  });

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors({});

    const res = await updateContentBlock(block.id, formData);

    setLoading(false);

    if (res?.error) {
      setErrors(res.error);
      return;
    }

    router.push("/admin/content-blocks");
  };

  const selectedEra = eras.find((e) => e.id === selectedEraId);
  const theme = selectedEra?.theme || "GALAXY";

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

  const renderPreview = () => {
    switch (theme) {
      case "GALAXY":
        return <CardGalaxyTheme block={previewBlock} />;
      case "MONTHLY":
        return <CardMonthlyTheme block={previewBlock} />;
      default:
        return (
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <h3 className="font-heading text-xl text-text-primary mb-1">
              {previewBlock.title}
            </h3>
            {previewBlock.subtitle && (
              <p className="text-text-muted text-sm mb-4">
                {previewBlock.subtitle}
              </p>
            )}
            {preview.description && (
              <p className="text-text-primary text-sm">{preview.description}</p>
            )}
          </div>
        );
    }
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
            value={selectedEraId}
            onChange={(e) => setSelectedEraId(e.target.value)}
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
            defaultValue={block.type}
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
            defaultValue={data.month ?? ""}
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">Title</label>
          <input
            name="title"
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
            defaultValue={block.order}
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublished"
            id="isPublished"
            value="true"
            defaultChecked={block.isPublished}
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
          {loading ? "Saving..." : "Update Content Block"}
        </button>
      </form>

      {/* Live preview panel */}
      <div>
        <p className="text-text-muted text-xs font-heading tracking-wide mb-3">
          LIVE PREVIEW ({theme} style)
        </p>
        {renderPreview()}
      </div>
    </div>
  );
}
