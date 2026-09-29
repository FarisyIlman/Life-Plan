"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createContentBlock } from "@/lib/actions/content-block";
import CardGalaxyTheme from "@/components/CardGalaxyTheme";
import CardMonthlyTheme from "@/components/CardMonthlyTheme";
import CardThemeContent from "@/components/CardThemeContent";
import type { ContentBlockPreview } from "@/lib/types";
import { CONTENT_BLOCK_EDITOR_TYPES } from "@/lib/validations/content-block-data";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";

const TYPES = CONTENT_BLOCK_EDITOR_TYPES;

export default function NewContentBlockForm({
  eras,
  goals,
}: {
  eras: { id: string; title: string; theme: string }[];
  goals: { id: string; eraId: string; year: number; category: string }[];
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [selectedEraId, setSelectedEraId] = useState(eras[0]?.id || "");

  const [preview, setPreview] = useState({
    title: "",
    subtitle: "",
    description: "",
    why: "",
    nextAction: "",
    evidenceUrl: "",
    visibility: "PUBLIC" as "PUBLIC" | "SUMMARY" | "PRIVATE",
    techStack: "",
    responsibilities: "",
    deadline: "",
    isCompleted: false,
    textColor: "",
    imageUrl: "",
    imageCaption: "",
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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setPreview((current) => ({ ...current, imageUrl }));
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    } finally {
      setUploading(false);
    }
  };

  const selectedEra = eras.find((e) => e.id === selectedEraId);
  const eraGoals = goals.filter((goal) => goal.eraId === selectedEraId);
  const theme = selectedEra?.theme || "GALAXY";

  const previewBlock: ContentBlockPreview = {
    id: "preview",
    title: preview.title || "Untitled",
    subtitle: preview.subtitle || null,
    deadline: preview.deadline ? new Date(preview.deadline) : null,
    isCompleted: preview.isCompleted,
    data: {
      description: preview.description,
      why: preview.why,
      nextAction: preview.nextAction,
      evidenceUrl: preview.evidenceUrl,
      visibility: preview.visibility,
      techStack: preview.techStack,
      responsibilities: preview.responsibilities,
      textColor: preview.textColor,
      imageUrl: preview.imageUrl,
      imageCaption: preview.imageCaption,
    },
  };

  const renderPreview = () => {
    switch (theme) {
      case "GALAXY":
        return <CardGalaxyTheme block={previewBlock} />;
      case "MONTHLY":
        return <CardMonthlyTheme block={previewBlock} />;
      case "RACING":
        return <CardThemeContent block={previewBlock} theme="GENERIC" />;
      case "VOYAGE":
        return <CardThemeContent block={previewBlock} theme="VOYAGE" />;
      case "TREE":
        return <CardThemeContent block={previewBlock} theme="TREE" />;
      default:
        return <CardThemeContent block={previewBlock} theme="GENERIC" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            Supports goal (optional)
          </label>
          <select
            name="achievementGoalId"
            defaultValue=""
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          >
            <option value="">No linked goal</option>
            {eraGoals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.year} - {goal.category.replaceAll("_", " ")}
              </option>
            ))}
          </select>
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
            Why it matters
          </label>
          <textarea
            name="why"
            rows={2}
            placeholder="How does this move the bigger life or career plan forward?"
            value={preview.why}
            onChange={(e) => setPreview((p) => ({ ...p, why: e.target.value }))}
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">
            Next action
          </label>
          <input
            name="nextAction"
            placeholder="What is the next observable step?"
            value={preview.nextAction}
            onChange={(e) =>
              setPreview((p) => ({ ...p, nextAction: e.target.value }))
            }
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">
            Evidence URL
          </label>
          <input
            name="evidenceUrl"
            type="url"
            placeholder="https://github.com/... or https://..."
            value={preview.evidenceUrl}
            onChange={(e) =>
              setPreview((p) => ({ ...p, evidenceUrl: e.target.value }))
            }
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          />
          {errors.evidenceUrl && (
            <p className="text-red-400 text-sm mt-1">{errors.evidenceUrl[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">
            Public visibility
          </label>
          <select
            name="visibility"
            value={preview.visibility}
            onChange={(e) =>
              setPreview((p) => ({
                ...p,
                visibility: e.target.value as "PUBLIC" | "SUMMARY" | "PRIVATE",
              }))
            }
            className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
          >
            <option value="PUBLIC">Public: show full details</option>
            <option value="SUMMARY">Summary: hide project details</option>
            <option value="PRIVATE">Private: hide from public</option>
          </select>
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">
            Image (optional)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={uploading}
            className="block w-full text-sm text-text-muted file:mr-3 file:rounded file:border-0 file:bg-bg-secondary file:px-3 file:py-2 file:text-text-primary"
          />
          <input type="hidden" name="imageUrl" value={preview.imageUrl} />
          {uploading && (
            <p className="mt-1 text-xs text-text-muted">Uploading image...</p>
          )}
          {uploadError && (
            <p className="mt-1 text-xs text-red-400">{uploadError}</p>
          )}
          {preview.imageUrl && (
            <p className="mt-1 text-xs text-green-400">Image uploaded.</p>
          )}
          <input
            name="imageCaption"
            value={preview.imageCaption}
            onChange={(e) =>
              setPreview((current) => ({
                ...current,
                imageCaption: e.target.value,
              }))
            }
            maxLength={240}
            placeholder="Image caption (optional)"
            className="mt-2 w-full rounded border border-border bg-bg-secondary p-2 text-text-primary"
          />
        </div>

        <div>
          <label className="block text-text-muted text-sm mb-1">
            Text Color (optional)
          </label>
          <div className="flex items-center gap-3">
            <input
              name="textColor"
              type="color"
              value={preview.textColor || "#E8E9ED"}
              onChange={(e) =>
                setPreview((p) => ({ ...p, textColor: e.target.value }))
              }
              className="w-12 h-10 rounded bg-bg-secondary border border-border cursor-pointer"
            />
            <input
              type="text"
              value={preview.textColor}
              onChange={(e) =>
                setPreview((p) => ({ ...p, textColor: e.target.value }))
              }
              placeholder="#E8E9ED (default)"
              className="flex-1 p-2 rounded bg-bg-secondary border border-border text-text-primary text-sm"
            />
          </div>
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
          LIVE PREVIEW ({theme} style)
        </p>
        {renderPreview()}
      </div>
    </div>
  );
}
