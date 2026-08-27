import { z } from "zod";

export const strictBoolean = z
  .enum(["true", "false"])
  .optional()
  .transform((val) => val === "true")
  .pipe(z.boolean());
