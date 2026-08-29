import { z } from "zod";

export const masterDegreeNodeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  nodeType: z.enum(["root", "country", "university", "program"]),
  positionX: z.coerce.number(),
  positionY: z.coerce.number(),
  parentId: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

export type MasterDegreeNodeInput = z.infer<typeof masterDegreeNodeSchema>;
