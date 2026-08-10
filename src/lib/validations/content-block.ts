import { z } from "zod";

export const contentBlockSchema = z.object({
  eraId: z.string().min(1, "Era is required"),
  type: z.string().min(1, "Type is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  techStack: z.string().optional(),
  responsibilities: z.string().optional(),
  deadline: z.string().optional(), // will be parsed to Date if present
  order: z.coerce.number().int().default(0),
  isPublished: z.coerce.boolean().default(false),
});

export type ContentBlockInput = z.infer<typeof contentBlockSchema>;
