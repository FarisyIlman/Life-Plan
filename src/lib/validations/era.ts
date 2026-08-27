import { z } from "zod";
import { strictBoolean } from "./boolean";

export const eraSchema = z
  .object({
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug must be lowercase, numbers, and hyphens only",
      ),
    title: z.string().min(1, "Title is required"),
    theme: z.enum(["GALAXY", "MONTHLY", "RACING", "VOYAGE", "TREE"]),
    startYear: z.coerce.number().int().min(2020).max(2100),
    endYear: z.coerce.number().int().min(2020).max(2100),
    description: z.string().optional(),
    isPublished: strictBoolean,
    order: z.coerce.number().int().default(0),
  })
  .refine((data) => data.endYear >= data.startYear, {
    message: "End year must be greater than or equal to start year",
    path: ["endYear"],
  });

export type EraInput = z.infer<typeof eraSchema>;
