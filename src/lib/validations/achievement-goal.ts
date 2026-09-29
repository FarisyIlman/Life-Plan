import { z } from "zod";
import { strictBoolean } from "./boolean";

export const achievementGoalSchema = z.object({
  eraId: z.string().min(1, "Era is required"),
  year: z.coerce.number().int().min(2020).max(2100),
  category: z.enum([
    "SALARY",
    "SAVING",
    "ACADEMIC",
    "INVESTMENT",
    "CERTIFICATION",
  ]),
  targetMin: z.coerce.number().min(0),
  targetIdeal: z.coerce.number().min(0),
  actualValue: z
    .string()
    .optional()
    .transform((val) => (val && val !== "" ? parseFloat(val) : undefined))
    .pipe(z.number().min(0).optional()),
  status: z
    .enum(["PENDING", "UNDER_ACHIEVED", "ACHIEVED", "OVER_ACHIEVED"])
    .default("PENDING"),
  visibility: z.enum(["PRIVATE", "SUMMARY", "PUBLIC"]).default("PRIVATE"),
  showValues: strictBoolean,
  showEvidence: strictBoolean,
  imageUrl: z
    .string()
    .url()
    .refine((value) => {
      try {
        const url = new URL(value);
        return (
          url.protocol === "https:" && url.hostname === "res.cloudinary.com"
        );
      } catch {
        return false;
      }
    })
    .or(z.literal(""))
    .optional(),
  note: z.string().optional(),
});

export type AchievementGoalInput = z.infer<typeof achievementGoalSchema>;
