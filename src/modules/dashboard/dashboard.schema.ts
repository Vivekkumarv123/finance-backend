import { z } from "zod";

export const dashboardQuerySchema = z.object({
  year: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine(
      (val) => val === undefined || (!isNaN(val) && val > 2000),
      {
        message: "Year must be a valid number greater than 2000",
      }
    ),
});