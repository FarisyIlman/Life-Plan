import { z } from "zod";

export const contentBlockSchema = z.object({
  eraId: z.string().min(1, "Era is required"),
  type: z.string().min(1, "Type is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  techStack: z.string().optional(),
  responsibilities: z.string().optional(),
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
  isPublished: z.coerce.boolean().default(false),
  isCompleted: z.coerce.boolean().default(false),
});

export type ContentBlockInput = z.infer<typeof contentBlockSchema>;
