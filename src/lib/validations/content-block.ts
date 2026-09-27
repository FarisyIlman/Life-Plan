import { z } from "zod";
import { strictBoolean } from "./boolean";
import {
  CONTENT_BLOCK_TYPES,
  type ContentBlockType,
} from "./content-block-data";

export const contentBlockSchema = z
  .object({
    eraId: z.string().min(1, "Era is required"),
    type: z.enum(CONTENT_BLOCK_TYPES),
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().optional(),
    achievementGoalId: z.string().optional(),
    description: z.string().optional(),
    why: z.string().optional(),
    nextAction: z.string().optional(),
    evidenceUrl: z
      .string()
      .url("Evidence URL must be valid")
      .or(z.literal(""))
      .optional(),
    visibility: z.enum(["PUBLIC", "SUMMARY", "PRIVATE"]).default("PUBLIC"),
    techStack: z.string().optional(),
    responsibilities: z.string().optional(),
    textColor: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^#[0-9A-Fa-f]{6}$/.test(value),
        "Text color must be a 6-digit hex color",
      ),
    month: z
      .string()
      .optional()
      .transform((val) => (val && val !== "" ? parseInt(val, 10) : undefined))
      .pipe(z.number().int().min(1).max(12).optional()),
    deadline: z
      .string()
      .optional()
      .refine((val) => !val || val === "" || !isNaN(new Date(val).getTime()), {
        message: "Invalid deadline date",
      }),
    order: z.coerce.number().int().default(0),
    isPublished: strictBoolean,
    isCompleted: strictBoolean,
    imageUrl: z
      .string()
      .url("Image URL must be valid")
      .or(z.literal(""))
      .optional(),
    imageCaption: z.string().max(240, "Image caption is too long").optional(),
  })
  .superRefine((value, context) => {
    if (value.type === "monthly-card" && value.month === undefined) {
      context.addIssue({
        code: "custom",
        path: ["month"],
        message: "Monthly content requires a month from 1 to 12.",
      });
    }
  });

export type ContentBlockInput = z.infer<typeof contentBlockSchema>;
export type { ContentBlockType };
