import { z } from "zod";

export const masterDegreeNodeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  nodeType: z.enum(["root", "country", "university", "program"]),
  cost: z.string().optional(),
  requirements: z.string().optional(),
  deadline: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  rationale: z.string().optional(),
  confidence: z.coerce.number().int().min(0).max(100).optional(),
  positionX: z.coerce.number(),
  positionY: z.coerce.number(),
  parentId: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

export type MasterDegreeNodeInput = z.infer<typeof masterDegreeNodeSchema>;
