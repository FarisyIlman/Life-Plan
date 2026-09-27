import { z } from "zod";

export const CONTENT_BLOCK_TYPES = [
  "card",
  "monthly-card",
  "quest-main",
  "quest-bonus",
  "quest-hidden",
  "about-hobby",
  "about-mbti",
] as const;

export type ContentBlockType = (typeof CONTENT_BLOCK_TYPES)[number];

export const CONTENT_BLOCK_EDITOR_TYPES = ["card", "monthly-card"] as const;

const contentBlockDataSchema = z.object({
  description: z.string().default(""),
  why: z.string().default(""),
  nextAction: z.string().default(""),
  evidenceUrl: z.string().default(""),
  visibility: z.enum(["PUBLIC", "SUMMARY", "PRIVATE"]).default("PUBLIC"),
  techStack: z.string().default(""),
  responsibilities: z.string().default(""),
  month: z.number().int().min(1).max(12).nullable().default(null),
  textColor: z.string().nullable().default(null),
  imageUrl: z.string().url().nullable().default(null),
  imageCaption: z.string().max(240).nullable().default(null),
});

export function getContentBlockDataSchema(type: ContentBlockType) {
  if (type === "monthly-card") {
    return contentBlockDataSchema.superRefine((data, context) => {
      if (data.month === null) {
        context.addIssue({
          code: "custom",
          path: ["month"],
          message: "Monthly content requires a month from 1 to 12.",
        });
      }
    });
  }

  return contentBlockDataSchema;
}

export type ContentBlockData = z.infer<typeof contentBlockDataSchema>;
