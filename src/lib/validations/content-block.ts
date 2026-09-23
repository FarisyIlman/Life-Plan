import { z } from "zod";
import { strictBoolean } from "./boolean";

export const contentBlockSchema = z.object({
  eraId: z.string().min(1, "Era is required"),
  type: z.string().min(1, "Type is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
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
  imageUrl: z.string().optional(),
  imageCaption: z.string().optional(),
});

export type ContentBlockInput = z.infer<typeof contentBlockSchema>;
